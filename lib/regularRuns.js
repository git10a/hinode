export const REGULAR_RUNS = [
    {
        id: 'kokyo',
        name: '皇居ラン',
        place: '皇居',
        day: '毎週水曜',
        dayShort: '水曜',
        dayOfWeek: 3,
        time: '06:00〜',
        timeRaw: '06:00',
        meetingPlace: '桔梗門前派出所',
        meetingShort: '桔梗門派出所前',
        distance: '約5km',
        image: '/assets/Kokyo.jpg',
        scheduleHref: '/schedule#kokyo',
    },
    {
        id: 'meguro',
        name: '目黒川ラン',
        place: '目黒川',
        day: '毎週木曜',
        dayShort: '木曜',
        dayOfWeek: 4,
        time: '06:00〜',
        timeRaw: '06:00',
        meetingPlace: 'スターバックス 中目黒蔦屋書店前',
        meetingShort: '中目黒駅スタバ前',
        distance: '約4km',
        image: '/assets/Meguro.jpg',
        scheduleHref: '/schedule#meguro',
    },
    {
        id: 'yoyogi',
        name: '代々木公園ラン',
        place: '代々木公園',
        day: '毎週日曜',
        dayShort: '日曜',
        dayOfWeek: 0,
        time: '07:15〜',
        timeRaw: '07:15',
        meetingPlace: '原宿時計塔前',
        meetingShort: '原宿時計塔前',
        distance: '約2〜4km',
        image: '/assets/Yoyogi.jpg',
        scheduleHref: '/schedule#yoyogi',
        recommendationLabel: '初参加におすすめ',
        isFirstChoice: true,
    },
];

export function getRegularRun(id) {
    return REGULAR_RUNS.find((run) => run.id === id);
}

export const FIRST_CHOICE_RUN = REGULAR_RUNS.find((run) => run.isFirstChoice);
