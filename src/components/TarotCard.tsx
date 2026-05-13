import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TarotCard as TarotCardType } from '../data/cards';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  positionLabel: string;
  index: number;
  isFlipped: boolean;
  canFlip: boolean;
  onFlip: () => void;
}

// 暖色系：琥珀金、玫瑰粉、珊瑚橙
const POSITION_COLORS = ['#D4956A', '#C47E8C', '#B8935A'];
const POSITION_GLOW = ['rgba(212,149,106,0.35)', 'rgba(196,126,140,0.35)', 'rgba(184,147,90,0.35)'];

export function TarotCardComponent({
  card, isReversed, positionLabel, index, isFlipped, canFlip, onFlip
}: TarotCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const color = POSITION_COLORS[index] ?? '#D4956A';
  const glow = POSITION_GLOW[index] ?? 'rgba(212,149,106,0.35)';

  const handleClick = () => {
    if (!canFlip || isFlipped || isAnimating) return;
    setIsAnimating(true);
    onFlip();
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.18, duration: 0.55, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
    >
      {/* Position Label */}
      <div style={{
        fontSize: 11, color: color, letterSpacing: 4,
        fontWeight: 700, textTransform: 'uppercase',
        padding: '3px 10px',
        background: `${color}18`,
        border: `1px solid ${color}44`,
        borderRadius: 20,
      }}>
        {positionLabel}
      </div>

      {/* Card */}
      <motion.div
        animate={canFlip && !isFlipped ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleClick}
        style={{
          width: 128, height: 210,
          perspective: 900,
          cursor: canFlip && !isFlipped ? 'pointer' : 'default',
          position: 'relative',
        }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          style={{
            width: '100%', height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {/* ── Card Back ── */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: 14,
            background: 'linear-gradient(160deg, #3D2010 0%, #2C1810 45%, #3A1E0E 100%)',
            border: `1px solid ${color}55`,
            boxShadow: canFlip && !isFlipped
              ? `0 0 24px ${glow}, 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,200,150,0.1)`
              : `0 10px 40px rgba(0,0,0,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8,
            transition: 'box-shadow 0.3s ease',
            overflow: 'hidden',
          }}>
            {/* Decorative corners */}
            {['top-left','top-right','bottom-left','bottom-right'].map(pos => (
              <div key={pos} style={{
                position: 'absolute',
                [pos.includes('top') ? 'top' : 'bottom']: 10,
                [pos.includes('left') ? 'left' : 'right']: 10,
                width: 16, height: 16,
                borderTop: pos.includes('top') ? `1px solid ${color}66` : 'none',
                borderBottom: pos.includes('bottom') ? `1px solid ${color}66` : 'none',
                borderLeft: pos.includes('left') ? `1px solid ${color}66` : 'none',
                borderRight: pos.includes('right') ? `1px solid ${color}66` : 'none',
              }} />
            ))}
            {/* Center ornament */}
            <div style={{
              width: 72, height: 72,
              border: `1px solid ${color}44`,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
            }}>
              <div style={{
                width: 50, height: 50,
                border: `1px solid ${color}33`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 20, opacity: 0.7 }}>✦</span>
              </div>
            </div>
            {canFlip && !isFlipped && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: 10, color: color, letterSpacing: 1.5, marginTop: 4 }}
              >
                点击翻牌
              </motion.div>
            )}
          </div>

          {/* ── Card Front ── */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 14,
            background: isReversed
              ? 'linear-gradient(160deg, #3A1820 0%, #2A1215 60%, #351520 100%)'
              : 'linear-gradient(160deg, #3A2510 0%, #2C1810 60%, #352010 100%)',
            border: `1px solid ${color}77`,
            boxShadow: `0 0 30px ${glow}, 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,200,150,0.08)`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 10px',
            overflow: 'hidden',
          }}>
            {/* Reversed badge */}
            {isReversed && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                background: 'rgba(180, 60, 60, 0.85)',
                color: '#ffc0c0',
                fontSize: 9, padding: '2px 6px',
                borderRadius: 4, letterSpacing: 1, fontWeight: 700,
                zIndex: 2, backdropFilter: 'blur(4px)',
              }}>逆位</div>
            )}

            {/* Content wrapper — rotated if reversed */}
            <div style={{
              transform: isReversed ? 'rotate(180deg)' : 'none',
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{
                fontSize: 10, color: `${color}88`,
                letterSpacing: 2, fontVariantNumeric: 'tabular-nums',
              }}>
                {String(card.id).padStart(2, '0')}
              </div>

              {/* Symbol with glow */}
              <div style={{
                fontSize: 52, lineHeight: 1,
                filter: `drop-shadow(0 0 16px ${color}99)`,
              }}>
                {card.symbol}
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 15, color: color, fontWeight: 700,
                  letterSpacing: 1.5, marginBottom: 3,
                }}>
                  {card.name_zh}
                </div>
                <div style={{ fontSize: 9, color: `${color}66`, letterSpacing: 0.5 }}>
                  {card.name_en}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Keywords (after flip) */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{ textAlign: 'center', maxWidth: 130 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {(isReversed ? card.reversed_keywords : card.upright_keywords).slice(0, 2).map(kw => (
              <span key={kw} style={{
                fontSize: 9.5, padding: '2px 8px',
                background: `${color}18`,
                color: color,
                borderRadius: 10,
                border: `1px solid ${color}44`,
                letterSpacing: 0.5,
              }}>
                {kw}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
