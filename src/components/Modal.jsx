import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Icon } from './Icons.jsx';

export default function Modal({ children, titleId = 'modal-title', onClose, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return <motion.dialog ref={ref} className={`modal ${className}`} aria-labelledby={titleId}
    initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduce ? 0 : 12, scale: reduce ? 1 : 0.98 }}
    transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = ref.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}
  ><button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button>{children}</motion.dialog>;
}
