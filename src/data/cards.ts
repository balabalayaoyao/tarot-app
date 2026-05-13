export interface TarotCard {
  id: number;
  name_zh: string;
  name_en: string;
  arcana: 'major' | 'minor';
  suit?: string;
  upright_keywords: string[];
  reversed_keywords: string[];
  upright_meaning: string;
  reversed_meaning: string;
  symbol: string; // emoji symbol for visual
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0, name_zh: '愚者', name_en: 'The Fool', arcana: 'major',
    symbol: '🌟',
    upright_keywords: ['新开始', '冒险', '天真', '自由'],
    reversed_keywords: ['鲁莽', '逃避', '缺乏方向'],
    upright_meaning: '象征全新的旅程与无限可能，带着赤子之心踏上未知之路。',
    reversed_meaning: '可能正在逃避现实，或冲动行事而忽视了潜在风险。',
  },
  {
    id: 1, name_zh: '魔术师', name_en: 'The Magician', arcana: 'major',
    symbol: '🪄',
    upright_keywords: ['意志力', '技巧', '创造', '主动'],
    reversed_keywords: ['欺骗', '操控', '能力未发挥'],
    upright_meaning: '你拥有实现目标所需的一切资源和能力，是时候付诸行动了。',
    reversed_meaning: '才能未得到充分发挥，或存在自我欺骗和操控他人的倾向。',
  },
  {
    id: 2, name_zh: '女祭司', name_en: 'The High Priestess', arcana: 'major',
    symbol: '🌙',
    upright_keywords: ['直觉', '神秘', '内在智慧', '潜意识'],
    reversed_keywords: ['忽视直觉', '秘密', '表面信息'],
    upright_meaning: '倾听内心深处的声音，潜意识中藏有你需要的答案。',
    reversed_meaning: '正在压制自己的直觉，或有重要信息被隐藏未被揭示。',
  },
  {
    id: 3, name_zh: '皇后', name_en: 'The Empress', arcana: 'major',
    symbol: '🌺',
    upright_keywords: ['丰盛', '母性', '创造力', '自然'],
    reversed_keywords: ['依赖', '过度保护', '创造力受阻'],
    upright_meaning: '丰盈与创造力的象征，生命中充满滋养与美好。',
    reversed_meaning: '可能过于依赖他人，或创造力受到压制，需要找回自主权。',
  },
  {
    id: 4, name_zh: '皇帝', name_en: 'The Emperor', arcana: 'major',
    symbol: '👑',
    upright_keywords: ['权威', '稳定', '结构', '领导力'],
    reversed_keywords: ['专制', '缺乏弹性', '控制欲'],
    upright_meaning: '通过秩序和纪律建立稳固基础，发挥领导潜力。',
    reversed_meaning: '过度控制或权威主义，需要学会放权与信任。',
  },
  {
    id: 5, name_zh: '教皇', name_en: 'The Hierophant', arcana: 'major',
    symbol: '⛪',
    upright_keywords: ['传统', '信仰', '制度', '精神指引'],
    reversed_keywords: ['叛逆', '非传统', '质疑权威'],
    upright_meaning: '遵循传统智慧和已建立的体系，寻求精神层面的指引。',
    reversed_meaning: '正在质疑传统束缚，渴望打破规则走出自己的路。',
  },
  {
    id: 6, name_zh: '恋人', name_en: 'The Lovers', arcana: 'major',
    symbol: '💕',
    upright_keywords: ['爱情', '选择', '和谐', '价值观'],
    reversed_keywords: ['不和谐', '错误选择', '价值冲突'],
    upright_meaning: '面临重要的选择，遵从内心，在关系中寻求真正的和谐。',
    reversed_meaning: '关系中存在不和谐，或正面临一个内心犹豫的艰难抉择。',
  },
  {
    id: 7, name_zh: '战车', name_en: 'The Chariot', arcana: 'major',
    symbol: '⚡',
    upright_keywords: ['意志力', '胜利', '掌控', '前进'],
    reversed_keywords: ['失控', '攻击性', '方向偏离'],
    upright_meaning: '以坚定的意志力克服障碍，掌控局面向前冲刺。',
    reversed_meaning: '前进方向可能出现偏差，需要重新整合内外力量。',
  },
  {
    id: 8, name_zh: '力量', name_en: 'Strength', arcana: 'major',
    symbol: '🦁',
    upright_keywords: ['内在力量', '勇气', '耐心', '温柔'],
    reversed_keywords: ['软弱', '自我怀疑', '压制情感'],
    upright_meaning: '真正的力量来自温柔与耐心，以慈悲之心驯服内心的野性。',
    reversed_meaning: '正在压制自己的情感或感到力不从心，需要重拾自信。',
  },
  {
    id: 9, name_zh: '隐士', name_en: 'The Hermit', arcana: 'major',
    symbol: '🏮',
    upright_keywords: ['沉思', '独处', '内省', '指引'],
    reversed_keywords: ['孤立', '退缩', '拒绝指引'],
    upright_meaning: '是时候独处反思，在内心的宁静中寻找真正的智慧。',
    reversed_meaning: '过度孤立自己，或拒绝接受他人的指引和帮助。',
  },
  {
    id: 10, name_zh: '命运之轮', name_en: 'Wheel of Fortune', arcana: 'major',
    symbol: '🎡',
    upright_keywords: ['转机', '命运', '好运', '周期'],
    reversed_keywords: ['厄运', '抗拒变化', '循环'],
    upright_meaning: '命运正在转动，好运即将来临，顺应变化的自然节律。',
    reversed_meaning: '正处于低潮期，但要记得轮子终会转向，抗拒只会延长痛苦。',
  },
  {
    id: 11, name_zh: '正义', name_en: 'Justice', arcana: 'major',
    symbol: '⚖️',
    upright_keywords: ['公正', '真相', '因果', '客观'],
    reversed_keywords: ['不公正', '偏见', '逃避责任'],
    upright_meaning: '因果法则发挥作用，以客观公正的态度面对现实。',
    reversed_meaning: '面临不公正的处境，或正在逃避自己行为所带来的责任。',
  },
  {
    id: 12, name_zh: '倒吊人', name_en: 'The Hanged Man', arcana: 'major',
    symbol: '🙃',
    upright_keywords: ['暂停', '放手', '新视角', '牺牲'],
    reversed_keywords: ['执着', '延迟', '无谓牺牲'],
    upright_meaning: '从不同角度看待问题，有时放手和暂停比强行推进更有智慧。',
    reversed_meaning: '固执地坚持无效的方式，或做出了不必要的牺牲。',
  },
  {
    id: 13, name_zh: '死神', name_en: 'Death', arcana: 'major',
    symbol: '🌑',
    upright_keywords: ['转变', '结束', '新生', '蜕变'],
    reversed_keywords: ['抗拒改变', '停滞', '腐朽'],
    upright_meaning: '一个阶段的终结意味着另一个崭新开始，蜕变正在发生。',
    reversed_meaning: '抗拒必要的改变，导致能量停滞，无法向前。',
  },
  {
    id: 14, name_zh: '节制', name_en: 'Temperance', arcana: 'major',
    symbol: '✨',
    upright_keywords: ['平衡', '耐心', '调和', '适度'],
    reversed_keywords: ['失衡', '过度', '缺乏节制'],
    upright_meaning: '以耐心和节制调和生活中的各种元素，找到完美平衡。',
    reversed_meaning: '生活失去平衡，某些方面过度而其他方面被忽视。',
  },
  {
    id: 15, name_zh: '恶魔', name_en: 'The Devil', arcana: 'major',
    symbol: '🔗',
    upright_keywords: ['束缚', '执念', '物质主义', '阴影'],
    reversed_keywords: ['解脱', '释放', '重拾力量'],
    upright_meaning: '正被某种执念或物质欲望所束缚，需要正视内心的阴暗面。',
    reversed_meaning: '正在从束缚中解脱，重新掌控自己的生命。',
  },
  {
    id: 16, name_zh: '塔', name_en: 'The Tower', arcana: 'major',
    symbol: '⚡',
    upright_keywords: ['突变', '混乱', '启示', '解构'],
    reversed_keywords: ['避免灾难', '内部变革', '恐惧变化'],
    upright_meaning: '突如其来的变化打破旧有结构，虽然痛苦却带来启示与重建机会。',
    reversed_meaning: '正在极力避免不可避免的改变，或变革在内部悄然发生。',
  },
  {
    id: 17, name_zh: '星星', name_en: 'The Star', arcana: 'major',
    symbol: '⭐',
    upright_keywords: ['希望', '灵感', '更新', '平静'],
    reversed_keywords: ['绝望', '失去信仰', '幻灭'],
    upright_meaning: '经历风雨之后，希望之光照耀前路，内心平静而充满灵感。',
    reversed_meaning: '对未来感到绝望，需要重新点燃内心的希望之火。',
  },
  {
    id: 18, name_zh: '月亮', name_en: 'The Moon', arcana: 'major',
    symbol: '🌕',
    upright_keywords: ['幻觉', '恐惧', '潜意识', '直觉'],
    reversed_keywords: ['混乱消散', '释放恐惧', '真相浮现'],
    upright_meaning: '处于不确定和幻觉之中，需要穿越迷雾信任自己的直觉。',
    reversed_meaning: '迷雾开始消散，隐藏的恐惧和混乱正被带到光明中处理。',
  },
  {
    id: 19, name_zh: '太阳', name_en: 'The Sun', arcana: 'major',
    symbol: '☀️',
    upright_keywords: ['成功', '喜悦', '活力', '光明'],
    reversed_keywords: ['过于乐观', '暂时遮蔽', '内心阴影'],
    upright_meaning: '光明与喜悦充满生命，成功与幸福近在咫尺，尽情享受此刻。',
    reversed_meaning: '过于乐观可能导致忽视现实，或短暂的阴云遮蔽了内心阳光。',
  },
  {
    id: 20, name_zh: '审判', name_en: 'Judgement', arcana: 'major',
    symbol: '🎺',
    upright_keywords: ['觉醒', '更新', '召唤', '宽恕'],
    reversed_keywords: ['自我怀疑', '无法原谅', '错误判断'],
    upright_meaning: '内在的觉醒时刻，以全新的眼光审视过去，迎接蜕变的召唤。',
    reversed_meaning: '被自我批判和过去的错误所困，难以做出清醒的判断。',
  },
  {
    id: 21, name_zh: '世界', name_en: 'The World', arcana: 'major',
    symbol: '🌍',
    upright_keywords: ['完成', '整合', '圆满', '成就'],
    reversed_keywords: ['未完成', '追求捷径', '延迟'],
    upright_meaning: '一个重要阶段圆满完成，感受成就与整合，为下一个循环做好准备。',
    reversed_meaning: '距离目标完成还差最后几步，或在追求捷径而非真正的圆满。',
  },
];

export const ALL_CARDS = MAJOR_ARCANA;

export function drawCards(count: number): { card: TarotCard; isReversed: boolean }[] {
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    card,
    isReversed: Math.random() > 0.5,
  }));
}
