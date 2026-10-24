import React from 'react';

export function Icon({name, className = '', ...props}) { return <svg className={`icon ${className}`} aria-hidden="true" {...props}><use href={`#i-${name}`} /></svg>; }

export function Icons() { return (
  <svg className="svg-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
    <symbol id="i-arrow-up" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></symbol>
    <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></symbol>
    <symbol id="i-paw" viewBox="0 0 32 32"><ellipse cx="7" cy="12" rx="3.4" ry="4.5" transform="rotate(-28 7 12)" fill="currentColor" stroke="none"/><ellipse cx="13" cy="6.7" rx="3.2" ry="4.5" transform="rotate(-10 13 6.7)" fill="currentColor" stroke="none"/><ellipse cx="21" cy="7.5" rx="3.3" ry="4.5" transform="rotate(16 21 7.5)" fill="currentColor" stroke="none"/><ellipse cx="26" cy="14" rx="3" ry="4.3" transform="rotate(30 26 14)" fill="currentColor" stroke="none"/><path d="M8 23c0-3 4.8-9 8.5-9S26 21 26 24s-3 5-6 3c-2-1.4-4-1.4-6 0-3 2-6-.6-6-4Z" fill="currentColor" stroke="none"/></symbol>
    <symbol id="i-cross" viewBox="0 0 24 24"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/></symbol>
    <symbol id="i-stethoscope" viewBox="0 0 48 48"><path d="M9 7v13a11 11 0 0 0 22 0V7M9 9H5m26 0h4M20 31v4a9 9 0 0 0 18 0v-6"/><circle cx="38" cy="24" r="5"/><path d="M9 5v7m22-7v7"/></symbol>
    <symbol id="i-shield" viewBox="0 0 48 48"><path d="M24 4 7 11v12c0 10 17 20 17 20s17-10 17-20V11L24 4Z"/><path d="m15 23 6 6 12-13"/></symbol>
    <symbol id="i-tooth" viewBox="0 0 48 48"><path d="M24 8c-7-6-17-3-17 7 0 5 3 10 4 15 1 6 2 12 6 12 4 0 2-13 7-13s3 13 7 13c4 0 5-6 6-12 1-5 4-10 4-15 0-10-10-13-17-7Z"/><path d="M24 8c2 1 4 2 7 2"/></symbol>
    <symbol id="i-pulse" viewBox="0 0 48 48"><path d="M4 25h11l5-15 9 30 5-15h10"/><path d="M8 15V7h8m24 8V7h-8M8 33v8h8m24-8v8h-8"/></symbol>
    <symbol id="i-flower" viewBox="0 0 48 48"><path d="M24 14C14-4 4 12 14 20-7 18 4 39 17 30c-8 20 15 20 14 3 15 12 25-8 8-13 12-16-10-23-15-6Z"/><circle cx="24" cy="24" r="5"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
    <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h2m4 0h2"/></symbol>
    <symbol id="i-sparkle" viewBox="0 0 24 24"><path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/></symbol>
    <symbol id="i-dog" viewBox="0 0 32 32"><path d="m11 7-5-3-4 9 5 4 2-5m12-5 5-3 4 9-5 4-2-5M9 9c3-4 11-4 14 0v13c-2 8-12 8-14 0V9Z"/><path d="M12 16h.1m8-.1h.1M14 21h4l-2 2-2-2Zm2 2v3"/></symbol>
    <symbol id="i-cat" viewBox="0 0 32 32"><path d="m7 11-1-8 9 6h2l9-6-1 8c8 16-26 23-18 0Z"/><path d="M11 16h.1m10-.1h.1M14 21h4l-2 2-2-2ZM7 21l-5-1m5 4-5 2m23-5 5-1m-5 4 5 2"/></symbol>
    <symbol id="i-rabbit" viewBox="0 0 32 32"><path d="M12 15C4-3 15-3 15 14m3 0C17-4 29-3 21 16c11 11-16 20-15 6 0-4 3-6 6-7Z"/><path d="M12 21h.1m8-.1h.1m-6 4h3"/></symbol>
  </svg>
); }
