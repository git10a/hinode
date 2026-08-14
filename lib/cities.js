import { REGULAR_RUNS } from './regularRuns';

export const CITIES = [
    {
        slug: 'tokyo',
        name: '東京',
        label: 'TOKYO',
        status: '毎週開催',
        description: '皇居・目黒川・代々木公園を中心に、週3回の通常開催を続けています。',
        image: '/assets/komazawa.jpg',
    },
    {
        slug: 'kyoto',
        name: '京都',
        label: 'KYOTO',
        status: '活動中',
        description: 'HINODE KYOTOとして活動しています。開催日時や集合場所は、決まり次第公式SNSで案内します。',
        image: '/assets/hinodekyoto1.jpg',
    },
];

export function getCity(slug) {
    return CITIES.find((city) => city.slug === slug);
}

export function getCityRuns(slug) {
    return REGULAR_RUNS.filter((run) => run.citySlug === slug);
}
