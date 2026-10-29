'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const rawMouseX = useMotionValue(-100);
  const rawMouseY = useMotionValue(-100);

  // Fast, responsive spring config matching fluid portfolio inertia (nissh.info style)
  const springConfig = { damping: 26, stiffness: 450, mass: 0.35 };
  const cursorX = useSpring(rawMouseX, springConfig);
  const cursorY = useSpring(rawMouseY, springConfig);

  useEffect(() => {
    // Only run on desktop/fine-pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX.set(e.clientX);
      rawMouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Interactive elements -> Show 4-pointed diamond star sparkle (nissh.info interactive)
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.getAttribute('role') === 'button' ||
        target.classList?.contains('clay-btn') ||
        target.classList?.contains('clay-btn-primary') ||
        target.classList?.contains('clay-btn-danger') ||
        target.classList?.contains('cursor-pointer') ||
        target.closest?.('button, a, [role="button"], .clay-btn, .clay-btn-primary, [data-cursor="pointer"]') !== null;

      // 2. Text elements -> Show stylized outlined serif "T" typography badge (nissh.info text)
      const isText =
        !isInteractive &&
        (target.tagName === 'H1' ||
          target.tagName === 'H2' ||
          target.tagName === 'H3' ||
          target.tagName === 'H4' ||
          target.tagName === 'H5' ||
          target.tagName === 'H6' ||
          target.tagName === 'P' ||
          target.tagName === 'SPAN' ||
          target.tagName === 'BLOCKQUOTE' ||
          target.tagName === 'CODE' ||
          target.closest?.('h1, h2, h3, h4, h5, h6, p, blockquote, [data-cursor="text"]') !== null);

      if (isInteractive) {
        setCursorType('pointer');
      } else if (isText) {
        setCursorType('text');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [rawMouseX, rawMouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden">
      {/* ── Main Cursor Follower ───────────────────────────────────────── */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed flex items-center justify-center select-none"
      >
        {/* State 1: 4-Pointed Star Sparkle (Exact match from nissh.info interactive screenshot) */}
        {cursorType === 'pointer' && (
          <motion.div
            initial={{ scale: 0.4, rotate: -25, opacity: 0 }}
            animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 450 }}
            className="relative flex size-12 items-center justify-center filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_16px_rgba(0,242,254,0.45)]"
          >
            {/* Organic 4-Point Diamond Star SVG with concave arms */}
            <svg
              viewBox="0 0 100 100"
              className="size-11 fill-white text-slate-900 drop-shadow-md"
            >
              <path d="M 50 0 C 50 32, 68 50, 100 50 C 68 50, 50 68, 50 100 C 50 68, 32 50, 0 50 C 32 50, 50 32, 50 0 Z" />
            </svg>
            {/* Small center pointer dot */}
            <div className="absolute size-2 rounded-full bg-slate-900 shadow-sm dark:bg-sky-500" />
          </motion.div>
        )}

        {/* State 2: Stylized Outlined Serif 'T' Glyph (Exact match from nissh.info text screenshot) */}
        {cursorType === 'text' && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 450 }}
            className="flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
          >
            <svg
              width="24"
              height="28"
              viewBox="0 0 24 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="12"
                y="22"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="24"
                fontWeight="bold"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
                className="select-none"
              >
                T
              </text>
            </svg>
          </motion.div>
        )}

        {/* State 3: Fluid Halo Ring & Center Dot (Default State) */}
        {cursorType === 'default' && (
          <div className="relative flex items-center justify-center">
            {/* Outer soft breathing ring */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.3, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="size-7 rounded-full border border-sky-400/80 bg-sky-300/15 shadow-sm dark:border-cyan-400/70 dark:bg-cyan-400/10"
            />
            {/* Solid micro-dot */}
            <div className="absolute size-2 rounded-full bg-slate-800 shadow dark:bg-white" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
