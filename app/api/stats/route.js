import { NextResponse } from 'next/server';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
    try {
        const response = await fetch('https://www.strava.com/api/v3/clubs/1772485', {
            headers: {
                'Authorization': 'Bearer 4928c447856d7b45e5553c530778ab945810d709'
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Strava data: ${response.status}`);
        }

        const data = await response.json();
        const memberCount = data.member_count;

        return NextResponse.json({ memberCount });
    } catch (error) {
        console.error('Error fetching Strava stats:', error);
        return NextResponse.json({ memberCount: 0, error: error.message }, { status: 500 });
    }
}
