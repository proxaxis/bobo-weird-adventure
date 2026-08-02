import backgroundCafe from '@/assets/scenario/883f2204747b049841122c2a7c35fec5.png';
import backgroundPark from '@/assets/scenario/b6bdfb08e0f0e18618a70e66170bbc77.png';

export const defineScenario = () => [
  {
    id: 's001',
    title: 'カフェでランチ中',
    stage: 1,
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
    stage: 1,
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
    stage: 1,
    background: backgroundPark,
    lines: [{ speaker: 'ひろぽん', text: 'うわ、急に降ってきましたね……！ぼーぼさん、傘って持ってますか？' }],
    selections: [
      { label: '持ってますよ！入りますか？', isCorrect: true },
      { label: '持ってないです！でも僕、気にしないんで濡れていきましょ', isCorrect: false },
      { label: 'イカハウスで花火大会が見えんのじゃよ。', isCorrect: false },
    ],
  },
];
