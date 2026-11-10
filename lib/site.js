// サイト全体で共有する定数。ドメインや外部リンクを変えるときはここだけ直す。
export const SITE_NAME = 'HINODE';
export const SITE_URL = 'https://hinode-run.com';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const DEFAULT_OG_IMAGE = '/assets/ogp-home.jpg';
export const CONTACT_EMAIL = 'hinode.run@gmail.com';
export const GA_MEASUREMENT_ID = 'G-CDCR6WTVNQ';

export const INSTAGRAM_URL = 'https://www.instagram.com/hinode_run/';

// Stravaクラブへのリンクは3種類の表記が混在している（いずれも同じクラブ）。
// 既存の導線のURLを変えないよう、用途ごとに使い分けている。
export const STRAVA_CLUB_ID = '1772485';
export const STRAVA_CLUB_URL = `https://www.strava.com/clubs/${STRAVA_CLUB_ID}`;
export const STRAVA_CLUB_VANITY_URL = 'https://www.strava.com/clubs/hinode';
export const STRAVA_APP_LINK = 'https://strava.app.link/pQ0uMuWWj2b';

export const RUNNERS_SALON_URL = 'https://www.bs-tvtokyo.co.jp/runners_salon/';

export const SOCIAL_LINKS = [
    { key: 'instagram', label: 'Instagram', href: INSTAGRAM_URL },
    { key: 'strava', label: 'Strava', href: STRAVA_CLUB_VANITY_URL },
];

export function absoluteUrl(path = '') {
    return `${SITE_URL}${path}`;
}

export function stravaEventUrl(eventId) {
    return `${STRAVA_CLUB_URL}/group_events/${eventId}`;
}
