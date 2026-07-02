import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BLOG_ENDPOINT = 'blogs';

function isValidSignature(body, signature, secret) {
    if (!signature) return false;
    const expected = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    return signatureBuffer.length === expectedBuffer.length
        && crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

function getContentId(payload) {
    return payload?.id
        || payload?.contents?.new?.id
        || payload?.contents?.old?.id
        || payload?.contents?.new?.publishValue?.id
        || payload?.contents?.old?.publishValue?.id
        || null;
}

export async function POST(request) {
    const secret = process.env.MICROCMS_WEBHOOK_SECRET;
    if (!secret) {
        return NextResponse.json({ ok: false, error: 'Webhook secret is not configured.' }, { status: 503 });
    }

    const body = await request.text();
    const signature = request.headers.get('x-microcms-signature');
    if (!isValidSignature(body, signature, secret)) {
        return NextResponse.json({ ok: false, error: 'Invalid signature.' }, { status: 401 });
    }

    let payload;
    try {
        payload = JSON.parse(body);
    } catch {
        return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }

    if (payload.api && payload.api !== BLOG_ENDPOINT) {
        return NextResponse.json({ ok: true, skipped: true, reason: 'Not a blog update.' });
    }

    const contentId = getContentId(payload);
    const paths = ['/', '/blog', '/sitemap.xml'];
    if (contentId) paths.push(`/blog/${contentId}`);

    for (const path of paths) {
        revalidatePath(path);
    }
    revalidatePath('/blog/[slug]', 'page');

    return NextResponse.json({
        ok: true,
        revalidated: paths,
        revalidatedPattern: '/blog/[slug]',
    });
}
