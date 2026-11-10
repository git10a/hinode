// 構造化データ(JSON-LD)を出力する。配列を渡すと1件ずつ別のscriptタグになる。
export default function JsonLd({ data }) {
    const entries = Array.isArray(data) ? data : [data];

    return entries.map((entry, index) => (
        <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
    ));
}
