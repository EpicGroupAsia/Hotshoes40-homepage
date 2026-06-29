"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { nav } from "../data/content";

export const C = {
  void: 'var(--hs-void)', indigoDeep: 'var(--hs-indigo-deep)', card: 'var(--hs-card)',
  card2: 'var(--hs-card-2)', red: 'var(--hs-red)', redBright: 'var(--hs-red-bright)',
  cyan: 'var(--hs-cyan)', ink: 'var(--hs-light)', muted: 'var(--hs-text-muted)',
  dim: 'var(--hs-text-dim)', line: 'var(--hs-line)', lineSoft: 'var(--hs-line-soft)',
};
export const F = { display: 'var(--font-display)', sans: 'var(--font-sans)', mono: 'var(--font-mono)' };

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useReveal(opts = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (prefersReduced()) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => { if (es[0].isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: opts.threshold || 0.18, rootMargin: opts.rootMargin || '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

export function Reveal({ children, delay = 0, y = 28, style, as = 'div', ...rest }) {
  const [ref, shown] = useReveal();
  const Tag = as;
  return (
    <Tag ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? 'none' : `translateY(${y}px)`,
      transition: `opacity .8s var(--ease-entrance) ${delay}s, transform .8s var(--ease-entrance) ${delay}s`,
      ...style,
    }} {...rest}>{children}</Tag>
  );
}

export function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const scroller = document.getElementById('site-scroll');
    if (!scroller) return;
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = scroller.clientHeight;
      const total = r.height + vh;
      const prog = (vh - r.top) / total;
      setP(Math.max(0, Math.min(1, prog)));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { scroller.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return p;
}

/* Decorative radial-glow panel — fallback for sections with no background photo. */
export function GlowBg({ tint = 'radial-gradient(120% 120% at 70% 20%, rgba(110,43,232,0.35), transparent 60%)', scrim = 'left' }) {
  const scrims = {
    left: 'linear-gradient(90deg, rgba(7,6,15,0.97) 0%, rgba(7,6,15,0.72) 40%, rgba(7,6,15,0.18) 74%, rgba(7,6,15,0.5) 100%)',
    bottom: 'linear-gradient(0deg, rgba(7,6,15,0.97) 0%, rgba(7,6,15,0.55) 42%, rgba(7,6,15,0.12) 100%)',
    none: 'none',
  };
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: tint }} />
      {scrim !== 'none' && <div style={{ position: 'absolute', inset: 0, background: scrims[scrim] }} />}
    </div>
  );
}

/* Photographic background disc with scrim — used behind section copy. */
export function ParallaxBg({ src, opacity = 1, scrim = 'left', align = 'center', speed = 0.3 }) {
  const imgRef = useRef(null);
  const scrims = {
    left: 'linear-gradient(90deg, rgba(7,6,15,0.97) 0%, rgba(7,6,15,0.72) 40%, rgba(7,6,15,0.18) 74%, rgba(7,6,15,0.5) 100%)',
    bottom: 'linear-gradient(0deg, rgba(7,6,15,0.97) 0%, rgba(7,6,15,0.55) 42%, rgba(7,6,15,0.12) 100%)',
    none: 'none',
  };
  useEffect(() => {
    if (prefersReduced()) return;
    const scroller = document.getElementById('site-scroll');
    const el = imgRef.current;
    if (!scroller || !el) return;
    let raf = 0;
    const update = () => {
      const rect = el.parentElement?.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset = (progress - 0.5) * rect.height * speed;
      el.style.transform = `scale(1.35) translateY(${offset.toFixed(1)}px)`;
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => { scroller.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <img ref={imgRef} src={src} alt="" className="hs-parallax-img" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: align, opacity, transform: 'scale(1.35)',
        willChange: 'transform',
      }} />
      {scrim !== 'none' && <div style={{ position: 'absolute', inset: 0, background: scrims[scrim] }} />}
    </div>
  );
}

export function Section({ id, label, bg, style, children, pad = '120px clamp(24px,6vw,96px)', screen }) {
  const bgStyle = bg === 'indigo'
    ? { background: 'radial-gradient(130% 120% at 70% 0%, var(--hs-indigo-deep), var(--hs-void) 60%)' }
    : bg === 'charcoal'
      ? { background: '#0A0814' }
      : { background: 'var(--hs-void)' };
  return (
    <section id={id} data-screen-label={screen || id} style={{ position: 'relative', overflow: 'hidden', padding: pad, ...bgStyle, ...style }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative', zIndex: 2 }}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, tone = 'cyan' }) {
  return (
    <p style={{ display: 'inline-flex', alignItems: 'center', gap: 12, margin: 0,
      fontFamily: F.mono, fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase',
      color: tone === 'red' ? C.redBright : C.cyan }}>
      <span style={{ width: 7, height: 7, background: tone === 'red' ? C.red : C.cyan }} />
      {children}
    </p>
  );
}

export function Headline({ children, size = 'clamp(38px,5.4vw,74px)', style }) {
  return (
    <h2 style={{ margin: 0, fontFamily: F.display, fontWeight: 900, fontSize: size,
      lineHeight: 1.0, letterSpacing: '-0.025em', color: C.ink, textWrap: 'balance', ...style }}>
      {children}
    </h2>
  );
}

export function Lead({ children, style }) {
  return <p style={{ margin: 0, maxWidth: 620, fontFamily: F.sans, fontSize: 'clamp(16px,1.4vw,19px)', lineHeight: 1.6, color: C.muted, ...style }}>{children}</p>;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const el = document.getElementById('site-scroll');
    const onScroll = () => setScrolled((el ? el.scrollTop : window.scrollY) > 40);
    const target = el || window;
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header style={{
      position: 'fixed', insetInline: 0, top: 0, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: scrolled ? '14px clamp(20px,5vw,56px)' : '24px clamp(20px,5vw,56px)',
      background: scrolled ? 'rgba(7,6,15,0.82)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: `1px solid ${scrolled ? C.line : 'transparent'}`,
      transition: 'padding .3s, background .3s, border-color .3s',
    }}>
      <a href="#top" aria-label="Hotshoes Asia home"><img src="/assets/logo-white.png" alt="Hotshoes Asia" style={{ height: 26, width: 'auto', display: 'block' }} /></a>
      <nav className="hs-nav" style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
        {nav.map((item) => (
          <a key={item.href} href={item.href}
            style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: 'rgba(244,243,248,0.78)', transition: 'color .25s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,243,248,0.78)')}>
            <span style={{ color: C.cyan, marginRight: 6 }}>{item.n}</span>{item.label}
          </a>
        ))}
        <a href="#contact" style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff', background: C.red, padding: '10px 18px', borderRadius: 'var(--radius-button)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.red)}>Start a Project</a>
      </nav>
      <button className="hs-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(!open)}
        style={{ display: 'none', flexDirection: 'column', gap: 6, background: 'none', border: 0, cursor: 'pointer', padding: 6, position: 'relative', zIndex: 80 }}>
        <span style={{ width: 26, height: 2, background: C.ink, transition: 'transform .3s', transform: open ? 'translateY(8px) rotate(45deg)' : 'none' }} />
        <span style={{ width: 26, height: 2, background: C.ink, opacity: open ? 0 : 1, transition: 'opacity .2s' }} />
        <span style={{ width: 26, height: 2, background: C.ink, transition: 'transform .3s', transform: open ? 'translateY(-8px) rotate(-45deg)' : 'none' }} />
      </button>
      {mounted && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 1090, background: 'rgba(4,3,10,0.62)', opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden', transition: 'opacity .35s ease, visibility .35s', pointerEvents: open ? 'auto' : 'none' }} onClick={() => setOpen(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-label="Menu" style={{
            position: 'fixed', inset: '0 0 0 auto', width: 'min(82vw,360px)', zIndex: 1100,
            background: '#0A0814', borderLeft: `1px solid ${C.line}`, boxShadow: '-30px 0 60px rgba(0,0,0,0.5)',
            transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .4s var(--ease-entrance)',
            display: 'flex', flexDirection: 'column', gap: 8, padding: '96px 28px 28px',
          }}>
            <button aria-label="Close menu" onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: 26, right: 24, width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: `1px solid ${C.line}`, borderRadius: 'var(--radius-button)', color: C.ink, cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}
                style={{ fontFamily: F.display, fontWeight: 700, fontSize: 26, textTransform: 'uppercase', textDecoration: 'none', color: C.ink, padding: '10px 0', borderBottom: `1px solid ${C.line}` }}>
                <span style={{ fontFamily: F.mono, fontSize: 13, color: C.cyan, marginRight: 12 }}>{item.n}</span>{item.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} style={{ marginTop: 16, textAlign: 'center', fontFamily: F.mono, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff', background: C.red, padding: '16px', borderRadius: 'var(--radius-button)' }}>Start a Project</a>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}

const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/HotshoesAsia',
    path: 'M14 8.5h2V6h-2c-1.66 0-3 1.34-3 3v1.5H9V13h2v5h2.5v-5H15.5L16 10.5h-2.5V9.4c0-.5.4-.9.9-.9z' },
  { label: 'Instagram', href: 'https://www.instagram.com/hotshoesasia/',
    path: 'M8 3.5h8A4.5 4.5 0 0 1 20.5 8v8a4.5 4.5 0 0 1-4.5 4.5H8A4.5 4.5 0 0 1 3.5 16V8A4.5 4.5 0 0 1 8 3.5zm0 1.6A2.9 2.9 0 0 0 5.1 8v8A2.9 2.9 0 0 0 8 18.9h8a2.9 2.9 0 0 0 2.9-2.9V8A2.9 2.9 0 0 0 16 5.1H8zm8.6 1.1a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM12 7.6a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8zm0 1.6a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/hotshoes/',
    path: 'M6.2 4.4a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM4.7 9.2h3V20h-3V9.2zM9.8 9.2h2.87v1.48h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V20h-3v-4.78c0-1.14-.02-2.6-1.59-2.6-1.59 0-1.83 1.24-1.83 2.52V20h-3V9.2z' },
];

export function SiteFooter() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', borderTop: `1px solid ${C.line}`, background: C.void, padding: '88px clamp(24px,6vw,96px) 40px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr) minmax(0,1.1fr)', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }} className="hs-footer-grid">
          <div>
            <p style={{ margin: 0, fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(28px,3.4vw,42px)', lineHeight: 1.04, letterSpacing: '-0.02em', color: C.ink, textTransform: 'uppercase' }}>
              Creating experiences.<br />Building connections.<br /><span style={{ color: C.red }}>Moving brands forward<br />since 1986.</span>
            </p>
            <a href="#contact" style={{ display: 'inline-flex', marginTop: 28, fontFamily: F.mono, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff', background: C.red, padding: '14px 24px', borderRadius: 'var(--radius-button)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.red)}>Got a project? Let&rsquo;s talk →</a>
            <div style={{ marginTop: 30, display: 'flex', gap: 12 }}>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}
                  style={{ width: 42, height: 42, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-button)', border: `1px solid ${C.line}`, color: 'rgba(244,243,248,0.82)', transition: 'border-color .3s, color .3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.ink; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = 'rgba(244,243,248,0.82)'; }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 18px', fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.dim }}>Navigate</p>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
              {nav.map((l) => (
                <li key={l.label}><a href={l.href} style={{ fontFamily: F.sans, fontSize: 15, color: 'rgba(244,243,248,0.78)', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,243,248,0.78)')}>{l.label}</a></li>
              ))}
              <li><button onClick={() => setShowPrivacy(true)} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', fontFamily: F.sans, fontSize: 15, color: 'rgba(244,243,248,0.78)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,243,248,0.78)')}>Privacy Policy &amp; PDPA</button></li>
            </ul>
          </div>
          <div>
            <p style={{ margin: '0 0 18px', fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.dim }}>Hotshoes Asia</p>
            <p style={{ margin: 0, fontFamily: F.sans, fontSize: 15, lineHeight: 1.7, color: C.muted }}>
              The Hot Shoe Show &amp; Co Sdn Bhd<br />Wisma EPIC, Jalan SS 25/22,<br />Taman Mayang, 47301 Petaling Jaya,<br />Selangor, Malaysia
            </p>
            <p style={{ margin: '18px 0 0', fontFamily: F.mono, fontSize: 13, letterSpacing: '0.04em', lineHeight: 1.9, color: C.muted }}>
              <a href="tel:+60378038898" style={{ color: C.ink, textDecoration: 'none' }}>+603 7803 8898</a><br />
              <a href="mailto:enquiry@hotshoes.asia" style={{ color: 'rgba(244,243,248,0.82)', textDecoration: 'none' }}>enquiry@hotshoes.asia</a>
            </p>
          </div>
        </div>
        <div style={{ marginTop: 64, paddingTop: 28, borderTop: `1px solid ${C.line}`, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <img src="/assets/logo-white.png" alt="Hotshoes Asia" style={{ height: 22, width: 'auto', opacity: 0.85 }} />
          <p style={{ margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.12em', color: C.dim }}>© 1986 — 2026 HOTSHOES ASIA · ALL RIGHTS RESERVED</p>
        </div>
      </div>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </footer>
  );
}

function PrivacyModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  const H = (t) => <h3 style={{ margin: '28px 0 10px', fontFamily: F.mono, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.cyan }}>{t}</h3>;
  const P = (c) => <p style={{ margin: '0 0 12px', fontFamily: F.sans, fontSize: 15, lineHeight: 1.65, color: C.muted }}>{c}</p>;
  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label="Privacy Policy and PDPA Notice"
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,48px)', background: 'rgba(7,6,15,0.72)', backdropFilter: 'blur(8px)', animation: 'hs-modal-fade .3s ease both' }}>
      <div onClick={(e) => e.stopPropagation()} className="hs-modal-card"
        style={{ position: 'relative', width: 'min(760px,100%)', maxHeight: '86vh', overflow: 'auto', background: C.card, border: `1px solid ${C.line}`, borderRadius: 'var(--radius-panel)', padding: 'clamp(28px,4vw,52px)' }}>
        <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.red }} />
        <button onClick={onClose} aria-label="Close"
          style={{ position: 'absolute', top: 18, right: 18, width: 40, height: 40, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: `1px solid ${C.line}`, borderRadius: 'var(--radius-button)', color: C.ink, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.red)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.line)}>×</button>
        <p style={{ margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.dim }}>Hotshoes Asia</p>
        <h2 style={{ margin: '12px 0 0', fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(26px,3.4vw,38px)', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase', color: C.ink }}>Privacy Policy &amp; PDPA Notice</h2>
        {P('The Hot Shoe Show & Co Sdn Bhd ("Hotshoes", "we", "us") is committed to protecting the privacy and personal data of everyone we work with. This notice explains how we collect, use and safeguard personal data in accordance with the Personal Data Protection Act 2010 (PDPA) of Malaysia.')}
        {H('Personal Data We Collect')}
        {P('We may collect your name, company, job title, email address, phone number and any information you choose to provide through our enquiry forms, events, activations or business engagements.')}
        {H('How We Use Your Data')}
        {P('Personal data is used to respond to enquiries, deliver and manage projects and events, fulfil contractual and operational obligations, and — where you have consented — to share relevant updates about our work. We do not sell your personal data.')}
        {H('Disclosure')}
        {P('We may share personal data with trusted partners, suppliers and authorities strictly where necessary to deliver our services, meet event and compliance requirements, or as required by law.')}
        {H('Data Protection')}
        {P('We apply appropriate organisational and technical measures, consistent with our ISO 9001 and OHSAS 18001 / ISO 45001 management systems, to keep personal data secure and retained only for as long as necessary.')}
        {H('Your Rights')}
        {P('Under the PDPA you may request access to, correction of, or withdrawal of consent for the processing of your personal data. To exercise these rights, contact us at enquiry@hotshoes.asia or +603 7803 8898.')}
        {H('Contact')}
        {P('The Hot Shoe Show & Co Sdn Bhd — Wisma EPIC, Jalan SS 25/22, Taman Mayang, 47301 Petaling Jaya, Selangor, Malaysia.')}
        <p style={{ margin: '20px 0 0', fontFamily: F.mono, fontSize: 11, letterSpacing: '0.08em', color: C.dim }}>By continuing to use this site and our services, you consent to the collection and use of your personal data as described above.</p>
        <button onClick={onClose} style={{ marginTop: 26, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: C.red, border: 0, padding: '14px 28px', borderRadius: 'var(--radius-button)', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')} onMouseLeave={(e) => (e.currentTarget.style.background = C.red)}>I understand</button>
      </div>
    </div>
  );
}
