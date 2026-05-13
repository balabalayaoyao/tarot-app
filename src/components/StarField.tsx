import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  twinkleOffset: number;
  color: string;
}

// 暖色系粒子：金色、玫瑰金、珊瑚
const WARM_COLORS = [
  'rgba(255, 215, 140,',
  'rgba(255, 190, 120,',
  'rgba(240, 180, 160,',
  'rgba(255, 200, 100,',
  'rgba(220, 170, 130,',
];

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 7000);
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.004 + 0.002,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: WARM_COLORS[Math.floor(Math.random() * WARM_COLORS.length)],
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        const twinkle = Math.sin(time * p.speed * 10 + p.twinkleOffset) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${(p.opacity * twinkle).toFixed(2)})`;
        ctx.fill();
      });
      frameRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}
