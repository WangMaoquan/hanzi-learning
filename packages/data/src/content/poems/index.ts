import type { PoemContent } from '../../types'

// 经典古诗示例
export const poems: PoemContent[] = [
  {
    id: 'poem-001',
    type: 'poem',
    title: '静夜思',
    content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    pinyin: 'chuáng qián míng yuè guāng, yí shì dì shàng shuāng.\njǔ tóu wàng míng yuè, dī tóu sī gù xiāng.',
    translation: '床前洒满了明亮的月光，好像地上铺了一层白霜。抬头望着天上的明月，低头思念起遥远的故乡。',
    difficulty: 1,
    tags: ['一年级', '唐诗', '李白', '思乡', '咏月'],
    audioUrl: '/audio/jingyesi.mp3',
    author: '李白',
    dynasty: 'tang',
    verses: [
      '床前明月光',
      '疑是地上霜',
      '举头望明月',
      '低头思故乡',
    ],
    annotation: {
      静夜: '宁静的夜晚',
      明月: '明亮的月亮',
      疑: '好像',
      霜: '秋冬地面凝结的冰晶',
      举头: '抬起头',
      思: '思念',
      故乡: '出生的地方，家乡',
    },
    appreciation: '这首诗描绘了诗人在寂静的夜晚看到明月而产生的思乡之情。前两句用"明月光"比作"地上霜"，形象地表现了月光的皎洁。后两句通过"举头"到"低头"的动作变化，表达了诗人由赏月到思乡的情感转折。全诗语言浅显易懂，却意境深远，是千古传诵的名篇。',
    background: '李白在唐玄宗开元十四年（726年）游历扬州时所作，当时诗人26岁，独自在外漂泊。',
  },
  {
    id: 'poem-002',
    type: 'poem',
    title: '春晓',
    content: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    pinyin: 'chūn mián bù jué xiǎo, chù chù wén tí niǎo.\nyè lái fēng yǔ shēng, huā luò zhī duō shǎo.',
    translation: '春天的夜晚睡得很香甜，不知不觉天就亮了。到处都能听到鸟叫声。回想起昨晚的风雨声，不知道有多少花朵被打落了。',
    difficulty: 1,
    tags: ['一年级', '唐诗', '孟浩然', '春天', '咏物'],
    author: '孟浩然',
    dynasty: 'tang',
    verses: [
      '春眠不觉晓',
      '处处闻啼鸟',
      '夜来风雨声',
      '花落知多少',
    ],
    annotation: {
      春晓: '春天的早晨',
      眠: '睡觉',
      不觉: '不知不觉',
      晓: '天亮',
      处处: '到处',
      闻: '听到',
      啼鸟: '鸣叫的鸟',
      知多少: '不知道有多少',
    },
    appreciation: '这首诗描写了春天早晨的景象和诗人的感受。首句"春眠不觉晓"写出春睡的香甜，第二句"处处闻啼鸟"从听觉角度描绘春天的活力。后两句由现在回想起昨夜的风雨，表达了诗人对春花零落的关切。全诗语言清新自然，富有生活情趣。',
    background: '孟浩然是唐代著名的山水田园诗人，这首诗是他隐居鹿门山时所作。',
  },
  {
    id: 'poem-003',
    type: 'poem',
    title: '登鹳雀楼',
    content: '白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
    pinyin: 'bái rì yī shān jìn, huáng hé rù hǎi liú.\nyù qióng qiān lǐ mù, gèng shàng yī céng lóu.',
    translation: '夕阳沿着山峦渐渐消失，黄河水奔腾流向大海。想要看到千里之外的风景，就必须再登上一层楼。',
    difficulty: 1,
    tags: ['二年级', '唐诗', '王之涣', '登高', '励志'],
    author: '王之涣',
    dynasty: 'tang',
    verses: [
      '白日依山尽',
      '黄河入海流',
      '欲穷千里目',
      '更上一层楼',
    ],
    annotation: {
      鹳雀楼: '古代名楼，在山西永济，因常有鹳雀栖息而得名',
      白日: '太阳',
      依: '依靠',
      尽: '消失',
      黄河: '中国第二大河',
      欲: '想要',
      穷: '穷尽，看尽',
      千里目: '能看到千里的眼睛',
      更: '再',
    },
    appreciation: '这是一首著名的登高远眺诗。前两句写景，描绘夕阳西下、黄河东流的壮阔景象，气势磅礴。后两句抒怀，富含哲理：要想看得更远，就必须站得更高。这两句诗不仅写景，更是表达了一种积极进取的人生态度，成为千古传诵的名句。',
    background: '王之涣在唐玄宗开元年间任蒲州（今山西永济）刺史时，登鹳雀楼有感而发。',
  },
]

// 按朝代分组
export const byDynasty = {
  tang: poems.filter((p) => p.dynasty === 'tang'),
  song: poems.filter((p) => p.dynasty === 'song'),
}

// 按年级分组
export const byGrade = {
  grade1: poems.filter((p) => p.tags.includes('一年级')),
  grade2: poems.filter((p) => p.tags.includes('二年级')),
}

export default poems
