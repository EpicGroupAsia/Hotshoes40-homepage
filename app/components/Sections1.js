"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { C, F, prefersReduced, Reveal, Section, Eyebrow, Headline, Lead } from "./Shared";
import { heroStatements, objectives, cases } from "../data/content";

export function Hero() {
  const list = heroStatements;
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const pausedRef = useRef(false);
  const discsRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setIdx(Math.floor(Math.random() * list.length));
  }, [list.length]);

  useEffect(() => {
    if (prefersReduced()) return;
    const scroller = document.getElementById('site-scroll');
    const el = discsRef.current;
    const video = videoRef.current;
    if (!scroller || !el) return;
    let raf = 0;
    const scrub = (scrollTop) => {
      el.style.transform = `translate3d(0, ${(scrollTop * 0.34).toFixed(1)}px, 0)`;
      if (video && video.duration) {
        const heroHeight = document.getElementById('top')?.offsetHeight || window.innerHeight;
        video.currentTime = Math.max(0, Math.min(1, scrollTop / heroHeight)) * video.duration;
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => scrub(scroller.scrollTop)); };
    // iOS ignores preload="auto" — force load via play/pause trick
    const ensureLoaded = () => {
      if (!video) return;
      const p = video.play();
      if (p) p.catch(() => {}).then(() => { video.pause(); video.currentTime = 0; });
    };
    scrub(0);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('touchstart', ensureLoaded, { once: true, passive: true });
    return () => { scroller.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (prefersReduced()) return;
    let swapT = 0;
    const tick = () => {
      if (pausedRef.current) return;
      setLeaving(true);
      swapT = setTimeout(() => {
        setIdx((i) => (i + 1) % list.length);
        setLeaving(false);
      }, 480);
    };
    const interval = setInterval(tick, 5200);
    return () => { clearInterval(interval); clearTimeout(swapT); };
  }, [list.length]);

  const cur = list[idx];
  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };
  const transStyle = {
    transition: 'opacity .48s var(--ease-entrance), transform .48s var(--ease-entrance)',
    opacity: leaving ? 0 : 1,
    transform: leaving ? 'translateY(-14px)' : 'translateY(0)',
  };

  return (
    <section id="top" data-screen-label="Hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '140px clamp(24px,6vw,96px) 80px', background: 'radial-gradient(120% 110% at 80% 30%, #100c2c 0%, var(--hs-void) 58%)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
        <div ref={discsRef} className="hs-hero-discs" style={{
          position: 'absolute', right: '-6%', top: '-25%', height: '140%', width: 'min(64vw, 980px)',
          display: 'flex', alignItems: 'center', willChange: 'transform',
        }}>
          <video ref={videoRef} src="/assets/backgrounds/discs-motion.mp4"
            muted playsInline preload="auto" x-webkit-airplay="deny"
            poster="/assets/backgrounds/circles-04.webp"
            style={{ width: '100%', height: 'auto', filter: 'saturate(1.05)', display: 'block' }}
          />
        </div>
        {/* Left fade: fully opaque past where text lives, smooth ramp into discs, then right-edge fade */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(7,6,15,1) 0%, rgba(7,6,15,1) 30%, rgba(7,6,15,0.55) 46%, rgba(7,6,15,0.08) 62%, rgba(7,6,15,0.7) 88%, rgba(7,6,15,1) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,6,15,0.7) 0%, rgba(7,6,15,0) 30%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,6,15,1) 0%, rgba(7,6,15,0.85) 18%, rgba(7,6,15,0) 40%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 3, maxWidth: 1360, margin: '0 auto', width: '100%' }}>
        <Reveal>
          <p style={{ margin: 0, fontFamily: F.mono, fontSize: 13, letterSpacing: '0.34em', textTransform: 'uppercase', color: C.cyan }}>
            HOTSHOES <span style={{ color: C.dim }}>·</span> Since 1986
          </p>
        </Reveal>

        <h1 style={{ margin: '28px 0 0', maxWidth: 1080 }}
          onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume} tabIndex={-1}>
          <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            40 Years of Moving Brands Forward
          </span>
          <span aria-hidden="true" style={{ display: 'block', fontFamily: F.display, fontWeight: 800, fontSize: 'clamp(34px,5vw,68px)', lineHeight: 1, letterSpacing: '-0.02em', color: C.muted, textTransform: 'uppercase' }}>
            40 Years Of
          </span>
          <span aria-hidden="true" className="hs-hero-rot" style={{ display: 'block', marginTop: 'clamp(8px,1.2vw,16px)', minHeight: '2.1em', fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(40px,8.2vw,118px)', lineHeight: 0.96, letterSpacing: '-0.035em', color: C.ink, textTransform: 'uppercase', ...transStyle }}>
            {cur.statement}
          </span>
        </h1>

        <p aria-hidden="true" className="hs-hero-copy" style={{ margin: '30px 0 0', maxWidth: 540, fontFamily: F.sans, fontSize: 'clamp(16px,1.5vw,19px)', lineHeight: 1.6, color: C.muted, ...transStyle }}>
          {cur.copy}
        </p>

        <Reveal delay={0.15}>
          <div style={{ marginTop: 38, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <a href="#contact" className="hs-btn-primary">Start a Project</a>
            <a href="#work" className="hs-btn-secondary">Explore Our Work</a>
          </div>
          <p style={{ margin: '40px 0 0', fontFamily: F.mono, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.dim }}>
            Brand Activation <span style={{ color: C.red }}>/</span> Events <span style={{ color: C.red }}>/</span> Creative <span style={{ color: C.red }}>/</span> Digital <span style={{ color: C.red }}>/</span> Data <span style={{ color: C.red }}>/</span> M.I.C.E.
          </p>
        </Reveal>
      </div>

      <div aria-hidden="true" style={{ position: 'absolute', left: 'clamp(24px,6vw,96px)', bottom: 30, zIndex: 3, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.2em', color: C.dim, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 26, height: 1, background: C.line }} />SCROLL
      </div>
    </section>
  );
}

export function BusinessObjectives() {
  const items = objectives;
  return (
    <Section id="objectives" bg="charcoal" screen="Business Objectives">
      <Reveal><Eyebrow>What do you need to move?</Eyebrow></Reveal>
      <Reveal delay={0.05} style={{ marginTop: 26 }}>
        <Headline>Every brand has a target.<br />We design the experience<br />that gets people there.</Headline>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: 26 }}>
        <Lead>From first impression to final action, Hotshoes builds experiences around what your brand needs to achieve — awareness, engagement, conversion, loyalty, or all of the above.</Lead>
      </Reveal>
      <div className="hs-obj-grid" style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
        {items.map((o, i) => <ObjectiveCard key={o.n} o={o} delay={(i % 2) * 0.08} />)}
      </div>
    </Section>
  );
}
function ObjectiveCard({ o, delay }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'clamp(28px,3vw,40px)', borderRadius: 'var(--radius-panel)', background: C.card, border: `1px solid ${h ? C.red : C.line}`, boxShadow: 'var(--shadow-panel)', transition: 'border-color .3s' }}>
        <span style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: '0.16em', color: C.cyan }}>{o.n}</span>
        <h3 style={{ margin: '20px 0 0', fontFamily: F.display, fontWeight: 800, fontSize: 'clamp(24px,2.4vw,32px)', lineHeight: 1.05, letterSpacing: '-0.015em', color: C.ink, textTransform: 'uppercase' }}>{o.title}</h3>
        <p style={{ margin: '16px 0 0', fontFamily: F.sans, fontWeight: 600, fontSize: 17, color: C.ink }}>{o.lede}</p>
        <p style={{ margin: '12px 0 0', fontFamily: F.sans, fontSize: 15.5, lineHeight: 1.6, color: C.muted }}>{o.body}</p>
        <a href="#contact" style={{ marginTop: 'auto', paddingTop: 26, display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', color: h ? C.redBright : C.ink, transition: 'color .3s' }}>
          {o.cta}<span style={{ color: C.red }}>→</span>
        </a>
      </div>
    </Reveal>
  );
}

const CASE_AUTOPLAY_MS = 7000;

export function SelectedCases() {
  const total = cases.length;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const pad = (n) => String(n).padStart(2, '0');

  const go = (next) => setIdx(((next % total) + total) % total);

  useEffect(() => {
    if (paused || prefersReduced() || total < 2) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % total), CASE_AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [idx, paused, total]);

  return (
    <Section id="work" bg="void" screen="Selected Work">
      <Reveal><Eyebrow>Selected Cases</Eyebrow></Reveal>
      <Reveal delay={0.05} style={{ marginTop: 26 }}>
        <Headline>Ideas are only powerful<br />when they work<br />in the real world.</Headline>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: 26 }}>
        <Lead>Our work brings together strategy, creativity, production, operations and digital thinking to create experiences that people can see, feel and act on.</Lead>
      </Reveal>
      <Reveal delay={0.14} style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <a href="#contact" className="hs-btn-primary">Start a Project Like This</a>
        <Link href="/work" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', color: C.ink, padding: '16px 28px', borderRadius: 'var(--radius-button)', border: `1px solid ${C.line}`, transition: 'border-color .3s' }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.ink)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.line)}>All Case Studies →</Link>
      </Reveal>

      <Reveal delay={0.12} style={{ marginTop: 64 }}>
        <div className="hs-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          role="group" aria-roledescription="carousel" aria-label="Selected case studies"
          tabIndex={0} onKeyDown={(e) => { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26, flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.dim }}>
              <span style={{ color: C.cyan }}>Case {pad(idx + 1)}</span> / {pad(total)}
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              <CarouselArrow dir="prev" onClick={() => go(idx - 1)} />
              <CarouselArrow dir="next" onClick={() => go(idx + 1)} />
            </div>
          </div>

          <div className="hs-carousel-stage" style={{ position: 'relative' }}>
            {cases.map((cs, i) => (
              <CaseSlide key={cs.n} cs={cs} total={total} active={i === idx} />
            ))}
          </div>

          <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {cases.map((cs, i) => (
              <button key={cs.n} onClick={() => go(i)} aria-label={`Go to ${cs.title}`} aria-current={i === idx}
                className="hs-carousel-dot"
                style={{ flex: '1 1 120px', minWidth: 92, textAlign: 'left', background: 'none', border: 0, cursor: 'pointer', padding: 0 }}>
                <span style={{ display: 'block', fontFamily: F.mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: i === idx ? C.ink : C.dim, transition: 'color .3s', marginBottom: 8 }}>
                  {pad(i + 1)} · {cs.client}
                </span>
                <span style={{ position: 'relative', display: 'block', height: 2, background: C.line, overflow: 'hidden' }}>
                  <span key={i === idx ? `run-${idx}` : `idle-${i}`}
                    className={i === idx ? 'hs-carousel-progress' : ''}
                    style={{
                      position: 'absolute', inset: 0, transformOrigin: 'left center',
                      background: i === idx ? C.red : (i < idx ? 'rgba(244,243,248,0.32)' : 'transparent'),
                      transform: i < idx ? 'scaleX(1)' : 'scaleX(0)',
                      animationDuration: (prefersReduced() || paused) ? '0s' : `${CASE_AUTOPLAY_MS}ms`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function CarouselArrow({ dir, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} aria-label={dir === 'next' ? 'Next case' : 'Previous case'}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 46, height: 46, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-button)', background: 'transparent', cursor: 'pointer',
        border: `1px solid ${h ? C.ink : C.line}`, color: h ? C.redBright : C.ink,
        fontFamily: F.mono, fontSize: 18, lineHeight: 1, transition: 'border-color .3s, color .3s' }}>
      {dir === 'next' ? '→' : '←'}
    </button>
  );
}

function CaseSlide({ cs, total, active }) {
  const [h, setH] = useState(false);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <Link href={`/case-study/${cs.n}`} aria-hidden={!active} tabIndex={active ? 0 : -1}
      aria-label={`View case study: ${cs.title}`}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className={`hs-case-slide ${active ? 'is-active' : ''}`}
      style={{
        position: active ? 'relative' : 'absolute', inset: 0, display: 'block', textDecoration: 'none',
        opacity: active ? 1 : 0, visibility: active ? 'visible' : 'hidden',
        transform: active ? 'none' : 'translateY(14px)',
        transition: 'opacity .7s var(--ease-entrance), transform .7s var(--ease-entrance)',
        pointerEvents: active ? 'auto' : 'none',
      }}>
      <div className="hs-case-media"
        style={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 'var(--radius-panel)', overflow: 'hidden', background: '#000', border: `1px solid ${h ? C.red : C.line}`, transition: 'border-color .3s' }}>
        <img src={cs.photo} alt={cs.title} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: h ? 'scale(1.04)' : 'scale(1)', transition: 'transform .9s var(--ease-entrance)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,6,15,0.9) 0%, rgba(7,6,15,0.34) 46%, rgba(7,6,15,0.04) 100%)' }} />

        <span style={{ position: 'absolute', left: 24, top: 22, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.ink, background: 'rgba(7,6,15,0.5)', backdropFilter: 'blur(6px)', border: `1px solid ${C.line}`, padding: '8px 13px', borderRadius: 8 }}>{cs.client}</span>
        <span style={{ position: 'absolute', right: 24, top: 22, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.16em', color: 'rgba(244,243,248,0.85)' }}>{cs.n} / {pad(total)}</span>

        <div style={{ position: 'absolute', left: 'clamp(24px,4vw,52px)', right: 'clamp(24px,4vw,52px)', bottom: 'clamp(24px,4vw,46px)' }}>
          <span style={{ display: 'block', fontFamily: F.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.cyan, marginBottom: 16 }}>{cs.category}</span>
          <h3 style={{ margin: 0, fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(30px,5vw,68px)', lineHeight: 0.98, letterSpacing: '-0.03em', color: C.ink, textTransform: 'uppercase', textWrap: 'balance', maxWidth: '16ch' }}>{cs.title}</h3>
          <span style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: h ? C.redBright : C.ink, transition: 'color .3s' }}>
            View Case Study <span style={{ color: C.red }}>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
