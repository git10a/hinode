import SunCalc from 'suncalc';

const JST = 'Asia/Tokyo';

function formatTime(date) {
  if (!date || isNaN(date.getTime())) return '--:--';
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: JST,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function formatDate(date) {
  return date.toLocaleDateString('ja-JP', {
    timeZone: JST,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

function minutesToHHMM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}時間${m.toString().padStart(2, '0')}分`;
}

export function getSunTimes(date, lat, lng) {
  const times = SunCalc.getTimes(date, lat, lng);
  const sunrise = times.sunrise;
  const sunset = times.sunset;
  const solarNoon = times.solarNoon;
  const dayLengthMin = (sunset - sunrise) / 1000 / 60;

  return {
    date: formatDate(date),
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset),
    solarNoon: formatTime(solarNoon),
    dayLength: minutesToHHMM(dayLengthMin),
    dayLengthMin: Math.round(dayLengthMin),
  };
}

export function getSunTimesRange(lat, lng, days = 7) {
  const results = [];
  const now = new Date();
  // JST今日の0時を基準に
  const todayJST = new Date(
    new Intl.DateTimeFormat('en-CA', { timeZone: JST }).format(now)
  );
  for (let i = 0; i < days; i++) {
    const d = new Date(todayJST);
    d.setDate(d.getDate() + i);
    results.push(getSunTimes(d, lat, lng));
  }
  return results;
}

const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export function getMonthlySunrise(lat, lng, year) {
  return MONTH_NAMES.map((month, idx) => {
    // 各月15日を代表値として使用
    const d = new Date(year, idx, 15, 6, 0, 0);
    const times = SunCalc.getTimes(d, lat, lng);
    const sunrise = times.sunrise;
    const sunset = times.sunset;
    const dayLengthMin = (sunset - sunrise) / 1000 / 60;
    return {
      month,
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
      dayLength: minutesToHHMM(dayLengthMin),
    };
  });
}
