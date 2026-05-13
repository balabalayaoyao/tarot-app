import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarField } from './components/StarField';
import { TarotCardComponent } from './components/TarotCard';
import { AiReading } from './components/AiReading';
import { drawCards } from './data/cards';
import type { TarotCard } from './data/cards';
import './App.css';

type AppStep = 'input' | 'shuffle' | 'reveal';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
}

const QUICK_QUESTIONS = [
  '今天的感情运势如何？',
  '近期工作该如何选择？',
  '今日整体能量如何？',
];

const POSITIONS = ['过去', '现在', '未来'];

// 暖色系色盘
const WARM = {
  bg:        'radial-gradient(ellipse at 30% 10%, #4A2010 0%, #2C1810 40%, #1E0E08 100%)',
  text:      'rgba(240, 215, 185, 0.92)',
  gold:      '#D4956A',
  goldLight: '#E8B88A',
  goldDim:   'rgba(212, 149, 106, 0.55)',
  rose:      '#C47E8C',
  panel:     'rgba(60, 30, 16, 0.72)',
  panelBorder:'rgba(212, 149, 106, 0.22)',
  inputBg:   'rgba(44, 22, 12, 0.8)',
  tagBg:     'rgba(212, 149, 106, 0.10)',
  tagBorder: 'rgba(212, 149, 106, 0.30)',
  divider:   'rgba(212, 149, 106, 0.25)',
  subtext:   'rgba(200, 165, 130, 0.55)',
};

export default function App() {
  const [step, setStep] = useState<AppStep>('input');
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [flippedCount, setFlippedCount] = useState(0);
  const [showReading, setShowReading] = useState(false);

  const handleStart = useCallback(() => {
    if (!question.trim() || question.length < 3) return;
    setStep('shuffle');
    setTimeout(() => {
      const cards = drawCards(3);
      setDrawnCards(cards);
      setFlippedCount(0);
      setShowReading(false);
      setStep('reveal');
    }, 2400);
  }, [question]);

  const handleFlip = useCallback((index: number) => {
    if (index !== flippedCount) return;
    const next = flippedCount + 1;
    setFlippedCount(next);
    if (next === 3) {
      setTimeout(() => setShowReading(true), 900);
    }
  }, [flippedCount]);

  const handleReset = () => {
    setStep('input');
    setQuestion('');
    setDrawnCards([]);
    setFlippedCount(0);
    setShowReading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: WARM.bg,
      color: WARM.text,
      fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <StarField />

      {/* Ambient glow top */}
      <div style={{
        position: 'fixed', top: -100, left: '50%',
        transform: 'translateX(-50%)',
        width: 600, height: 300,
        background: 'radial-gradient(ellipse, rgba(200,120,60,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', paddingTop: 52, paddingBottom: 28, userSelect: 'none' }}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 10, letterSpacing: 6, color: WARM.goldDim,
              textTransform: 'uppercase', marginBottom: 10,
            }}
          >
            ✦ &nbsp;Oracle&nbsp; ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              margin: 0,
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 800,
              letterSpacing: 6,
              background: `linear-gradient(135deg, ${WARM.gold} 0%, ${WARM.goldLight} 50%, ${WARM.gold} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            塔罗占卜
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              margin: '10px 0 0',
              fontSize: 12, color: WARM.subtext, letterSpacing: 3,
            }}
          >
            牌面即镜，答案在心中
          </motion.p>
        </div>

        <AnimatePresence mode="wait">

          {/* ══ STEP: INPUT ══ */}
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              style={{ maxWidth: 520, margin: '0 auto', padding: '0 24px 80px' }}
            >
              {/* Divider */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                margin: '0 0 32px',
              }}>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${WARM.divider})` }} />
                <span style={{ color: WARM.goldDim, fontSize: 14 }}>✦</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${WARM.divider})` }} />
              </div>

              {/* Label */}
              <label style={{
                display: 'block', marginBottom: 10,
                fontSize: 12, color: WARM.goldDim, letterSpacing: 2,
              }}>
                今天，你想问什么？
              </label>

              {/* Textarea */}
              <div style={{ position: 'relative' }}>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value.slice(0, 100))}
                  placeholder="把你的问题或困惑说出来，牌会给你指引..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: WARM.inputBg,
                    border: question.length >= 3
                      ? `1px solid rgba(212,149,106,0.55)`
                      : `1px solid rgba(212,149,106,0.2)`,
                    borderRadius: 14, padding: '14px 16px',
                    color: WARM.text, fontSize: 14, lineHeight: 1.75,
                    resize: 'none', outline: 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    boxShadow: question.length >= 3
                      ? '0 0 20px rgba(212,149,106,0.12)'
                      : 'none',
                    backdropFilter: 'blur(8px)',
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: 10, right: 12,
                  fontSize: 10,
                  color: question.length > 80 ? WARM.gold : WARM.subtext,
                  pointerEvents: 'none',
                }}>
                  {question.length}/100
                </div>
              </div>

              {/* Quick tags */}
              <div style={{ marginTop: 14, marginBottom: 32 }}>
                <div style={{ fontSize: 10, color: WARM.subtext, marginBottom: 10, letterSpacing: 1.5 }}>
                  快速选择
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {QUICK_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => setQuestion(q)}
                      style={{
                        background: question === q ? `rgba(212,149,106,0.18)` : WARM.tagBg,
                        border: question === q
                          ? `1px solid rgba(212,149,106,0.6)`
                          : `1px solid ${WARM.tagBorder}`,
                        borderRadius: 20, padding: '6px 14px',
                        color: question === q ? WARM.gold : 'rgba(212,149,106,0.7)',
                        fontSize: 12, cursor: 'pointer',
                        transition: 'all 0.2s',
                        letterSpacing: 0.3,
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={question.length >= 3 ? { scale: 1.02, boxShadow: '0 0 40px rgba(212,149,106,0.45), 0 6px 24px rgba(0,0,0,0.4)' } : {}}
                whileTap={question.length >= 3 ? { scale: 0.98 } : {}}
                onClick={handleStart}
                disabled={question.length < 3}
                style={{
                  width: '100%', padding: '16px',
                  background: question.length >= 3
                    ? `linear-gradient(135deg, #C8824A 0%, #A86030 50%, #C8824A 100%)`
                    : 'rgba(212,149,106,0.08)',
                  backgroundSize: '200% 100%',
                  border: question.length >= 3
                    ? '1px solid rgba(212,149,106,0.5)'
                    : '1px solid rgba(212,149,106,0.15)',
                  borderRadius: 14,
                  color: question.length >= 3 ? '#FFF4E8' : 'rgba(212,149,106,0.3)',
                  fontSize: 15, fontWeight: 700,
                  cursor: question.length >= 3 ? 'pointer' : 'not-allowed',
                  letterSpacing: 3,
                  boxShadow: question.length >= 3
                    ? '0 0 30px rgba(200,130,74,0.3), 0 4px 20px rgba(0,0,0,0.4)'
                    : 'none',
                  transition: 'all 0.3s',
                }}
              >
                ✨ &nbsp;开始占卜
              </motion.button>

              <div style={{
                textAlign: 'center', marginTop: 36,
                fontSize: 10, color: WARM.subtext, letterSpacing: 2,
              }}>
                ─── 基于标准 78 张塔罗牌 ───
              </div>
            </motion.div>
          )}

          {/* ══ STEP: SHUFFLE ══ */}
          {step === 'shuffle' && (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '30px 24px' }}
            >
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: WARM.goldDim, fontSize: 14, letterSpacing: 2.5, marginBottom: 52 }}
              >
                集中心神，感受牌的指引...
              </motion.p>

              {/* Shuffling animation */}
              <div style={{ position: 'relative', height: 170, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: 86, height: 140,
                      borderRadius: 10,
                      background: 'linear-gradient(160deg, #3D2010, #2C1810)',
                      border: `1px solid rgba(212,149,106,${0.2 + i * 0.05})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    }}
                    animate={{
                      x: [0, (i - 2) * 55, (i - 2) * 28, 0],
                      rotate: [0, (i - 2) * 16, (i - 2) * -8, 0],
                      y: [0, -18, 8, 0],
                      opacity: [0.7, 1, 0.8, 0.7],
                    }}
                    transition={{
                      duration: 2.2, repeat: Infinity,
                      delay: i * 0.08, ease: 'easeInOut',
                    }}
                  >
                    <span style={{ fontSize: 22, opacity: 0.45, color: WARM.gold }}>✦</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ color: WARM.gold, fontSize: 11, letterSpacing: 4, marginTop: 52 }}
              >
                ── 洗牌中 ──
              </motion.div>
            </motion.div>
          )}

          {/* ══ STEP: REVEAL ══ */}
          {step === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '0 24px 100px' }}
            >
              {/* Question recall */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  maxWidth: 520, margin: '0 auto 36px',
                  background: WARM.panel,
                  border: `1px solid ${WARM.panelBorder}`,
                  borderRadius: 12, padding: '12px 20px',
                  fontSize: 13, color: 'rgba(220, 190, 155, 0.85)',
                  letterSpacing: 0.3, lineHeight: 1.6,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span style={{ color: WARM.goldDim, marginRight: 6, fontSize: 11 }}>你问：</span>
                {question}
              </motion.div>

              {/* Flip hint */}
              <AnimatePresence>
                {flippedCount < 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      textAlign: 'center', fontSize: 11,
                      color: WARM.subtext, marginBottom: 28, letterSpacing: 1.5,
                    }}
                  >
                    依次点击每张牌，逐一揭晓命运的指引
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cards */}
              <div style={{
                display: 'flex', justifyContent: 'center',
                gap: 'clamp(18px, 4vw, 48px)',
                flexWrap: 'wrap',
                marginBottom: 44,
              }}>
                {drawnCards.map((drawn, i) => (
                  <TarotCardComponent
                    key={i}
                    card={drawn.card}
                    isReversed={drawn.isReversed}
                    positionLabel={POSITIONS[i] ?? ''}
                    index={i}
                    isFlipped={i < flippedCount}
                    canFlip={i === flippedCount}
                    onFlip={() => handleFlip(i)}
                  />
                ))}
              </div>

              {/* AI Reading */}
              <AnimatePresence>
                {showReading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ maxWidth: 640, margin: '0 auto' }}
                  >
                    <AiReading
                      question={question}
                      cards={drawnCards}
                      positions={POSITIONS}
                    />

                    {/* Actions */}
                    <div style={{
                      display: 'flex', justifyContent: 'center',
                      marginTop: 28,
                    }}>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleReset}
                        style={{
                          padding: '12px 32px',
                          background: WARM.tagBg,
                          border: `1px solid ${WARM.tagBorder}`,
                          borderRadius: 12,
                          color: WARM.gold,
                          fontSize: 13, cursor: 'pointer',
                          letterSpacing: 1.5,
                          backdropFilter: 'blur(8px)',
                          transition: 'all 0.2s',
                        }}
                      >
                        🔄 &nbsp;重新占卜
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
