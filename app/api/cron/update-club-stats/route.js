import { NextResponse } from 'next/server';

export async function GET(request) {
    // Check for authorization if needed (Vercel Cron automatically adds header)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
        // return new NextResponse('Unauthorized', { status: 401 });
        // For now, let's keep it open or just log, as we are just fetching public data
    }

    try {
        // Trigger the stats update by calling the stats API (or just let the revalidation handle it)
        // Since we set revalidate on the stats API, hitting it might help, 
        // but mainly this is a placeholder for more complex logic if we were saving to DB.

        // For now, we can just fetch the stats API to ensure it's fresh
        const statsUrl = new URL('/api/stats', request.url);
        const response = await fetch(statsUrl);
        const data = await response.json();

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
