'use client';

import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import styles from '../app/manifesto/manifesto.module.css';

export default function ManifestoContent() {
    useFadeInOnScroll({
        selector: `.${styles.fadeIn}`,
        visibleClass: styles.visible
    });

    return (
        <section className={styles.manifestoPage}>
            <div className={styles.container}>
                <p className={`${styles.kicker} ${styles.fadeIn}`}>Manifesto</p>
                <h1 className={`${styles.title} ${styles.fadeIn}`}>HINODE</h1>
                <p className={`${styles.subtitle} ${styles.fadeIn}`}>
                    日の出前に集まり、日の出とともに走る。<br />東京の朝ランコミュニティ。
                </p>

                <p className={`${styles.opening} ${styles.fadeIn}`}>
                    走ることは、速さを測る行為ではない。<br />
                    自分との約束を守れたかどうかを測る行為だ。
                </p>

                <hr className={styles.divider} />

                <div className={`${styles.section} ${styles.fadeIn}`}>
                    <h2 className={styles.sectionTitle}>なぜ朝なのか</h2>
                    <p className={styles.body}>
                        朝は、誰からも要求されていない時間だ。会社もまだ始まっていない。家族もまだ動き出していない。その時間に体を動かすという選択は、誰のためでもなく、自分のためにしかなり得ない。
                    </p>
                    <p className={styles.body}>
                        日の出は、待ってくれない。6時30分の集合は、こちらの都合で前後させられない。だから走る側が間に合わせる。その小さなやり取りのなかにしか、規律は宿らない。
                    </p>
                </div>

                <div className={`${styles.section} ${styles.fadeIn}`}>
                    <h2 className={styles.sectionTitle}>なぜ競争しないのか</h2>
                    <p className={styles.body}>
                        速さは、他人が決める指標だ。ランキングは、他人の土俵に乗ることでしか成立しない。私たちが守りたいのは、他人ではなく、昨日の自分と交わした約束である。
                    </p>
                    <p className={styles.emphasis}>
                        速く走れるかは問わない。<br />
                        今日走ったかどうかだけを問う。
                    </p>
                    <p className={styles.body}>
                        ランニングは本来、誰とも比べる必要のない行為だ。ただ、一人でやるには意志が続かない。だから集まる。競うためではなく、続けるために。
                    </p>
                </div>

                <div className={`${styles.section} ${styles.fadeIn}`}>
                    <h2 className={styles.sectionTitle}>何を約束するか、何を約束しないか</h2>
                    <p className={styles.body}>
                        約束するのは、時間に、場所にいること。日の出の時刻、決められた集合場所に、黄色いゴムバンドをつけた誰かが必ずいる。一人で家を出られない朝も、先に誰かが待っている。
                    </p>
                    <p className={styles.body}>
                        約束しないのは、盛り上がり、仲間づくり、上達、人脈。それらは走った後に勝手についてくる副産物であって、HINODEが提供する商品ではない。
                    </p>
                </div>

                <div className={`${styles.section} ${styles.fadeIn}`}>
                    <h2 className={styles.sectionTitle}>誰のためのコミュニティか</h2>
                    <p className={styles.body}>
                        速くなりたい人のための場所ではない。続けたい人のための場所である。
                    </p>
                    <p className={styles.body}>
                        誰とも話さなくていい。黄色いゴムバンドの誰かに黙ってついて走り、黙って解散していい。一人参加でも、初参加でも、運動歴が浅くても、扱いは変わらない。
                    </p>
                    <p className={styles.body}>
                        走り終われば、それぞれが自分の一日に戻る。朝の4キロは、その日の残り20時間を自分の足で立って過ごすための、ささやかな下準備にすぎない。
                    </p>
                </div>

                <p className={`${styles.closing} ${styles.fadeIn}`}>
                    HINODEは、<br />
                    朝6時30分の自分に<br />
                    会いに行くための装置である。
                </p>

                <p className={styles.meta}>
                    本文の引用は自由です。メディア向けの詳細情報は <a href="/press">プレスキット</a> をご覧ください。
                </p>
            </div>
        </section>
    );
}
