const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const WEATHER_REVALIDATE_SECONDS = 30 * 60;
const JST_TIME_ZONE = 'Asia/Tokyo';

const WEATHER_CODE_SUMMARIES = {
    0: { condition: '晴れ', tone: 'sunny' },
    1: { condition: '晴れ', tone: 'sunny' },
    2: { condition: '晴れ時々曇り', tone: 'cloudy' },
    3: { condition: '曇り', tone: 'cloudy' },
    45: { condition: '霧', tone: 'fog' },
    48: { condition: '霧', tone: 'fog' },
    51: { condition: '小雨', tone: 'rain' },
    53: { condition: '小雨', tone: 'rain' },
    55: { condition: '小雨', tone: 'rain' },
    56: { condition: '小雨', tone: 'rain' },
    57: { condition: '小雨', tone: 'rain' },
    61: { condition: '小雨', tone: 'rain' },
    63: { condition: '雨', tone: 'rain' },
    65: { condition: '強い雨', tone: 'rain' },
    66: { condition: '雨', tone: 'rain' },
    67: { condition: '強い雨', tone: 'rain' },
    71: { condition: '雪', tone: 'snow' },
    73: { condition: '雪', tone: 'snow' },
    75: { condition: '強い雪', tone: 'snow' },
    77: { condition: '雪', tone: 'snow' },
    80: { condition: 'にわか雨', tone: 'rain' },
    81: { condition: 'にわか雨', tone: 'rain' },
    82: { condition: '強い雨', tone: 'rain' },
    85: { condition: 'にわか雪', tone: 'snow' },
    86: { condition: '強い雪', tone: 'snow' },
    95: { condition: '雷雨', tone: 'storm' },
    96: { condition: '雷雨', tone: 'storm' },
    99: { condition: '雷雨', tone: 'storm' },
};

function jstParts(dateInput) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: JST_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(date);

    return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function weatherSummaryForCode(code) {
    return WEATHER_CODE_SUMMARIES[code] || { condition: '天気確認中', tone: 'unknown' };
}

function getJstHourKey(dateInput) {
    const parts = jstParts(dateInput);
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:00`;
}

function getTimeLabel(hourKey) {
    return `${Number(hourKey.slice(11, 13))}時台`;
}

async function getWeatherForecastForRun(run) {
    if (!run?.id || !run.latitude || !run.longitude || !run.startAt) {
        return null;
    }

    const hourKey = getJstHourKey(run.startAt);
    const date = hourKey.slice(0, 10);
    const params = new URLSearchParams({
        latitude: String(run.latitude),
        longitude: String(run.longitude),
        hourly: 'temperature_2m,weather_code',
        timezone: JST_TIME_ZONE,
        start_date: date,
        end_date: date,
    });

    try {
        const res = await fetch(`${WEATHER_API_URL}?${params.toString()}`, {
            next: { revalidate: WEATHER_REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            console.error('Weather forecast fetch failed:', res.status);
            return null;
        }

        const data = await res.json();
        const times = data?.hourly?.time;
        const temperatures = data?.hourly?.temperature_2m;
        const weatherCodes = data?.hourly?.weather_code;
        if (!Array.isArray(times) || !Array.isArray(temperatures) || !Array.isArray(weatherCodes)) {
            return null;
        }

        const index = times.indexOf(hourKey);
        if (index < 0) return null;

        const temperature = temperatures[index];
        const weatherCode = weatherCodes[index];
        if (typeof temperature !== 'number' || typeof weatherCode !== 'number') {
            return null;
        }

        const summary = weatherSummaryForCode(weatherCode);
        return {
            ...summary,
            temperature: Math.round(temperature),
            timeLabel: getTimeLabel(hourKey),
        };
    } catch (error) {
        console.error('Weather forecast fetch error:', error.message);
        return null;
    }
}

export async function getWeatherForecastsForRuns(runs) {
    const entries = await Promise.all(
        runs.map(async (run) => [run.id, await getWeatherForecastForRun(run)])
    );

    return Object.fromEntries(entries.filter(([, forecast]) => Boolean(forecast)));
}
