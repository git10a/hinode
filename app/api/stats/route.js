import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour

const CLUB_ID = '1772485'; // HINODE Club ID

export async function GET() {
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

    // Check for required environment variables
    if (!clientId || !clientSecret || !refreshToken) {
        console.error('Missing Strava credentials in environment variables');
        return NextResponse.json(
            { memberCount: 0, error: 'Missing Strava credentials' },
            { status: 500 }
        );
    }

    try {
        // Step 1: Get fresh access token using refresh token
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
            const errorText = await tokenResponse.text();
            throw new Error(`Failed to refresh token: ${tokenResponse.status} - ${errorText}`);
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Step 2: Fetch club details with fresh access token
        const clubResponse = await fetch(`https://www.strava.com/api/v3/clubs/${CLUB_ID}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            cache: 'no-store',
        });

        if (!clubResponse.ok) {
            throw new Error(`Failed to fetch club data: ${clubResponse.status}`);
        }

        const clubData = await clubResponse.json();
        const memberCount = clubData.member_count;

        return NextResponse.json({ memberCount });
    } catch (error) {
        console.error('Error fetching Strava stats:', error);
        return NextResponse.json(
            { memberCount: 0, error: error.message },
            { status: 500 }
        );
    }
}
