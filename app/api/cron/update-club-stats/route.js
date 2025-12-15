import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

export async function GET() {
    try {
        const {
            STRAVA_CLIENT_ID,
            STRAVA_CLIENT_SECRET,
            STRAVA_REFRESH_TOKEN,
        } = process.env;

        if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
            return NextResponse.json(
                { error: 'Missing environment variables' },
                { status: 500 }
            );
        }

        // 1. Get Access Token
        const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: STRAVA_CLIENT_ID,
                client_secret: STRAVA_CLIENT_SECRET,
                refresh_token: STRAVA_REFRESH_TOKEN,
                grant_type: 'refresh_token',
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Strava Token Error:', errorData);
            return NextResponse.json(
                { error: 'Failed to refresh token', details: errorData },
                { status: tokenResponse.status }
            );
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Get Club Member Count
        const clubId = '1772485';
        const clubResponse = await fetch(`https://www.strava.com/api/v3/clubs/${clubId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!clubResponse.ok) {
            const errorData = await clubResponse.json();
            console.error('Strava Club Error:', errorData);
            return NextResponse.json(
                { error: 'Failed to fetch club data', details: errorData },
                { status: clubResponse.status }
            );
        }

        const clubData = await clubResponse.json();
        const memberCount = clubData.member_count;

        // 3. Save to JSON
        const stats = {
            member_count: memberCount,
            updated_at: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        };

        const filePath = path.join(process.cwd(), 'public', 'club-stats.json');
        fs.writeFileSync(filePath, JSON.stringify(stats, null, 2));

        return NextResponse.json({
            message: 'Club stats updated successfully',
            data: stats,
        });

    } catch (error) {
        console.error('Internal Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
