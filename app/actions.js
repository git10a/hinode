'use server';

export async function fetchStravaStats() {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    const refreshToken = process.env.STRAVA_REFRESH_TOKEN;
    const clubId = '1772485'; // HINODE Club ID

    if (!clientId || !clientSecret || !refreshToken) {
        console.error('Missing Strava credentials');
        return null;
    }

    try {
        // 1. Get Access Token
        const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
            cache: 'no-store',
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to refresh token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Fetch Club Details
        const clubResponse = await fetch(`https://www.strava.com/api/v3/clubs/${clubId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!clubResponse.ok) {
            throw new Error('Failed to fetch club data');
        }

        const clubData = await clubResponse.json();
        return clubData.member_count;

    } catch (error) {
        console.error('Error fetching Strava stats:', error);
        return null;
    }
}
