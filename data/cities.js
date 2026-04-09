export const cities = [
  // 東京23区
  { slug: "tokyo-chiyoda", name: "千代田区", prefecture: "東京都", lat: 35.6940, lng: 139.7535, spots: [
    { name: "皇居外苑", desc: "ランナーの聖地・皇居外周5kmコース。桜田門付近から東の空が明るくなる瞬間が見える" },
  ]},
  { slug: "tokyo-chuo", name: "中央区", prefecture: "東京都", lat: 35.6706, lng: 139.7726 },
  { slug: "tokyo-minato", name: "港区", prefecture: "東京都", lat: 35.6581, lng: 139.7514, spots: [
    { name: "芝公園（東京タワー付近）", desc: "東京タワーと朝焼けのコントラスト。増上寺方向から日が昇る。港区役所から約1km" },
  ]},
  { slug: "tokyo-shinjuku", name: "新宿区", prefecture: "東京都", lat: 35.6938, lng: 139.7034 },
  { slug: "tokyo-bunkyo", name: "文京区", prefecture: "東京都", lat: 35.7081, lng: 139.7522 },
  { slug: "tokyo-taito", name: "台東区", prefecture: "東京都", lat: 35.7133, lng: 139.7779, spots: [
    { name: "隅田公園（吾妻橋付近）", desc: "スカイツリーと朝日が重なる早朝の隅田川沿い。浅草駅から徒歩5分" },
  ]},
  { slug: "tokyo-sumida", name: "墨田区", prefecture: "東京都", lat: 35.7101, lng: 139.8015 },
  { slug: "tokyo-koto", name: "江東区", prefecture: "東京都", lat: 35.6724, lng: 139.8172, spots: [
    { name: "若洲海浜公園", desc: "東京湾から昇る日の出が見える海沿い公園。新木場駅から約3km、早朝ランのゴールとして人気" },
  ]},
  { slug: "tokyo-shinagawa", name: "品川区", prefecture: "東京都", lat: 35.6090, lng: 139.7302 },
  { slug: "tokyo-meguro", name: "目黒区", prefecture: "東京都", lat: 35.6330, lng: 139.6985 },
  { slug: "tokyo-ota", name: "大田区", prefecture: "東京都", lat: 35.5617, lng: 139.7158, spots: [
    { name: "大井ふ頭海浜公園", desc: "東京湾越しに日の出が見える。砂浜沿いのランコースあり。大井競馬場前駅から約2km" },
    { name: "多摩川河川敷", desc: "川沿いの土手を走りながら日の出を迎えられる。六郷土手駅すぐ" },
  ]},
  { slug: "tokyo-setagaya", name: "世田谷区", prefecture: "東京都", lat: 35.6464, lng: 139.6530 },
  { slug: "tokyo-shibuya", name: "渋谷区", prefecture: "東京都", lat: 35.6617, lng: 139.7039 },
  { slug: "tokyo-nakano", name: "中野区", prefecture: "東京都", lat: 35.7070, lng: 139.6640 },
  { slug: "tokyo-suginami", name: "杉並区", prefecture: "東京都", lat: 35.6993, lng: 139.6367 },
  { slug: "tokyo-toshima", name: "豊島区", prefecture: "東京都", lat: 35.7293, lng: 139.7180 },
  { slug: "tokyo-kita", name: "北区", prefecture: "東京都", lat: 35.7528, lng: 139.7337 },
  { slug: "tokyo-arakawa", name: "荒川区", prefecture: "東京都", lat: 35.7360, lng: 139.7833 },
  { slug: "tokyo-itabashi", name: "板橋区", prefecture: "東京都", lat: 35.7510, lng: 139.7093 },
  { slug: "tokyo-nerima", name: "練馬区", prefecture: "東京都", lat: 35.7358, lng: 139.6521 },
  { slug: "tokyo-adachi", name: "足立区", prefecture: "東京都", lat: 35.7748, lng: 139.8047 },
  { slug: "tokyo-katsushika", name: "葛飾区", prefecture: "東京都", lat: 35.7447, lng: 139.8470 },
  { slug: "tokyo-edogawa", name: "江戸川区", prefecture: "東京都", lat: 35.7069, lng: 139.8688 },
  // 東京都市部
  { slug: "hachioji", name: "八王子市", prefecture: "東京都", lat: 35.6665, lng: 139.3163 },
  { slug: "tachikawa", name: "立川市", prefecture: "東京都", lat: 35.6981, lng: 139.4130 },
  { slug: "musashino", name: "武蔵野市", prefecture: "東京都", lat: 35.7179, lng: 139.5660 },
  { slug: "machida", name: "町田市", prefecture: "東京都", lat: 35.5432, lng: 139.4462 },
  // 神奈川県
  { slug: "yokohama", name: "横浜市", prefecture: "神奈川県", lat: 35.4437, lng: 139.6380, spots: [
    { name: "山下公園", desc: "横浜港越しに朝日が昇る。みなとみらいの夜景が朝焼けに切り替わる瞬間が見どころ。桜木町駅から約2km" },
    { name: "大さん橋 国際客船ターミナル", desc: "海に突き出した屋上デッキから360度の眺望。横浜港の日の出スポットとして地元ランナーに人気" },
  ]},
  { slug: "kawasaki", name: "川崎市", prefecture: "神奈川県", lat: 35.5308, lng: 139.7029 },
  { slug: "sagamihara", name: "相模原市", prefecture: "神奈川県", lat: 35.5712, lng: 139.3732 },
  { slug: "yokosuka", name: "横須賀市", prefecture: "神奈川県", lat: 35.2842, lng: 139.6683 },
  { slug: "fujisawa", name: "藤沢市", prefecture: "神奈川県", lat: 35.3375, lng: 139.4889, spots: [
    { name: "江の島 弁天橋", desc: "橋の上から相模湾と江の島越しの朝焼けを見られる。橋のたもとまで走ってくる湘南ランナーが多い。片瀬江ノ島駅からすぐ" },
  ]},
  { slug: "chigasaki", name: "茅ヶ崎市", prefecture: "神奈川県", lat: 35.3315, lng: 139.4036, spots: [
    { name: "サザンビーチ", desc: "烏帽子岩と日の出が重なる茅ヶ崎のシンボル的な朝。海岸線沿いを走りながら見られる。茅ヶ崎駅から約1km" },
  ]},
  { slug: "kamakura", name: "鎌倉市", prefecture: "神奈川県", lat: 35.3197, lng: 139.5467, spots: [
    { name: "稲村ヶ崎", desc: "晴天時は富士山・江の島・日の出が一直線に並ぶ絶景ポイント。湘南早朝ランの定番ゴール地点。鎌倉駅から約3km" },
    { name: "由比ヶ浜", desc: "海から昇る日の出を正面に受けながら走れる。国道134号線沿いのフラットなコース。鎌倉駅から約2km" },
  ]},
  { slug: "hakone", name: "箱根町", prefecture: "神奈川県", lat: 35.2328, lng: 139.1065, spots: [
    { name: "芦ノ湖 湖畔", desc: "駒ヶ岳方向から昇る朝日が湖面を染める。箱根駅伝のコース沿いでもある。箱根湯本駅からバスで約30分" },
  ]},
  { slug: "odawara", name: "小田原市", prefecture: "神奈川県", lat: 35.2648, lng: 139.1553 },
  { slug: "hiratsuka", name: "平塚市", prefecture: "神奈川県", lat: 35.3228, lng: 139.3428 },
  // 埼玉県
  { slug: "saitama", name: "さいたま市", prefecture: "埼玉県", lat: 35.8617, lng: 139.6455 },
  { slug: "kawaguchi", name: "川口市", prefecture: "埼玉県", lat: 35.8075, lng: 139.7245 },
  { slug: "tokorozawa", name: "所沢市", prefecture: "埼玉県", lat: 35.7993, lng: 139.4688 },
  { slug: "kasukabe", name: "春日部市", prefecture: "埼玉県", lat: 35.9753, lng: 139.7528 },
  { slug: "koshigaya", name: "越谷市", prefecture: "埼玉県", lat: 35.8916, lng: 139.7908 },
  // 千葉県
  { slug: "chiba", name: "千葉市", prefecture: "千葉県", lat: 35.6073, lng: 140.1063 },
  { slug: "funabashi", name: "船橋市", prefecture: "千葉県", lat: 35.6950, lng: 139.9832 },
  { slug: "matsudo", name: "松戸市", prefecture: "千葉県", lat: 35.7877, lng: 139.9027 },
  { slug: "ichikawa", name: "市川市", prefecture: "千葉県", lat: 35.7214, lng: 139.9315 },
  { slug: "kashiwa", name: "柏市", prefecture: "千葉県", lat: 35.8678, lng: 139.9755 },
  { slug: "narita", name: "成田市", prefecture: "千葉県", lat: 35.7749, lng: 140.3189 },
  // 北海道
  { slug: "sapporo", name: "札幌市", prefecture: "北海道", lat: 43.0621, lng: 141.3544 },
  { slug: "hakodate", name: "函館市", prefecture: "北海道", lat: 41.7688, lng: 140.7290, spots: [
    { name: "函館山 山頂展望台", desc: "「世界三大夜景」の場所だが早朝も絶景。津軽海峡から昇る日の出と函館の街を一望できる。函館駅から山頂まで走って約5km" },
    { name: "元町 外国人墓地付近", desc: "坂の街・元町の高台から函館港と日の出が見える。早朝ランのコースとして地元でも人気" },
  ]},
  { slug: "asahikawa", name: "旭川市", prefecture: "北海道", lat: 43.7707, lng: 142.3650 },
  { slug: "kushiro", name: "釧路市", prefecture: "北海道", lat: 42.9848, lng: 144.3820 },
  { slug: "obihiro", name: "帯広市", prefecture: "北海道", lat: 42.9241, lng: 143.1965 },
  { slug: "kitami", name: "北見市", prefecture: "北海道", lat: 43.8028, lng: 143.8942 },
  { slug: "tomakomai", name: "苫小牧市", prefecture: "北海道", lat: 42.6344, lng: 141.6048 },
  { slug: "furano", name: "富良野市", prefecture: "北海道", lat: 43.3422, lng: 142.3832, spots: [
    { name: "富良野・麓郷展望台", desc: "十勝岳連峰と朝焼けが広がる大パノラマ。夏はラベンダー畑越しに日が昇る。富良野駅から約8km" },
  ]},
  { slug: "niseko", name: "ニセコ町", prefecture: "北海道", lat: 42.8046, lng: 140.6880 },
  { slug: "abashiri", name: "網走市", prefecture: "北海道", lat: 44.0211, lng: 144.2728 },
  { slug: "wakkanai", name: "稚内市", prefecture: "北海道", lat: 45.4160, lng: 141.6731 },
  // 青森県
  { slug: "aomori", name: "青森市", prefecture: "青森県", lat: 40.8224, lng: 140.7471 },
  { slug: "hirosaki", name: "弘前市", prefecture: "青森県", lat: 40.6031, lng: 140.4640 },
  { slug: "hachinohe", name: "八戸市", prefecture: "青森県", lat: 40.5122, lng: 141.4883 },
  // 岩手県
  { slug: "morioka", name: "盛岡市", prefecture: "岩手県", lat: 39.7036, lng: 141.1527 },
  { slug: "ichinoseki", name: "一関市", prefecture: "岩手県", lat: 38.9352, lng: 141.1268 },
  // 宮城県
  { slug: "sendai", name: "仙台市", prefecture: "宮城県", lat: 38.2688, lng: 140.8721, spots: [
    { name: "広瀬川河川敷", desc: "仙台市内を流れる広瀬川沿いのランニングコース。川面に映る朝日が美しい。仙台駅から約2km" },
  ]},
  { slug: "ishinomaki", name: "石巻市", prefecture: "宮城県", lat: 38.4342, lng: 141.3026 },
  // 秋田県
  { slug: "akita", name: "秋田市", prefecture: "秋田県", lat: 39.7186, lng: 140.1023 },
  // 山形県
  { slug: "yamagata", name: "山形市", prefecture: "山形県", lat: 38.2404, lng: 140.3636 },
  { slug: "yonezawa", name: "米沢市", prefecture: "山形県", lat: 37.9225, lng: 140.1178 },
  // 福島県
  { slug: "fukushima", name: "福島市", prefecture: "福島県", lat: 37.7608, lng: 140.4747 },
  { slug: "koriyama", name: "郡山市", prefecture: "福島県", lat: 37.3985, lng: 140.3880 },
  { slug: "iwaki", name: "いわき市", prefecture: "福島県", lat: 37.0502, lng: 140.8877 },
  { slug: "aizuwakamatsu", name: "会津若松市", prefecture: "福島県", lat: 37.4965, lng: 139.9291 },
  // 茨城県
  { slug: "mito", name: "水戸市", prefecture: "茨城県", lat: 36.3658, lng: 140.4714 },
  { slug: "tsukuba", name: "つくば市", prefecture: "茨城県", lat: 36.0833, lng: 140.0769 },
  { slug: "hitachi", name: "日立市", prefecture: "茨城県", lat: 36.5990, lng: 140.6514 },
  // 栃木県
  { slug: "utsunomiya", name: "宇都宮市", prefecture: "栃木県", lat: 36.5657, lng: 139.8836 },
  { slug: "nikko", name: "日光市", prefecture: "栃木県", lat: 36.7197, lng: 139.6986, spots: [
    { name: "中禅寺湖 湖畔", desc: "男体山から昇る日の出が湖面に反射する。湖一周約26kmのランコースからも楽しめる。日光駅からバスで約45分" },
  ]},
  { slug: "ashikaga", name: "足利市", prefecture: "栃木県", lat: 36.3406, lng: 139.4498 },
  // 群馬県
  { slug: "maebashi", name: "前橋市", prefecture: "群馬県", lat: 36.3895, lng: 139.0634 },
  { slug: "takasaki", name: "高崎市", prefecture: "群馬県", lat: 36.3226, lng: 139.0033 },
  { slug: "kiryu", name: "桐生市", prefecture: "群馬県", lat: 36.4066, lng: 139.3292 },
  { slug: "kusatsu-gunma", name: "草津町", prefecture: "群馬県", lat: 36.6203, lng: 138.5959 },
  // 山梨県
  { slug: "kofu", name: "甲府市", prefecture: "山梨県", lat: 35.6635, lng: 138.5686 },
  { slug: "fujiyoshida", name: "富士吉田市", prefecture: "山梨県", lat: 35.4887, lng: 138.7981, spots: [
    { name: "山中湖 パノラマ台", desc: "富士山と日の出が同時に見られる標高1000mの展望台。富士五湖ランの定番折り返し地点。山中湖畔から約4km" },
    { name: "河口湖 大石公園", desc: "逆さ富士が映る湖面と朝焼け。湖畔のランニングロードを走ってアクセス可。河口湖駅から約8km" },
  ]},
  // 長野県
  { slug: "nagano", name: "長野市", prefecture: "長野県", lat: 36.6513, lng: 138.1811, spots: [
    { name: "善光寺 表参道", desc: "早朝のお朝事（5時30分〜）に合わせて走ってくるランナーが多い。参道の静けさと朝日の組み合わせが特徴。長野駅から約2km" },
  ]},
  { slug: "matsumoto", name: "松本市", prefecture: "長野県", lat: 36.2381, lng: 137.9720, spots: [
    { name: "松本城 外堀周辺", desc: "北アルプスと黒い天守が朝焼けに映える。外堀を周回するランニングコースが人気。松本駅から約1km" },
  ]},
  { slug: "karuizawa", name: "軽井沢町", prefecture: "長野県", lat: 36.3482, lng: 138.5957, spots: [
    { name: "雲場池", desc: "別荘地の森の中にある池。早朝は観光客ゼロで静寂の中に朝日が差し込む。軽井沢駅から約2km" },
    { name: "離山 山頂", desc: "標高1256mの頂から浅間山と日の出を望む。軽井沢駅から山頂まで約5km" },
  ]},
  { slug: "ueda", name: "上田市", prefecture: "長野県", lat: 36.4022, lng: 138.2491 },
  { slug: "suwa", name: "諏訪市", prefecture: "長野県", lat: 36.0401, lng: 138.1145, spots: [
    { name: "諏訪湖 湖畔", desc: "湖一周約16kmのランニングコース。朝霧の中から日が昇る瞬間が見られる。上諏訪駅からすぐ" },
  ]},
  // 新潟県
  { slug: "niigata", name: "新潟市", prefecture: "新潟県", lat: 37.9162, lng: 139.0364 },
  { slug: "nagaoka", name: "長岡市", prefecture: "新潟県", lat: 37.4476, lng: 138.8512 },
  { slug: "joetsu", name: "上越市", prefecture: "新潟県", lat: 37.1499, lng: 138.2367 },
  // 富山県
  { slug: "toyama", name: "富山市", prefecture: "富山県", lat: 36.6953, lng: 137.2113 },
  { slug: "takaoka", name: "高岡市", prefecture: "富山県", lat: 36.7544, lng: 137.0256 },
  // 石川県
  { slug: "kanazawa", name: "金沢市", prefecture: "石川県", lat: 36.5944, lng: 136.6256, spots: [
    { name: "兼六園 周辺", desc: "早朝無料開放（7時まで）の時間帯は静かな庭園と朝日を楽しめる。周囲を走りながら眺めるのが定番。金沢駅から約2km" },
    { name: "犀川河川敷", desc: "金沢の人気ランニングコース。川沿いのフラットな道を走りながら日が昇る。武蔵ヶ辻から約2km" },
  ]},
  { slug: "noto", name: "七尾市", prefecture: "石川県", lat: 37.0488, lng: 136.9626 },
  // 福井県
  { slug: "fukui", name: "福井市", prefecture: "福井県", lat: 36.0651, lng: 136.2218 },
  { slug: "sabae", name: "鯖江市", prefecture: "福井県", lat: 35.9569, lng: 136.1847 },
  // 静岡県
  { slug: "shizuoka", name: "静岡市", prefecture: "静岡県", lat: 34.9769, lng: 138.3831 },
  { slug: "hamamatsu", name: "浜松市", prefecture: "静岡県", lat: 34.7108, lng: 137.7261 },
  { slug: "atami", name: "熱海市", prefecture: "静岡県", lat: 35.0968, lng: 139.0743, spots: [
    { name: "錦ヶ浦", desc: "海に突き出た断崖から太平洋の水平線を一望。海抜30mの展望台まで走って登れる。熱海駅から約2km" },
    { name: "熱海サンビーチ", desc: "海岸線沿いのフラットなコース。日の出を正面に受けながら走れる。熱海駅から約1km" },
  ]},
  { slug: "numazu", name: "沼津市", prefecture: "静岡県", lat: 35.0954, lng: 138.8638, spots: [
    { name: "千本浜公園", desc: "松原越しに富士山と日の出のシルエットが重なる絶景ポイント。砂浜沿いにランニングロードあり。沼津駅から約3km" },
  ]},
  { slug: "shimoda", name: "下田市", prefecture: "静岡県", lat: 34.6791, lng: 138.9453, spots: [
    { name: "爪木崎", desc: "須崎半島の先端。三方を海に囲まれ、水平線から昇る日の出が見える。下田駅から約5km" },
  ]},
  { slug: "fuji", name: "富士市", prefecture: "静岡県", lat: 35.1617, lng: 138.6767, spots: [
    { name: "田子の浦港", desc: "富士山を正面に見ながら海岸沿いを走れる。早朝は漁港の静けさと朝焼けが重なる。吉原駅から約5km" },
  ]},
  // 愛知県
  { slug: "nagoya", name: "名古屋市", prefecture: "愛知県", lat: 35.1815, lng: 136.9066 },
  { slug: "toyohashi", name: "豊橋市", prefecture: "愛知県", lat: 34.7692, lng: 137.3914 },
  { slug: "okazaki", name: "岡崎市", prefecture: "愛知県", lat: 34.9551, lng: 137.1716 },
  { slug: "toyota", name: "豊田市", prefecture: "愛知県", lat: 35.0826, lng: 137.1567 },
  { slug: "ichinomiya", name: "一宮市", prefecture: "愛知県", lat: 35.3036, lng: 136.8024 },
  // 岐阜県
  { slug: "gifu", name: "岐阜市", prefecture: "岐阜県", lat: 35.4232, lng: 136.7606 },
  { slug: "ogaki", name: "大垣市", prefecture: "岐阜県", lat: 35.3593, lng: 136.6106 },
  { slug: "takayama", name: "高山市", prefecture: "岐阜県", lat: 36.1461, lng: 137.2519, spots: [
    { name: "宮川沿い 陣屋前朝市", desc: "古い町並みと宮川沿いを走る朝ランコース。朝市が開く6時頃には朝日が射し込む。高山駅から約1km" },
  ]},
  { slug: "shirakawa", name: "白川村", prefecture: "岐阜県", lat: 36.2579, lng: 136.9041, spots: [
    { name: "荻町城跡展望台", desc: "世界遺産・合掌造り集落を見下ろす展望台。朝霧の中に浮かぶ茅葺き屋根と日の出のコントラスト。バス停から約15分の登り" },
  ]},
  // 三重県
  { slug: "tsu", name: "津市", prefecture: "三重県", lat: 34.7302, lng: 136.5086 },
  { slug: "yokkaichi", name: "四日市市", prefecture: "三重県", lat: 34.9647, lng: 136.6246 },
  { slug: "ise", name: "伊勢市", prefecture: "三重県", lat: 34.4861, lng: 136.7085, spots: [
    { name: "二見興玉神社（夫婦岩）", desc: "夏至の頃、夫婦岩の間から日の出が昇る神聖なスポット。早朝ランで参拝するのが粋。二見浦駅から約1km" },
  ]},
  // 滋賀県
  { slug: "otsu", name: "大津市", prefecture: "滋賀県", lat: 35.0045, lng: 135.8686 },
  { slug: "kusatsu-shiga", name: "草津市", prefecture: "滋賀県", lat: 34.9845, lng: 135.9628 },
  { slug: "hikone", name: "彦根市", prefecture: "滋賀県", lat: 35.2742, lng: 136.2616 },
  // 京都府
  { slug: "kyoto", name: "京都市", prefecture: "京都府", lat: 35.0116, lng: 135.7681, spots: [
    { name: "鴨川デルタ（出町柳）", desc: "鴨川沿いを走るランナーの聖地。早朝は静寂の中に朝日が差し込む。出町柳駅からすぐ" },
    { name: "嵐山 渡月橋", desc: "観光客が来る前の5〜6時台は橋を独占できる。保津川越しの朝日が美しい。嵐山駅から徒歩3分" },
  ]},
  { slug: "uji", name: "宇治市", prefecture: "京都府", lat: 34.8843, lng: 135.7999 },
  // 大阪府
  { slug: "osaka", name: "大阪市", prefecture: "大阪府", lat: 34.6937, lng: 135.5023, spots: [
    { name: "大阪城公園", desc: "城とのコントラストが美しい朝。外周約5kmのランコース上から天守閣と朝日を眺められる。大阪城公園駅からすぐ" },
  ]},
  { slug: "sakai", name: "堺市", prefecture: "大阪府", lat: 34.5733, lng: 135.4830 },
  { slug: "higashiosaka", name: "東大阪市", prefecture: "大阪府", lat: 34.6794, lng: 135.5998 },
  { slug: "hirakata", name: "枚方市", prefecture: "大阪府", lat: 34.8151, lng: 135.6528 },
  { slug: "toyonaka", name: "豊中市", prefecture: "大阪府", lat: 34.7826, lng: 135.4697 },
  // 兵庫県
  { slug: "kobe", name: "神戸市", prefecture: "兵庫県", lat: 34.6913, lng: 135.1830, spots: [
    { name: "六甲アイランド 海岸", desc: "大阪湾越しに朝日が昇る。アイランド一周約5kmのランコースが人気。マリンパーク駅からすぐ" },
    { name: "摩耶山（掬星台）", desc: "「1000万ドルの夜景」の場所だが早朝も絶景。ロープウェイを使わず走って登るランナーも。摩耶ケーブル駅から山頂まで約4km" },
  ]},
  { slug: "himeji", name: "姫路市", prefecture: "兵庫県", lat: 34.8161, lng: 134.6855, spots: [
    { name: "姫路城 城見台公園", desc: "世界遺産の白鷺城と朝焼けのコントラスト。早朝ランのゴールとして定番。姫路駅から約1.5km" },
  ]},
  { slug: "nishinomiya", name: "西宮市", prefecture: "兵庫県", lat: 34.7383, lng: 135.3434 },
  { slug: "amagasaki", name: "尼崎市", prefecture: "兵庫県", lat: 34.7335, lng: 135.4064 },
  { slug: "akashi", name: "明石市", prefecture: "兵庫県", lat: 34.6449, lng: 134.9983 },
  // 奈良県
  { slug: "nara", name: "奈良市", prefecture: "奈良県", lat: 34.6851, lng: 135.8048, spots: [
    { name: "若草山", desc: "鹿と一緒に丘から奈良盆地の日の出を見られる。頂上まで走って登れる標高342mの芝生の山。奈良駅から約3km" },
  ]},
  { slug: "kashihara", name: "橿原市", prefecture: "奈良県", lat: 34.5073, lng: 135.7948 },
  // 和歌山県
  { slug: "wakayama", name: "和歌山市", prefecture: "和歌山県", lat: 34.2261, lng: 135.1675 },
  { slug: "tanabe", name: "田辺市", prefecture: "和歌山県", lat: 33.7333, lng: 135.3763 },
  // 鳥取県
  { slug: "tottori", name: "鳥取市", prefecture: "鳥取県", lat: 35.5013, lng: 134.2349, spots: [
    { name: "鳥取砂丘", desc: "日本最大の砂丘から日本海の水平線越しに日の出を見られる。砂の上を走る体験はここだけ。鳥取駅から約7km" },
  ]},
  { slug: "yonago", name: "米子市", prefecture: "鳥取県", lat: 35.4285, lng: 133.3315 },
  // 島根県
  { slug: "matsue", name: "松江市", prefecture: "島根県", lat: 35.4722, lng: 133.0507, spots: [
    { name: "宍道湖 湖畔", desc: "「日本の夕日百選」の場所だが夜明けの宍道湖も幻想的。湖畔のランニングロードあり。松江駅から約1km" },
  ]},
  { slug: "izumo", name: "出雲市", prefecture: "島根県", lat: 35.3671, lng: 132.7550 },
  // 岡山県
  { slug: "okayama", name: "岡山市", prefecture: "岡山県", lat: 34.6617, lng: 133.9345 },
  { slug: "kurashiki", name: "倉敷市", prefecture: "岡山県", lat: 34.5850, lng: 133.7723, spots: [
    { name: "美観地区 倉敷川沿い", desc: "白壁の街並みと倉敷川沿いを走る早朝ランコース。観光客が来る前の6時台が特におすすめ。倉敷駅から約1.5km" },
  ]},
  // 広島県
  { slug: "hiroshima", name: "広島市", prefecture: "広島県", lat: 34.3853, lng: 132.4553, spots: [
    { name: "平和記念公園 元安川沿い", desc: "広島の早朝ランの定番コース。静かな川沿いから日が昇る。広島駅から約2km" },
  ]},
  { slug: "fukuyama", name: "福山市", prefecture: "広島県", lat: 34.4858, lng: 133.3625 },
  { slug: "onomichi", name: "尾道市", prefecture: "広島県", lat: 34.4087, lng: 133.2003, spots: [
    { name: "千光寺公園 展望台", desc: "尾道水道と朝日が見える絶景ポイント。山頂まで走って登るルートがある。尾道駅から約2km" },
  ]},
  { slug: "miyajima", name: "廿日市市", prefecture: "広島県", lat: 34.2951, lng: 132.3197, spots: [
    { name: "厳島神社 大鳥居前海岸", desc: "干潮時は歩いて鳥居まで行ける。日の出の時間帯は観光客がほぼいない。宮島口からフェリーで約10分" },
  ]},
  // 山口県
  { slug: "yamaguchi", name: "山口市", prefecture: "山口県", lat: 34.1861, lng: 131.4705 },
  { slug: "shimonoseki", name: "下関市", prefecture: "山口県", lat: 33.9547, lng: 130.9408 },
  { slug: "ube", name: "宇部市", prefecture: "山口県", lat: 33.9515, lng: 131.2460 },
  // 徳島県
  { slug: "tokushima", name: "徳島市", prefecture: "徳島県", lat: 34.0658, lng: 134.5593 },
  { slug: "naruto", name: "鳴門市", prefecture: "徳島県", lat: 34.1778, lng: 134.6101 },
  // 香川県
  { slug: "takamatsu", name: "高松市", prefecture: "香川県", lat: 34.3428, lng: 134.0432 },
  { slug: "marugame", name: "丸亀市", prefecture: "香川県", lat: 34.2898, lng: 133.7963 },
  // 愛媛県
  { slug: "matsuyama", name: "松山市", prefecture: "愛媛県", lat: 33.8395, lng: 132.7654 },
  { slug: "imabari", name: "今治市", prefecture: "愛媛県", lat: 34.0660, lng: 132.9977 },
  { slug: "uwajima", name: "宇和島市", prefecture: "愛媛県", lat: 33.2237, lng: 132.5601 },
  // 高知県
  { slug: "kochi", name: "高知市", prefecture: "高知県", lat: 33.5597, lng: 133.5311, spots: [
    { name: "桂浜", desc: "坂本龍馬像の前から太平洋の水平線越しに日の出を見られる。早朝の桂浜は地元ランナーのコース。高知駅からバスで約30分" },
  ]},
  { slug: "shimanto", name: "四万十市", prefecture: "高知県", lat: 32.9950, lng: 132.9375 },
  // 福岡県
  { slug: "fukuoka", name: "福岡市", prefecture: "福岡県", lat: 33.5904, lng: 130.4017 },
  { slug: "kitakyushu", name: "北九州市", prefecture: "福岡県", lat: 33.8833, lng: 130.8752 },
  { slug: "kurume", name: "久留米市", prefecture: "福岡県", lat: 33.3197, lng: 130.5083 },
  { slug: "omuta", name: "大牟田市", prefecture: "福岡県", lat: 33.0298, lng: 130.4473 },
  // 佐賀県
  { slug: "saga", name: "佐賀市", prefecture: "佐賀県", lat: 33.2494, lng: 130.2988 },
  { slug: "karatsu", name: "唐津市", prefecture: "佐賀県", lat: 33.4498, lng: 129.9693 },
  // 長崎県
  { slug: "nagasaki", name: "長崎市", prefecture: "長崎県", lat: 32.7503, lng: 129.8777 },
  { slug: "sasebo", name: "佐世保市", prefecture: "長崎県", lat: 33.1806, lng: 129.7148 },
  { slug: "huis-ten-bosch", name: "ハウステンボス（佐世保）", prefecture: "長崎県", lat: 33.0886, lng: 129.7714 },
  // 熊本県
  { slug: "kumamoto", name: "熊本市", prefecture: "熊本県", lat: 32.7898, lng: 130.7417 },
  { slug: "aso", name: "阿蘇市", prefecture: "熊本県", lat: 32.9499, lng: 131.0952, spots: [
    { name: "大観峰", desc: "阿蘇カルデラを見下ろす展望台。雲海と日の出が重なる日は別格の景色。阿蘇駅から約10km" },
  ]},
  { slug: "yatsushiro", name: "八代市", prefecture: "熊本県", lat: 32.5037, lng: 130.6069 },
  // 大分県
  { slug: "oita", name: "大分市", prefecture: "大分県", lat: 33.2382, lng: 131.6126 },
  { slug: "beppu", name: "別府市", prefecture: "大分県", lat: 33.2790, lng: 131.4990, spots: [
    { name: "別府湾 海岸", desc: "国東半島方向から昇る日の出が美しい。別府駅から鉄輪温泉へ向かうコース上に海岸線あり。別府駅から約2km" },
  ]},
  { slug: "yufuin", name: "由布市（湯布院）", prefecture: "大分県", lat: 33.2570, lng: 131.3611, spots: [
    { name: "金鱗湖", desc: "湖面から朝霧が立ち上る幻想的な景色。早朝5〜6時台はほぼ貸し切り状態。由布院駅から約1km" },
  ]},
  // 宮崎県
  { slug: "miyazaki", name: "宮崎市", prefecture: "宮崎県", lat: 31.9111, lng: 131.4239, spots: [
    { name: "青島", desc: "島を囲む鬼の洗濯板越しに日の出が見える。裸足でも走れる砂浜コース。青島駅から約1km" },
  ]},
  { slug: "nobeoka", name: "延岡市", prefecture: "宮崎県", lat: 32.5831, lng: 131.6642 },
  { slug: "nichinan", name: "日南市", prefecture: "宮崎県", lat: 31.6028, lng: 131.3820, spots: [
    { name: "鵜戸神宮前 海岸", desc: "断崖の参道を走って往復できる。太平洋の水平線からの日の出が迫力満点。日南駅から約11km" },
  ]},
  // 鹿児島県
  { slug: "kagoshima", name: "鹿児島市", prefecture: "鹿児島県", lat: 31.5966, lng: 130.5571, spots: [
    { name: "城山展望台", desc: "桜島と朝焼けが見える鹿児島最高の日の出スポット。市内から走って登れる標高107mの展望台。鹿児島中央駅から約4km" },
  ]},
  { slug: "ibusuki", name: "指宿市", prefecture: "鹿児島県", lat: 31.2574, lng: 130.6371, spots: [
    { name: "長崎鼻", desc: "薩摩富士（開聞岳）と日の出が重なる指宿のベストスポット。指宿駅から約10km" },
  ]},
  { slug: "yakushima", name: "屋久島町", prefecture: "鹿児島県", lat: 30.3619, lng: 130.6569, spots: [
    { name: "永田いなか浜", desc: "ウミガメの産卵地としても有名な静かな砂浜。早朝は人がほとんどおらず、太平洋からの日の出を独占できる。宮之浦港から約12km" },
  ]},
  { slug: "amami", name: "奄美市", prefecture: "鹿児島県", lat: 28.3766, lng: 129.4942, spots: [
    { name: "大浜海浜公園", desc: "奄美の透明度の高い海と日の出。砂浜沿いを走れる。名瀬中心部から約5km" },
  ]},
  // 沖縄県
  { slug: "naha", name: "那覇市", prefecture: "沖縄県", lat: 26.2124, lng: 127.6809, spots: [
    { name: "波の上ビーチ", desc: "那覇市内から走れる距離にある海岸。沖縄の早朝ランの定番スポット。那覇バスターミナルから約2km" },
  ]},
  { slug: "okinawa", name: "沖縄市", prefecture: "沖縄県", lat: 26.3342, lng: 127.8017 },
  { slug: "uruma", name: "うるま市", prefecture: "沖縄県", lat: 26.3789, lng: 127.8571 },
  { slug: "nago", name: "名護市", prefecture: "沖縄県", lat: 26.5912, lng: 127.9779, spots: [
    { name: "古宇利ビーチ（古宇利島）", desc: "ハート岩越しの日の出で有名。古宇利大橋を渡って走ってアクセス可。名護バスターミナルから約15km" },
  ]},
  { slug: "miyakojima", name: "宮古島市", prefecture: "沖縄県", lat: 24.8056, lng: 125.2814, spots: [
    { name: "東平安名崎", desc: "三方を海に囲まれた岬。島内ランのゴール地点として人気が高い。平良港から約17km" },
    { name: "砂山ビーチ", desc: "砂丘を越えると太平洋が広がる。早朝はほぼ無人でプライベートビーチ感覚。平良港から約4km" },
  ]},
  { slug: "ishigaki", name: "石垣市", prefecture: "沖縄県", lat: 24.3408, lng: 124.1551, spots: [
    { name: "玉取崎展望台", desc: "石垣島北部。東シナ海と太平洋を両方見渡せる展望台。石垣港から約14km" },
    { name: "川平湾", desc: "湾を囲む岬から水平線越しの日の出。日本百景にも選ばれた絶景。石垣港から約10km" },
  ]},
  { slug: "itoman", name: "糸満市", prefecture: "沖縄県", lat: 26.1232, lng: 127.6651 },
];
