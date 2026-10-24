import React from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'motion/react';
import { Icon } from './Icons.jsx';

export const ease = [0.22, 1, 0.36, 1];

export function Reveal({ children, className = '', delay = 0, direction = 'up', ...props }) {
  const reduce = useReducedMotion();
  return <motion.div
    className={className}
    initial={reduce ? false : { opacity: 0, y: direction === 'up' ? 34 : 0, x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0, filter: 'blur(5px)' }}
    whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, amount: 0.14, margin: '0px 0px -24px 0px' }}
    transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease }}
    {...props}
  >{children}</motion.div>;
}

export function TitleReveal({ lines, className = '', as = 'h2', hero = false }) {
  const reduce = useReducedMotion();
  const Tag = as;
  return <Tag className={`reveal-title ${className}`} aria-label={lines.map(line => typeof line === 'string' ? line : line.text).join(' ')}>
    {lines.map((line, index) => {
      const text = typeof line === 'string' ? line : line.text;
      const accent = typeof line !== 'string' && line.accent;
      return <span className="line-mask" key={text} aria-hidden="true"><motion.span
        className={accent ? 'accent-text' : ''}
        initial={reduce ? false : { y: '112%', rotate: 2, opacity: 0 }}
        {...(hero ? { animate: { y: 0, rotate: 0, opacity: 1 } } : { whileInView: { y: 0, rotate: 0, opacity: 1 }, viewport: { once: true, amount: 0.2 } })}
        transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : (hero ? 0.16 : 0) + index * 0.12, ease }}
      >{text}</motion.span></span>;
    })}
  </Tag>;
}

export function Button({ children, onClick, variant = 'primary', arrow = 'arrow-up', className = '', magnetic = false, type = 'button', ...props }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 17 });
  const springY = useSpring(y, { stiffness: 220, damping: 17 });
  function move(event) {
    if (!magnetic || reduce || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.06);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.15);
  }
  return <motion.button type={type} className={`button button-${variant} ${className}`} onClick={onClick}
    style={magnetic && !reduce ? { x: springX, y: springY } : undefined}
    onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }}
    whileHover={reduce ? undefined : { scale: 1.025 }} whileTap={reduce ? undefined : { scale: 0.975 }}
    transition={{ type: 'spring', stiffness: 340, damping: 24 }} {...props}
  ><span>{children}</span>{arrow && <span className="button-arrow"><Icon name={arrow} /></span>}</motion.button>;
}

export function Eyebrow({ children, light = false }) {
  return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-mark" />{children}</div>;
}
