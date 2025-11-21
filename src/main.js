import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => observer.observe(el));

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Calendar Button Logic
  const initCalendarButton = async () => {
    const btn = document.getElementById('calendar-btn');
    if (!btn) return;

    const now = new Date();
    const today = now.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat

    let nextRun = null;
    let location = '';
    let lat = 0;
    let lon = 0;
    let timeStr = '';
    let startTime = '';
    let endTime = '';

    // Logic:
    // If today is Mon, Tue, Wed (before 6:20), next is Wed.
    // Else next is Sun.
    // Note: Simplification for "next run".
    // Wed: 06:20 @ Imperial Palace (35.6852, 139.7528)
    // Sun: 07:30 @ Yoyogi Park (35.6717, 139.6949)

    // Fixed next run date: November 23, 2025 at 07:30 at Yoyogi Park
    nextRun = new Date('2025-11-23T07:30:00');
    location = '代々木公園';
    lat = 35.6717;
    lon = 139.6949;
    timeStr = '07:30';
    startTime = '073000';
    endTime = '083000';

    // Format Date: M月D日 (Day)
    const month = nextRun.getMonth() + 1;
    const date = nextRun.getDate();
    const dayStr = ['日', '月', '火', '水', '木', '金', '土'][nextRun.getDay()];
    const dateString = `${month}月${date}日 (${dayStr})`;

    // Fetch Weather
    let weatherEmoji = '';
    try {
      const dateISO = nextRun.toISOString().split('T')[0];
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code&timezone=Asia%2FTokyo&start_date=${dateISO}&end_date=${dateISO}`);
      const data = await res.json();
      if (data.daily && data.daily.weather_code) {
        const code = data.daily.weather_code[0];
        // WMO Code mapping
        // 0: Clear, 1-3: Cloudy, 45-48: Fog, 51-67: Rain, 71-77: Snow, 80-82: Showers, 95-99: Thunderstorm
        if (code === 0) weatherEmoji = '☀️';
        else if (code >= 1 && code <= 3) weatherEmoji = '☁️';
        else if (code >= 45 && code <= 48) weatherEmoji = '🌫️';
        else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) weatherEmoji = '☔️';
        else if (code >= 71 && code <= 77) weatherEmoji = '☃️';
        else if (code >= 95 && code <= 99) weatherEmoji = '⚡️';
        else weatherEmoji = '';
      }
    } catch (e) {
      console.error('Weather fetch failed', e);
    }

    // Yahoo Weather URL
    // Chiyoda (Imperial Palace): https://weather.yahoo.co.jp/weather/jp/13/4410/13101.html
    // Shibuya (Yoyogi Park): https://weather.yahoo.co.jp/weather/jp/13/4410/13113.html
    const weatherUrl = location === '皇居'
      ? 'https://weather.yahoo.co.jp/weather/jp/13/4410/13101.html'
      : 'https://weather.yahoo.co.jp/weather/jp/13/4410/13113.html';

    // Google Maps URL for Calendar Location
    const mapUrl = location === '皇居'
      ? 'https://maps.app.goo.gl/y51G6CCgEXf1nsFe8'
      : 'https://maps.app.goo.gl/tEdmjJM7ANFTXKLv8';

    // Update Button HTML
    // We use a span for the weather link to handle the click separately
    const weatherHtml = weatherEmoji ? `
      <span class="weather-link" data-url="${weatherUrl}" title="Yahoo!天気で確認">
        ${weatherEmoji}
        <svg class="external-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-7h-2v7z"/>
        </svg>
      </span>
    ` : '';

    btn.innerHTML = `次回のチームランDayをカレンダーに登録する 👉 ${dateString} ${timeStr} @${location} ${weatherHtml}`;

    // Add click listener to weather link
    const weatherLink = btn.querySelector('.weather-link');
    if (weatherLink) {
      weatherLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent opening Google Calendar
        window.open(weatherLink.dataset.url, '_blank');
      });
    }

    // Update Link
    const year = nextRun.getFullYear();
    const monthPad = String(month).padStart(2, '0');
    const datePad = String(date).padStart(2, '0');
    const dateParam = `${year}${monthPad}${datePad}`;
    const dates = `${dateParam}T${startTime}/${dateParam}T${endTime}`;

    const details = `日の出ランにご参加いただき、本当にありがとうございます！嬉しいです。お会いできるのを楽しみにしています。（もし寝坊とかしてもまったくお気になさらずです。またいつでも来てください！笑）

ご質問やご連絡はInstagramでやりとりしますので、フォローいただけたら嬉しいです。
👉 https://www.instagram.com/hinode_run/

Stravaで記録をつけるとモチベが上がり、習慣の継続率がUPします！
👉 https://www.strava.com/clubs/hinode

時間どおりにスタートするので、数分早めに来ておいてもらえると助かります。`;

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=HINODE%E3%83%81%E3%83%BC%E3%83%A0%E3%83%A9%E3%83%B3&dates=${dates}&location=${encodeURIComponent(mapUrl)}&details=${encodeURIComponent(details)}`;
    btn.href = url;
  };

  initCalendarButton();

  // Hamburger Menu Logic
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
});
