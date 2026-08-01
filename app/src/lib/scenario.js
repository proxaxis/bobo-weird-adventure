export const defineScenario = () => ([
  {
    'id': 's001',
    'title': 'カフェでランチ中',
    'stage': 1,
    'background': '/scenario/883f2204747b049841122c2a7c35fec5.png',
    'lines': [{ 'speaker': 'ひろぽん', 'text': 'これすっごく美味しいですよー、ひとくちいります？' }],
    'choices': [
      { 'label': 'え、いいんですか？ありがとうございます！僕のもぜひ、どうぞ。' },
      { 'label': 'いやぁ、遠慮しときます。' },
      { 'label': 'イカハウスで花火大会が見えんのじゃよ。' },
    ],
  },
  {
    'id': 's002',
    'title': '夕暮れどきの公園',
    'stage': 1,
    'background': '/scenario/c6437575daafa9821fb9b145e3ec2d6e.png',
    'lines': [{ 'speaker': 'ひろぽん', 'text': '今日すごく楽しかったです。……もし時間大丈夫なら、少しだけ一緒に歩きませんか？' }],
    'choices': [
      { 'label': 'もちろんです！もう少し歩きましょ！' },
      { 'label': 'あ、すみません！今日このあと予定があって……また今度でもいいですか？' },
      { 'label': 'イカハウスで花火大会が見えんのじゃよ。' },
    ],
  },
  {
    'id': 's003',
    'title': '雨',
    'stage': 1,
    'background': '/scenario/c6437575daafa9821fb9b145e3ec2d6e.png',
    'lines': [{ 'speaker': 'ひろぽん', 'text': 'うわ、急に降ってきましたね……！ぼーぼさん、傘って持ってますか？' }],
    'choices': [
      { 'label': '持ってますよ！入りますか？' },
      { 'label': '持ってないです！でも僕、気にしないんで濡れていきましょ' },
      { 'label': 'イカハウスで花火大会が見えんのじゃよ。' },
    ],
  },
]);
