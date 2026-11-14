import { NextResponse } from 'next/server';
import { CONTACT_CATEGORIES, START_INVOLVEMENTS } from '@/lib/contactOptions';
import { CONTACT_EMAIL } from '@/lib/site';

export const runtime = 'nodejs';

const RESEND_API_URL = 'https://api.resend.com/emails';

// 問い合わせ種別ごとの表示名。ここに無い inquiryType は受け付けない。
const INQUIRY_TYPE_LABELS = {
    community: 'コース・参加',
    work: 'お仕事・取材',
    start: '新しい街',
};

// 受け取る項目と最大文字数
const FIELD_MAX_LENGTHS = {
    inquiryType: 20,
    name: 80,
    organization: 120,
    email: 254,
    category: 40,
    timing: 120,
    details: 2500,
    area: 100,
    nearestStation: 100,
    preferredDay: 100,
    involvement: 20,
};

function respond(ok, status = 200) {
    return NextResponse.json({ ok }, { status });
}

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

function parseFields(body) {
    const fields = Object.fromEntries(
        Object.entries(FIELD_MAX_LENGTHS).map(([key, maxLength]) => [key, cleanText(body[key], maxLength)])
    );
    return { ...fields, email: fields.email.toLowerCase() };
}

function isValidInquiry(fields) {
    const { inquiryType, email } = fields;
    if (!Object.hasOwn(INQUIRY_TYPE_LABELS, inquiryType)) return false;
    if (email && !isValidEmail(email)) return false;

    if (inquiryType === 'start') {
        return Boolean(
            fields.area
            && fields.nearestStation
            && fields.preferredDay
            && START_INVOLVEMENTS.includes(fields.involvement)
            && email
        );
    }

    if (!CONTACT_CATEGORIES[inquiryType].includes(fields.category) || !fields.details) return false;
    // お仕事・取材は返信が前提なので、名前と連絡先を必須にする
    return inquiryType !== 'work' || Boolean(fields.name && email);
}

function buildStartMail(fields) {
    return {
        subject: `【HINODE 新しい街】${fields.area}｜${fields.involvement}`,
        text: [
            'HINODEを自分の街で始めるフォームから連絡がありました。',
            '',
            `エリア: ${fields.area}`,
            `最寄駅: ${fields.nearestStation}`,
            `希望曜日: ${fields.preferredDay}`,
            `関わり方: ${fields.involvement}`,
            `メールアドレス: ${fields.email}`,
        ].join('\n'),
    };
}

function buildInquiryMail(fields) {
    const typeLabel = INQUIRY_TYPE_LABELS[fields.inquiryType];
    const safeName = (fields.name || '匿名').replace(/[\r\n]+/g, ' ');
    const workLines = fields.inquiryType === 'work'
        ? [
            `会社名・媒体名: ${fields.organization || '未入力'}`,
            `希望時期・公開予定日: ${fields.timing || '未入力'}`,
        ]
        : [];

    return {
        subject: `【HINODE ${typeLabel}】${fields.category}｜${safeName}`,
        text: [
            `HINODEのお問い合わせフォームから${typeLabel}について連絡がありました。`,
            '',
            `お問い合わせ種別: ${typeLabel}`,
            `具体的な内容: ${fields.category}`,
            `お名前: ${fields.name || '未入力'}`,
            `メールアドレス: ${fields.email || '未入力'}`,
            ...workLines,
            '',
            '詳細:',
            fields.details,
        ].join('\n'),
    };
}

export async function POST(request) {
    if (!isAllowedOrigin(request)) {
        return respond(false, 403);
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return respond(false, 400);
    }

    // ハニーポット: 人には見えない項目が埋まっていたら、成功を装って捨てる
    if (cleanText(body.website, 200)) {
        return respond(true);
    }

    const fields = parseFields(body);
    if (!isValidInquiry(fields)) {
        return respond(false, 400);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !from) {
        console.error('Contact mail is not configured.');
        return respond(false, 503);
    }

    const mail = fields.inquiryType === 'start' ? buildStartMail(fields) : buildInquiryMail(fields);

    try {
        const response = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL],
                ...(fields.email ? { reply_to: fields.email } : {}),
                ...mail,
            }),
            cache: 'no-store',
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.id) {
            console.error('Contact mail delivery request failed.', {
                status: response.status,
                providerError: result?.message || result?.name || 'unknown',
            });
            return respond(false, 502);
        }

        console.info('Contact mail accepted.', { emailId: result.id });
        return respond(true);
    } catch (error) {
        console.error('Contact mail request failed.', {
            message: error instanceof Error ? error.message : 'unknown',
        });
        return respond(false, 502);
    }
}
