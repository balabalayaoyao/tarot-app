import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { TarotCard } from '../data/cards';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
}

interface AiReadingProps {
  question: string;
  cards: DrawnCard[];
  positions: string[];
}

// ─────────────────────────────────────────
// 1. 问题类型识别
// ─────────────────────────────────────────
type QuestionType = 'love' | 'career' | 'choice' | 'energy' | 'general';

function detectType(q: string): QuestionType {
  if (/感情|爱情|喜欢|暗恋|表白|分手|复合|恋爱|男友|女友|对象|他|她|关系|婚|嫁|约会/.test(q)) return 'love';
  if (/工作|职场|升职|跳槽|创业|面试|项目|老板|同事|事业|求职|实习|加薪|team|团队/.test(q)) return 'career';
  if (/选择|还是|要不要|该不该|去不去|做不做|决定|纠结|犹豫|方向|怎么办|如何选/.test(q)) return 'choice';
  if (/运势|能量|状态|今日|今天|最近|近期|整体|气场|磁场|运气/.test(q)) return 'energy';
  return 'general';
}

// 从问题里提取关键实体（简单版）
function extractSubject(q: string): string {
  // 尝试抓出问题的核心主语/对象，返回用于句子中的短语
  const loveMatch = q.match(/(?:和|跟|与)?([^\s，。？！的]{2,6})(?:的关系|在一起|表白|分手|复合)/);
  if (loveMatch) return loveMatch[1];
  const careerMatch = q.match(/([^\s，。？！]{2,8})(?:工作|项目|团队|职位|岗位)/);
  if (careerMatch) return careerMatch[1];
  return '';
}

// ─────────────────────────────────────────
// 2. 分类型的解读片段库
// ─────────────────────────────────────────

type ReadingContext = {
  question: string;
  subject: string;
  c1: DrawnCard; c2: DrawnCard; c3: DrawnCard;
  pos1: string; pos2: string; pos3: string;
};

function desc(d: DrawnCard) {
  return `${d.card.name_zh}（${d.isReversed ? '逆位' : '正位'}）`;
}
function kw(d: DrawnCard, n = 2) {
  return (d.isReversed ? d.card.reversed_keywords : d.card.upright_keywords).slice(0, n).join('、');
}
function meaning(d: DrawnCard) {
  return d.isReversed ? d.card.reversed_meaning : d.card.upright_meaning;
}

// ── 感情类 ──
function loveReading(ctx: ReadingContext): string {
  const { question, subject, c1, c2, c3, pos1, pos2, pos3 } = ctx;
  const subjectStr = subject ? `与${subject}之间` : '这段感情';

  const overview = c3.isReversed
    ? `整体来看，${subjectStr}的能量在「${kw(c1, 1)}→${kw(c2, 1)}→${kw(c3, 1)}」之间流动。牌面提示此刻需要放慢脚步，而非急于推进。`
    : `整体来看，${subjectStr}的能量呈现出积极的流向——从「${kw(c1, 1)}」经过「${kw(c2, 1)}」，最终指向「${kw(c3, 1)}」。`;

  const card1Block = `【${pos1} · ${desc(c1)}】
关键词：${kw(c1)}

${meaning(c1)} 这段感情在过去积累的底色是「${kw(c1, 1)}」——${c1.isReversed ? '曾经有些什么没有被好好处理，它的影响还在延续。' : '那些真实感受过的美好，是你们关系的根基，它不会消失。'}`;

  const card2Block = `【${pos2} · ${desc(c2)}】
关键词：${kw(c2)}

${meaning(c2)} 此刻，${subjectStr}的核心议题是「${kw(c2, 1)}」。${c2.isReversed ? '内心可能有些压抑没有被说出来，或者你感到对方难以捉摸。先照顾好自己的感受，再去思考下一步。' : '当下的能量是清醒而真实的，你内心其实已经知道自己想要什么，只是需要勇气去承认。'}`;

  const card3Block = `【${pos3} · ${desc(c3)}】
关键词：${kw(c3)}

${meaning(c3)} ${c3.isReversed ? `关于「${question}」这个问题，牌面提示未来需要先处理内在的阻力，期待值可以稍作调整——有时候，退一步是为了走得更稳。` : `关于「${question}」，牌面给出了温和而积极的回应。能量正在流向你期待的方向，继续保持真诚就好。`}`;

  const advice = c2.isReversed
    ? `感情里最难的不是对方，往往是自己心里那个没说出口的部分。牌面建议你先与自己和解，把心里真正想要的说清楚——哪怕只是对自己说。${subjectStr}的走向，很大程度上取决于你是否愿意先迈出那一步诚实。`
    : `牌面整体能量是温暖而流动的。你所问的这个问题，答案其实已经在你心里了——你只是在寻求一个"可以往前走"的确认。这张牌就是那个确认。`;

  const tip = c2.isReversed
    ? `宜：把心里话说出来，哪怕只是写下来\n忌：用沉默代替沟通，越等越难开口`
    : `宜：主动表达感受，真诚胜过技巧\n忌：过度解读对方的每个细节，给自己增加焦虑`;

  return buildOutput({ overview, card1Block, card2Block, card3Block, advice, tip });
}

// ── 事业类 ──
function careerReading(ctx: ReadingContext): string {
  const { question, subject, c1, c2, c3, pos1, pos2, pos3 } = ctx;
  const subjectStr = subject ? `「${subject}」这件事` : '这份工作/事业';

  const overview = c3.isReversed
    ? `针对你问的${subjectStr}，牌面整体提示这是一个需要「审视方向」的阶段，而非一味加速推进的时机。`
    : `针对你问的${subjectStr}，整体牌面能量是向上流动的——从「${kw(c1, 1)}」到「${kw(c3, 1)}」，有清晰的上升轨迹。`;

  const card1Block = `【${pos1} · ${desc(c1)}】
关键词：${kw(c1)}

${meaning(c1)} 在职业路径的${pos1}，你积累的是「${kw(c1, 1)}」——${c1.isReversed ? '也许曾经有过一段不太顺的经历，或者某些能力还没被看见，但这些都构成了你今天的判断力。' : '这是你真实建立起来的能力和经验，不是运气，是积累。'}`;

  const card2Block = `【${pos2} · ${desc(c2)}】
关键词：${kw(c2)}

${meaning(c2)} 关于「${question}」，当下的核心议题是「${kw(c2, 1)}」。${c2.isReversed ? '此刻可能感受到阻力或内耗——是环境的压力，还是自己对方向的不确定？先把这个问题想清楚，比急着行动更重要。' : '你的能力和资源在当下是到位的，缺的不是准备，而是一个清晰的决定。'}`;

  const card3Block = `【${pos3} · ${desc(c3)}】
关键词：${kw(c3)}

${meaning(c3)} ${c3.isReversed ? `关于「${question}」，牌面提示结果需要更多耐心，或者当前方向需要微调。不是说不行，而是时机和方式可能需要再斟酌一下。` : `关于「${question}」，牌面指向的未来能量是「${kw(c3, 1)}」——只要方向不偏，结果会是你期待的样子。`}`;

  const advice = c2.isReversed
    ? `职场里内耗最贵。你现在需要做的不是更努力，而是更清晰——把「我真正想要什么」和「我现在在做什么」对齐，找到那个交叉点，然后把精力集中在那里。`
    : `牌面整体是支持你往前走的。关于「${question}」，你的直觉方向是对的，不需要反复确认，需要的是把它落地执行。拖延的成本比试错的成本高得多。`;

  const tip = c2.isReversed
    ? `宜：梳理清楚真正的优先级，聚焦核心\n忌：同时推进太多事情，分散精力`
    : `宜：把计划变成今天就能做的第一步\n忌：等到"准备好了"再出发，那一天不会自己到来`;

  return buildOutput({ overview, card1Block, card2Block, card3Block, advice, tip });
}

// ── 选择类 ──
function choiceReading(ctx: ReadingContext): string {
  const { question, c1, c2, c3, pos1, pos2, pos3 } = ctx;

  // 从问题里尝试提取两个选项
  const optionMatch = question.match(/(.{1,8})还是(.{1,8})/);
  const optA = optionMatch?.[1]?.trim() ?? '选项A';
  const optB = optionMatch?.[2]?.trim() ?? '选项B';
  const hasOptions = !!optionMatch;

  const overview = `关于「${question}」，三张牌给出的不是一个非此即彼的答案，而是一张帮你看清楚「你自己」的地图。${hasOptions ? `「${optA}」与「${optB}」都只是表面的形式，真正的问题是：哪个选择更符合你内心深处真正想要的方向？` : ''}`;

  const card1Block = `【${pos1} · ${desc(c1)}】
关键词：${kw(c1)}

${meaning(c1)} 你之所以纠结，${c1.isReversed ? `部分原因来自${pos1}的「${kw(c1, 1)}」——曾经有过的遗憾或未完成的事，让你在做这个决定时格外谨慎。这不是弱点，而是自我保护的本能。` : `也许是因为你在${pos1}已经走得足够远，这个决定的重量你清楚地感受到了。那份慎重本身，说明你在认真对待自己的人生。`}`;

  const card2Block = `【${pos2} · ${desc(c2)}】
关键词：${kw(c2)}

${meaning(c2)} 此刻让你犹豫的核心，是「${kw(c2, 1)}」。${c2.isReversed ? '你可能在用"再想想"来回避一个其实已经有答案的问题——内心深处你已经知道了，只是还没准备好承担那个选择的重量。' : '你的直觉是清醒的。此刻感受到的那个"倾向"，就是你真正的答案，不需要再找更多理由来说服自己。'}`;

  const card3Block = `【${pos3} · ${desc(c3)}】
关键词：${kw(c3)}

${meaning(c3)} ${c3.isReversed ? `无论你最终选择${hasOptions ? `「${optA}」还是「${optB}」` : '哪个方向'}，牌面都提示：${pos3}需要你保持灵活，不要把这个决定当成"最终答案"，留有调整的空间。` : `${pos3}的能量是「${kw(c3, 1)}」。这提示你，${hasOptions ? `你内心倾向的那个选择` : '你直觉感受到的方向'}，能量上是流动且正向的。`}`;

  const advice = c2.isReversed
    ? `关于「${question}」，真相是：你现在的纠结，更多来自对"选错了怎么办"的恐惧，而不是真的不知道选哪个。塔罗牌的建议是：把两个选项各写一张纸，分别问自己"如果这个被排除了，我会失落还是松了一口气"——那个答案，就是你真正想要的。`
    : `关于「${question}」，牌面整体能量清晰。${hasOptions ? `「${optA}」和「${optB}」不是对立的两条路，而是两种不同的你。` : ''}选择的本质不是找到"更好的那个"，而是找到"更像你自己的那个"。`;

  const tip = `宜：相信自己第一反应里的那个倾向\n忌：用"再等等看"来拖延一个已经有答案的决定`;

  return buildOutput({ overview, card1Block, card2Block, card3Block, advice, tip });
}

// ── 运势/能量类 ──
function energyReading(ctx: ReadingContext): string {
  const { question, c1, c2, c3, pos1, pos2, pos3 } = ctx;

  const timeWord = /今天|今日/.test(question) ? '今天' : /近期|最近/.test(question) ? '近期' : '此阶段';

  const overview = `${timeWord}的整体能量：「${kw(c1, 1)}」作为底色，「${kw(c2, 1)}」是当下的主旋律，「${kw(c3, 1)}」是能量流向的方向。${c2.isReversed ? `整体感是有一些内在的波动需要被安抚，不适合强行推进，更适合向内收一收。` : `整体感是流动而向上的，${timeWord}的能量场对你是友好的。`}`;

  const card1Block = `【${pos1} · ${desc(c1)}】
关键词：${kw(c1)}

${meaning(c1)} ${timeWord}出发时你携带的底层能量是「${kw(c1, 1)}」——${c1.isReversed ? '昨天或者之前的一些事情还带着余波，这会在今天的行动中隐约发挥影响，值得留意。' : '这是一个相对稳固的起点，今天的事情建立在这个基础上，不会太差。'}`;

  const card2Block = `【${pos2} · ${desc(c2)}】
关键词：${kw(c2)}

${meaning(c2)} ${timeWord}的核心能量场是「${kw(c2, 1)}」。${c2.isReversed ? `这提示${timeWord}可能会有一些意想不到的阻力或能量低谷，记得给自己留出缓冲时间，不要把日程排得太满。` : `这是一个相当不错的能量状态——${timeWord}适合推进重要的事，跟人沟通也会比平时顺畅一些。`}`;

  const card3Block = `【${pos3} · ${desc(c3)}】
关键词：${kw(c3)}

${meaning(c3)} ${timeWord}能量的收尾方向是「${kw(c3, 1)}」。${c3.isReversed ? `结尾可能会有点疲惫或者感到没达到预期，但这只是能量的正常波动，休息就是最好的应对。` : `收尾的能量是正向的，今天做的事情会有一个相对不错的结果或收获，保持这个节奏就好。`}`;

  const advice = c2.isReversed
    ? `${timeWord}的关键词是「照顾好自己」。牌面不建议你在内在能量未稳的情况下强行输出，试试看：把最重要的一两件事做好，其余的可以往后推。`
    : `${timeWord}整体能量场对你是支持的。最好的用法是：趁能量顺的时候，把一件你一直在拖着的事往前推一步——就一步就够了。`;

  const tip = c2.isReversed
    ? `宜：早点休息，给身心留白\n忌：用刷手机和无效社交消耗本就有限的能量`
    : `宜：主动出击，今天说出口的话比平时更有力量\n忌：把好状态全浪费在等待和犹豫上`;

  return buildOutput({ overview, card1Block, card2Block, card3Block, advice, tip });
}

// ── 通用类 ──
function generalReading(ctx: ReadingContext): string {
  const { question, c1, c2, c3, pos1, pos2, pos3 } = ctx;

  const overview = `针对「${question}」，三张牌从过去、现在、未来三个维度展开了回应。整体能量从「${kw(c1, 1)}」流向「${kw(c3, 1)}」，${c2.isReversed ? '中间经历一段需要向内沉淀的阶段。' : '整个流向是清晰而向前的。'}`;

  const card1Block = `【${pos1} · ${desc(c1)}】
关键词：${kw(c1)}

${meaning(c1)} 关于「${question}」，你走到今天携带的底层经验是「${kw(c1, 1)}」——${c1.isReversed ? '也许曾经有过一些不那么顺利的经历，但它们都成为了你今天判断力的一部分。' : '这是你真实积累起来的底气，不管前路如何，这部分不会消失。'}`;

  const card2Block = `【${pos2} · ${desc(c2)}】
关键词：${kw(c2)}

${meaning(c2)} 就你的问题而言，当下最核心的能量是「${kw(c2, 1)}」。${c2.isReversed ? '此刻可能感受到某种阻力或内在拉扯，与其强行突破，不如先停下来看清楚阻力从哪里来。' : '你现在的状态其实比你想象的更好，内在的清醒和外在的资源都在，缺的只是一个"开始"的动作。'}`;

  const card3Block = `【${pos3} · ${desc(c3)}】
关键词：${kw(c3)}

${meaning(c3)} 关于「${question}」的走向，牌面指向「${kw(c3, 1)}」。${c3.isReversed ? '这不是否定，而是提醒——结果可能和你预想的形式不一样，但能量上你在往对的方向走，保持弹性。' : '只要你不因为犹豫而放弃，结果会是你期待的样子。'}`;

  const advice = `三张牌合在一起，给出的是关于「${question}」的一个清晰画面：${c2.isReversed ? `当下需要先处理内在的阻力，而不是急着向外行动。真正的转机往往出现在你愿意停下来，诚实面对自己的那一刻之后。` : `你比自己以为的更有准备。那个让你迟疑的问题，答案其实已经在你心里了，只差一个"我决定了"。`}`;

  const tip = c2.isReversed
    ? `宜：给自己一段不被打扰的独处时间，和自己的内心对话\n忌：把焦虑转移到刷手机或者找人倾诉，那只会让问题更模糊`
    : `宜：把心里那个"想做但还没做"的事，今天迈出第一步\n忌：用"再等等看"拖延一个其实已经清楚的决定`;

  return buildOutput({ overview, card1Block, card2Block, card3Block, advice, tip });
}

// ─────────────────────────────────────────
// 3. 统一输出格式
// ─────────────────────────────────────────
function buildOutput({
  overview, card1Block, card2Block, card3Block, advice, tip
}: {
  overview: string;
  card1Block: string;
  card2Block: string;
  card3Block: string;
  advice: string;
  tip: string;
}): string {
  return `✦ 牌阵总览

${overview}

───────────────────

☽ 逐牌解析

${card1Block}

${card2Block}

${card3Block}

───────────────────

✦ 综合指引

${advice}

记住，塔罗牌是镜子，不是枷锁。它照见此刻的能量，而你永远有选择的自由。✨

───────────────────

🌙 今日小提示

${tip}`;
}

// ─────────────────────────────────────────
// 4. 主入口
// ─────────────────────────────────────────
function generateReading(question: string, cards: DrawnCard[], positions: string[]): string {
  const [c1, c2, c3] = cards;
  const [pos1, pos2, pos3] = positions;

  const type = detectType(question);
  const subject = extractSubject(question);
  const ctx: ReadingContext = {
    question, subject,
    c1, c2, c3,
    pos1: pos1 ?? '过去',
    pos2: pos2 ?? '现在',
    pos3: pos3 ?? '未来',
  };

  switch (type) {
    case 'love':    return loveReading(ctx);
    case 'career':  return careerReading(ctx);
    case 'choice':  return choiceReading(ctx);
    case 'energy':  return energyReading(ctx);
    default:        return generalReading(ctx);
  }
}

// ─────────────────────────────────────────
// 5. 组件
// ─────────────────────────────────────────
export function AiReading({ question, cards, positions }: AiReadingProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    const fullText = generateReading(question, cards, positions);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (i >= fullText.length) { setIsComplete(true); return; }
      i += 2;
      setDisplayedText(fullText.slice(0, i));
      const chunk = fullText.slice(i - 2, i);
      timer = setTimeout(tick, /[。，、？！\n─]/.test(chunk) ? 55 : 16);
    };

    const start = setTimeout(tick, 400);
    return () => { clearTimeout(start); clearTimeout(timer); };
  }, [question, cards, positions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      style={{
        maxWidth: 640, margin: '0 auto',
        background: 'rgba(44, 24, 16, 0.75)',
        border: '1px solid rgba(212, 149, 106, 0.28)',
        borderRadius: 18,
        padding: '28px 30px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 0 60px rgba(200,130,80,0.1), 0 20px 60px rgba(0,0,0,0.35)',
      }}
    >
      {/* Status */}
      <div style={{
        fontSize: 11, color: '#D4956A', letterSpacing: 3,
        marginBottom: 22, textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <motion.span
          animate={!isComplete ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isComplete ? '#8FBF8F' : '#D4956A',
            display: 'inline-block',
            boxShadow: isComplete ? '0 0 8px #8FBF8F' : '0 0 10px rgba(212,149,106,0.8)',
          }}
        />
        {isComplete ? '解读完成' : '正在解读...'}
      </div>

      {/* Text */}
      <div style={{
        fontSize: 14.5, lineHeight: 2,
        color: 'rgba(240, 220, 195, 0.9)',
        whiteSpace: 'pre-wrap',
        fontFamily: '"PingFang SC", "Hiragino Sans GB", sans-serif',
        minHeight: 180, letterSpacing: 0.3,
      }}>
        {displayedText}
        {!isComplete && (
          <span style={{
            display: 'inline-block', width: 2, height: '1em',
            background: '#D4956A', marginLeft: 2,
            verticalAlign: 'text-bottom',
            animation: 'blink 0.75s step-end infinite',
          }} />
        )}
      </div>
    </motion.div>
  );
}
