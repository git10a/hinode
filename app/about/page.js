import AboutContent from '@/components/AboutContent';
import JsonLd from '@/components/JsonLd';
import { ABOUT_FAQ, toPlainAnswer } from '@/lib/aboutFaq';
import { createFaqJsonLd } from '@/lib/structuredData';

export const metadata = {
    title: 'HINODEとは｜日の出とともに、競争しない朝をつづける',
    description: 'HINODEは東京で活動する朝ランコミュニティです。参加無料・予約不要・競争なし。通常開催では参加者を撮影しません。',
};

const FAQ_JSON_LD = createFaqJsonLd(
    ABOUT_FAQ.map(({ question, answer }) => ({ question, answer: toPlainAnswer(answer) }))
);

export default function About() {
    return (
        <section>
            <JsonLd data={FAQ_JSON_LD} />
            <AboutContent />
        </section>
    );
}
