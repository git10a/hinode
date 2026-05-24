import crypto from 'crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const RUN_REPORT_URL = 'https://analyticsdata.googleapis.com/v1beta';
const ANALYTICS_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

function base64Url(value) {
    return Buffer.from(value)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function encodeJson(value) {
    return base64Url(JSON.stringify(value));
}

function getAnalyticsPropertyId() {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
        || process.env.GA4_PROPERTY_ID
        || process.env.GA_PROPERTY_ID;

    return propertyId ? propertyId.replace(/^properties\//, '') : null;
}

function getServiceAccountCredentials() {
    if (process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON) {
        try {
            const credentials = JSON.parse(process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON);
            return {
                clientEmail: credentials.client_email,
                privateKey: credentials.private_key,
            };
        } catch (error) {
            console.warn('Failed to parse GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON.');
        }
    }

    return {
        clientEmail: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY,
    };
}

async function getAccessToken({ clientEmail, privateKey }) {
    const now = Math.floor(Date.now() / 1000);
    const header = {
        alg: 'RS256',
        typ: 'JWT',
    };
    const claimSet = {
        iss: clientEmail,
        scope: ANALYTICS_SCOPE,
        aud: TOKEN_URL,
        exp: now + 3600,
        iat: now,
    };
    const unsignedJwt = `${encodeJson(header)}.${encodeJson(claimSet)}`;
    const normalizedPrivateKey = privateKey.replace(/\\n/g, '\n');
    const signature = crypto
        .createSign('RSA-SHA256')
        .update(unsignedJwt)
        .sign(normalizedPrivateKey);
    const jwt = `${unsignedJwt}.${base64Url(signature)}`;

    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });

    if (!response.ok) {
        throw new Error(`Google OAuth token request failed with ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
}

function extractBlogPostId(path) {
    const match = path.match(/^\/blog\/([^/?#]+)\/?$/);
    return match ? match[1] : null;
}

export async function getPopularBlogPostIds() {
    const propertyId = getAnalyticsPropertyId();
    const { clientEmail, privateKey } = getServiceAccountCredentials();

    if (!propertyId || !clientEmail || !privateKey) {
        return [];
    }

    try {
        const accessToken = await getAccessToken({ clientEmail, privateKey });
        const response = await fetch(`${RUN_REPORT_URL}/properties/${propertyId}:runReport`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dateRanges: [
                    {
                        startDate: '365daysAgo',
                        endDate: 'today',
                    },
                ],
                dimensions: [
                    {
                        name: 'pagePath',
                    },
                ],
                metrics: [
                    {
                        name: 'screenPageViews',
                    },
                ],
                dimensionFilter: {
                    filter: {
                        fieldName: 'pagePath',
                        stringFilter: {
                            matchType: 'BEGINS_WITH',
                            value: '/blog/',
                        },
                    },
                },
                orderBys: [
                    {
                        metric: {
                            metricName: 'screenPageViews',
                        },
                        desc: true,
                    },
                ],
                limit: 50,
            }),
        });

        if (!response.ok) {
            throw new Error(`Google Analytics report request failed with ${response.status}`);
        }

        const data = await response.json();
        const popularIds = (data.rows || [])
            .map((row) => extractBlogPostId(row.dimensionValues?.[0]?.value || ''))
            .filter(Boolean);

        return Array.from(new Set(popularIds));
    } catch (error) {
        console.warn('Failed to fetch popular blog posts from Google Analytics.', error.message);
        return [];
    }
}
