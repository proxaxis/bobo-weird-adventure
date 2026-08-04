import backgroundCafe from '@/assets/scenario/883f2204747b049841122c2a7c35fec5.png';
import backgroundPark from '@/assets/scenario/b6bdfb08e0f0e18618a70e66170bbc77.png';

export const defineScenario = () => [
  {
    id: 's001',
    title: 'カフェでランチ中',
    stage: {
      min: 1,
      max: 3,
    },
    background: backgroundCafe,
    lines: [{ speaker: 'ひろぽん', text: 'これすっごく美味しいですよー、ひとくちいります？' }],
    selections: [
      {
        label: 'え、いいんですか？ありがとうございます！僕のもぜひ、どうぞ。',
        isCorrect: true,
      },
      { label: 'いやぁ、遠慮しときます。', isCorrect: false },
      { label: 'イカハウスで花火大会が見えんのじゃよ。', isCorrect: false },
    ],
  },
  {
    id: 's002',
    title: '夕暮れどきの公園',
    stage: {
      min: 1,
      max: 3,
    },
    background: backgroundPark,
    lines: [{ speaker: 'ひろぽん', text: '今日すごく楽しかったです。……もし時間大丈夫なら、少しだけ一緒に歩きませんか？' }],
    selections: [
      { label: 'もちろんです！もう少し歩きましょ！', isCorrect: true },
      { label: 'あ、すみません！今日このあと予定があって……また今度でもいいですか？', isCorrect: false },
      { label: 'イカハウスで花火大会が見えんのじゃよ。', isCorrect: false },
    ],
  },
  {
    id: 's003',
    title: '雨',
    stage: {
      min: 1,
      max: 3,
    },
    background: backgroundPark,
    lines: [{ speaker: 'ひろぽん', text: 'うわ、急に降ってきましたね……！ぼーぼさん、傘って持ってますか？' }],
    selections: [
      { label: '持ってますよ！入りますか？', isCorrect: true },
      { label: '持ってないです！でも僕、気にしないんで濡れていきましょ', isCorrect: false },
      { label: 'イカハウスで花火大会が見えんのじゃよ。', isCorrect: false },
    ],
  },
  {
    id: 's004',
    title: '帰り道（冬）',
    stage: {
      min: 4,
      max: 8,
    },
    background: backgroundPark,
    lines: [
      { speaker: 'ひろぽん', text: '寒いですね、ボンタン飴、入ります？寒さ関係ないけど、' },
      { speaker: 'ぼーぼ', text: 'いいんですか？（受け取る）' },
      { speaker: 'ひろぽん', text: 'ボンタン飴って寒いところに置いとくと、硬くなるんですよ。なんか趣があるでしょ。' },
      { speaker: 'ぼーぼ', text: '、、、(確かに、)' },
      { speaker: 'ひろぽん', text: '無理に同じ自分でいようとしなくていい。冬にはボンタンアメみたいに硬くなって夏には洗濯物みたいに早く乾いてそうやって生きていいのよ。' },
    ],
    selections: [
      { label: '、、、', isCorrect: false },
      { label: '、、、。', isCorrect: true },
      { label: '、、、。(確かに、)', isCorrect: false },
    ],
  },
  {
    id: 's005',
    title: '九段下駅周辺',
    stage: {
      min: 4,
      max: 8,
    },
    background: backgroundPark,
    lines: [
      { speaker: 'ぼーぼ', text: 'ここなんですか？' },
      { speaker: 'ひろぽん', text: '、、、昭和館。' },
      { speaker: 'ぼーぼ', text: 'うわ、なんか嫌な名前。' },
      { speaker: 'ひろぽん', text: 'なんで？、会社で人が殴られてたから？' },
      { speaker: 'ぼーぼ', text: '、、、' },
      { speaker: 'ひろぽん', text: '殴ってくるってことは殴り返していいてことなんだよ。' },
    ],
    selections: [
      { label: '、、、', isCorrect: false },
      { label: '、、、', isCorrect: false },
      { label: '、、、', isCorrect: false },
    ],
  },
  {
    id: 's006',
    title: 'On the ship',
    stage: {
      min: 4,
      max: 8,
    },
    background: backgroundPark,
    lines: [
      { speaker: 'ひろぽん', text: 'Stop worrying about' },
    ],
    selections: [
      { label: 'Your looks.', isCorrect: false },
      { label: 'Your future.', isCorrect: false },
      { label: 'It is okay to worry!', isCorrect: false },
    ],
  },
  {
    id: 's007',
    title: 'ロックンロール',
    stage: {
      min: 4,
      max: 8,
    },
    background: backgroundPark,
    lines: [
      { speaker: 'ひろぽん', text: 'たった一かけらの勇気があれば' },
      { speaker: 'ぼーぼ', text: 'ほんとうのやさしさがあれば' },
      { speaker: 'ひろぽん', text: 'あなたを思う本当の心があれば' },
    ],
    selections: [
      { label: '僕はすべてを失えるんだ', isCorrect: false },
      { label: '僕はすべて(あなたを含む)を失えるんだ', isCorrect: true },
      { label: '僕はすべて(あなたを含まない)を失えるんだ', isCorrect: false },
    ],
  },
  {
    id: 's008',
    title: '生きてるじゃん',
    stage: {
      min: 4,
      max: 8,
    },
    background: backgroundPark,
    lines: [
      { speaker: 'ひろぽん', text: 'なにもしてない' },
      { speaker: 'ぼーぼ', text: 'わけじゃあない' },
      { speaker: 'ひろぽん', text: '悩んで学んで' },
    ],
    selections: [
      { label: '生きてるじゃん', isCorrect: true },
      { label: '生きてるじゃん', isCorrect: true },
      { label: '生きてるじゃん', isCorrect: true },
    ],
  },
  {
    id: 's009',
    title: '海(夜)',
    stage: {
      min: 4,
      max: 8,
    },
    background: backgroundPark,
    lines: [
      { speaker: 'ひろぽん', text: 'めっちゃ良くないですか？' },
      { speaker: 'ぼーぼ', text: '怖いです。' },
      { speaker: 'ひろぽん', text: 'そう？好きですけどね。' },
      { speaker: 'ぼーぼ', text: '間違って沼みたいなとこに入っちゃいません？' },
      { speaker: 'ひろぽん', text: 'その怖さもいいじゃない。あと、音しか聞こえないからさ、頭の中でいくらでも想像できるじゃん。……見えないものこそ、素敵なんだと思うんだよね。' },
    ],
    selections: [
      { label: '怖い、', isCorrect: false },
      { label: '素敵、', isCorrect: false },
      { label: '早く帰りたい、', isCorrect: true },
    ],
  },
  {
    id: 's010',
    title: 'ショッピング',
    stage: {
      min: 4,
      max: 8,
    },
    background: backgroundPark,
    lines: [
      { speaker: 'ぼーぼ', text: '（靴下を指さして）見てください！これめっちゃ可愛くないですか～？' },
      { speaker: 'ひろぽん', text: 'うーーん…。（…これを買って履くだけで、明日から『クセつよ靴下キャラ』になるんだよな。ずいぶん簡単だな。個性ってなんだろう…）' },
      { speaker: 'ひろぽん', text: '……いや、いいんだよ、いいんだけどさ、' },
      { speaker: 'ぼーぼ', text: 'え、？' },
      { speaker: 'ひろぽん', text: 'いや、デザインはかわいいよ。かわいいんだけど……これを買って履くだけで、『そういうキャラ』になれるわけじゃん。そう思うと個性ってなんだろうって思って、' },
      { speaker: 'ぼーぼ', text: '（あー…また始まった、という顔で）…えっ？' },
      { speaker: 'ひろぽん', text: 'だってさ、自分の中に何もないやつでも、何も考えずに、これを履けば『クセつよ靴下キャラ』って認識されるんだよ？なんかずいぶん簡単だよね。' },
    ],
    selections: [
      { label: 'そんなこと考えながら買い物して、疲れません？', isCorrect: false },
      { label: '（生きづらそうな人やなぁ。）', isCorrect: false },
      { label: '(あ、この柄もかわいい！)', isCorrect: true },
    ],
  },
];
