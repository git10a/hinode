import { NextResponse } from 'next/server';

export async function GET(request) {
    // Vercel Cron sends this header automatically in production
    if (
        process.env.NODE_ENV === 'production' &&
        request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const statsUrl = new URL('/api/stats', request.url);
        const response = await fetch(statsUrl);
        const data = await response.json();

        return NextResponse.json({
            success: response.ok,
            memberCount: data.memberCount,
            error: data.error || null,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
