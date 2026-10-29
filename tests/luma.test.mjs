import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getUpcomingLumaEvents, parseLumaCalendar } from '../lib/luma.js';

const NOW = new Date('2026-10-29T07:00:00Z');
const fixture = readFileSync(new URL('./fixtures/luma-calendar.ics', import.meta.url), 'utf8');
const calendar = (...events) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${events.join('\r\n')}\r\nEND:VCALENDAR\r\n`;
const event = (fields = '') => `BEGIN:VEVENT\r\nUID:example\r\nDTSTART:20261031T223000Z\r\nDTEND:20261031T233000Z\r\nSUMMARY:HINODE 代々木公園ラン\r\nDESCRIPTION:See https://luma.com/fk239beu\r\n${fields}\r\nEND:VEVENT`;

test('reads the real public feed, including folded links, and preserves JST dates', () => {
    const events = parseLumaCalendar(fixture, NOW);
    assert.deepEqual(events.map(({ title, href, location }) => ({ title, href, location })), [
        { title: '代々木公園ラン', href: 'https://luma.com/fk239beu', location: '原宿門前時計塔' },
        { title: '皇居ラン', href: 'https://luma.com/p7s2oh0y', location: '桔梗門' },
        { title: '目黒川ラン', href: 'https://luma.com/vm2bt1er', location: 'スターバックス 中目黒 蔦屋書店' },
    ]);
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' });
    const time = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: 'numeric', minute: '2-digit', hourCycle: 'h23' });
    assert.equal(date.format(new Date(events[0].startAt)), '2026-11-01');
    assert.equal(time.format(new Date(events[0].startAt)), '7:30');
    assert.equal(time.format(new Date(events[1].startAt)), '6:30');
});

test('removes ended and cancelled events, retaining an event in progress', () => {
    const events = parseLumaCalendar(calendar(
        event('STATUS:CANCELLED'),
        event('UID:past\r\nDTSTART:20261028T223000Z\r\nDTEND:20261028T233000Z'),
        event('UID:ongoing\r\nDTSTART:20261029T063000Z\r\nDTEND:20261029T073000Z'),
        event('UID:future'),
    ), NOW);
    assert.equal(events.length, 2);
    assert.match(events[0].id, /^ongoing:/);
    assert.match(events[1].id, /^future:/);
});

test('handles explicit JST and all-day events without using the server timezone', () => {
    const events = parseLumaCalendar(calendar(
        event('UID:jst\r\nDTSTART;TZID=Asia/Tokyo:20261101T073000\r\nDTEND;TZID=Asia/Tokyo:20261101T083000'),
        event('UID:all-day\r\nDTSTART;VALUE=DATE:20261102\r\nDTEND;VALUE=DATE:20261103'),
    ), NOW);
    assert.equal(events[0].startAt, '2026-10-31T22:30:00.000Z');
    assert.equal(events[1].startAt, '2026-11-01T15:00:00.000Z');
    assert.equal(events[1].allDay, true);
});

test('does not invent dates or allow off-platform and unsafe event links', () => {
    const events = parseLumaCalendar(calendar(
        event('DTSTART:20261101T073000'),
        event('DTSTART:20260230T073000Z'),
        event('URL:https://example.com/event'),
        event('URL:javascript:alert(1)'),
        event('URL:https://luma.com@example.com/event'),
        event('SUMMARY:'),
        event('DESCRIPTION:No event link'),
    ), NOW);
    assert.deepEqual(events, []);
});

test('unfolds iCal text, ignores alarm properties, and deduplicates occurrences', () => {
    const source = event('SUMMARY:HINODE 企画ラン\\, 朝の\r\n 散歩\r\nLOCATION:新しい集合場所\\;受付前\r\nBEGIN:VALARM\r\nSUMMARY:Alarm title\r\nEND:VALARM');
    const events = parseLumaCalendar(calendar(source, source), NOW);
    assert.equal(events.length, 1);
    assert.equal(events[0].title, '企画ラン, 朝の散歩');
    assert.equal(events[0].location, '新しい集合場所;受付前');
    assert.equal(events[0].image, '/assets/ogp-home.jpg');
});

test('distinguishes an empty schedule from invalid data or unavailable feeds', async (t) => {
    assert.deepEqual(parseLumaCalendar(calendar(), NOW), []);
    assert.throws(() => parseLumaCalendar('<html>upstream failure</html>', NOW));
    t.mock.method(console, 'error', () => {});
    const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(calendar()));
    assert.deepEqual(await getUpcomingLumaEvents(), []);
    fetch.mock.mockImplementation(async () => new Response('Unavailable', { status: 503 }));
    assert.equal(await getUpcomingLumaEvents(), null);
    fetch.mock.mockImplementation(async () => new Response('<html>challenge</html>'));
    assert.equal(await getUpcomingLumaEvents(), null);
    fetch.mock.mockImplementation(async () => { throw new Error('network unavailable'); });
    assert.equal(await getUpcomingLumaEvents(), null);
});
