import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const CONTACT_EMAIL = process.env.CONTACT_TO_EMAIL || 'hinode.run@gmail.com';
const COMMUNITY_CATEGORIES = new Set([
    '企画ランのアイデア',
    '走ってほしいコース',
    '参加について',
    'その他',
]);
const WORK_CATEGORIES = new Set([
    'HINODE拠点導入',
    '地域ラン企画',
    'ランニングイベント',
    '大会・ランニングイベントのWeb制作',
    '仕事依頼',
    '取材・掲載',
    '講演・イベント出演',
    '協業・スポンサー相談',
    'その他',
]);

function cleanText(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
}

function isValidEmail(value) {
    return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isAllowedOrigin(request) {
    const origin = request.headers.get('origin');
    if (!origin) return false;

    try {
        return new URL(origin).host === new URL(request.url).host;
    } catch {
        return false;
    }
}

export async function POST(request) {
    if (!isAllowedOrigin(request)) {
        return NextResponse.json({ ok: false }, { status: 403 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (cleanText(body.website, 200)) {
        return NextResponse.json({ ok: true });
    }

    const inquiryType = cleanText(body.inquiryType, 20);
    const name = cleanText(body.name, 80);
    const organization = cleanText(body.organization, 120);
    const email = cleanText(body.email, 254).toLowerCase();
    const category = cleanText(body.category, 40);
    const timing = cleanText(body.timing, 120);
    const details = cleanText(body.details, 2500);
    const area = cleanText(body.area, 100);
    const nearestStation = cleanText(body.nearestStation, 100);
    const preferredDay = cleanText(body.preferredDay, 100);
    const involvement = cleanText(body.involvement, 20);
    const isWork = inquiryType === 'work';
    const isCommunity = inquiryType === 'community';
    const isStart = inquiryType === 'start';
    const allowedCategories = isWork ? WORK_CATEGORIES : COMMUNITY_CATEGORIES;

    if (
        (!isWork && !isCommunity && !isStart)
        || (!isStart && !allowedCategories.has(category))
        || (!isStart && !details)
        || (email && !isValidEmail(email))
        || (isWork && (!name || !email))
        || (isStart && (
            !area
            || !nearestStation
            || !preferredDay
            || !['参加したい', 'ホストしたい'].includes(involvement)
            || !email
            || !isValidEmail(email)
        ))
    ) {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !from) {
        console.error('Contact mail is not configured.');
        return NextResponse.json({ ok: false }, { status: 503 });
    }

    const safeName = (name || '匿名').replace(/[\r\n]+/g, ' ');
    const typeLabel = isStart ? '新しい街' : isWork ? 'お仕事・取材' : '企画・参加';
    const subject = isStart
        ? `【HINODE 新しい街】${area}｜${involvement}`
        : `【HINODE ${typeLabel}】${category}｜${safeName}`;
    const text = isStart ? [
        'HINODEを自分の街で始めるフォームから連絡がありました。',
        '',
        `エリア: ${area}`,
        `最寄駅: ${nearestStation}`,
        `希望曜日: ${preferredDay}`,
        `関わり方: ${involvement}`,
        `メールアドレス: ${email}`,
    ].join('\n') : [
        `HINODEのお問い合わせフォームから${typeLabel}について連絡がありました。`,
        '',
        `お問い合わせ種別: ${typeLabel}`,
        `具体的な内容: ${category}`,
        `お名前: ${name || '未入力'}`,
        `メールアドレス: ${email || '未入力'}`,
        ...(isWork ? [
            `会社名・媒体名: ${organization || '未入力'}`,
            `希望時期・公開予定日: ${timing || '未入力'}`,
        ] : []),
        '',
        '詳細:',
        details,
    ].join('\n');

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [CONTACT_EMAIL],
                ...(email ? { reply_to: email } : {}),
                subject,
                text,
            }),
            cache: 'no-store',
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.id) {
            console.error('Contact mail delivery request failed.', {
                status: response.status,
                providerError: result?.message || result?.name || 'unknown',
            });
            return NextResponse.json({ ok: false }, { status: 502 });
        }

        console.info('Contact mail accepted.', { emailId: result.id });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Contact mail request failed.', {
            message: error instanceof Error ? error.message : 'unknown',
        });
        return NextResponse.json({ ok: false }, { status: 502 });
    }
}
