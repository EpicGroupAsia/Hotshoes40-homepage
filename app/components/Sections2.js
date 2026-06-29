"use client";
import { useState, useEffect, useRef } from "react";
import { C, F, prefersReduced, Reveal, Section, Eyebrow, Headline, Lead } from "./Shared";
import { journey, lenses, capabilities, delivery, certifications, recordFeature } from "../data/content";

export function CircularJourney() {
  const stages = journey;
  const sectionRef = useRef(null);
  const [prog, setProg] = useState(0);
  const [manual, setManual] = useState(null);

  useEffect(() => {
    const scroller = document.getElementById('site-scroll');
    if (!scroller) return;
    let raf = 0;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = scroller.clientHeight;
      const range = r.height - vh;
      const p = range > 0 ? Math.max(0, Math.min(1, -r.top / range)) : 0;
      setProg(p);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { scroller.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const draw = Math.min(3.999, prog * 4.4);
  const scrollActive = Math.min(3, Math.floor(draw));
  const active = manual != null ? manual : scrollActive;

  const VB = 460, cx = 230, cy = 230, R = 158;
  const circ = 2 * Math.PI * R;
  const drawFrac = manual != null ? (active + 0.85) / 4 : Math.min(1, prog * 1.12);
  const nodeAngle = (i) => (-90 + i * 90) * (Math.PI / 180);
  const nodePos = (i) => ({ x: cx + R * Math.cos(nodeAngle(i)), y: cy + R * Math.sin(nodeAngle(i)) });

  return (
    <section ref={sectionRef} id="journey" data-screen-label="Customer Journey" style={{ position: 'relative', background: 'radial-gradient(120% 100% at 50% 0%, #0c0a24, var(--hs-void) 62%)' }} className="hs-journey-sec">
      <div className="hs-journey-pin" style={{ position: 'sticky', top: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '110px clamp(24px,6vw,96px)' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', width: '100%' }}>
          <Eyebrow>The Hotshoes Method</Eyebrow>
          <div className="hs-journey-grid" style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>
            <div>
              <Headline size="clamp(30px,3.6vw,54px)">Not just events.<br />Experiences built<br />around movement.</Headline>
              <Lead style={{ marginTop: 22 }}>A strong brand experience should do more than look good. It should move people through a journey — from awareness to engagement, from conversion to remarketing.</Lead>
              <div style={{ marginTop: 36, minHeight: 188 }}>
                {stages.map((s, i) => (
                  <div key={s.n} style={{ display: active === i ? 'block' : 'none' }}>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: 14 }}>
                      <span style={{ fontFamily: F.mono, fontSize: 13, color: C.cyan }}>{s.n}</span>
                      <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(26px,3vw,40px)', letterSpacing: '-0.02em', color: C.red, textTransform: 'uppercase' }}>{s.stage}</span>
                    </p>
                    <p style={{ margin: '6px 0 0 30px', fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.dim }}>{s.label}</p>
                    <p style={{ margin: '18px 0 0', maxWidth: 460, fontFamily: F.sans, fontSize: 'clamp(15px,1.4vw,18px)', lineHeight: 1.6, color: C.muted }}>{s.copy}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 28, display: 'flex', gap: 8 }}>
                {stages.map((s, i) => (
                  <button key={s.n} aria-label={s.stage} onClick={() => setManual(i)}
                    style={{ flex: 1, height: 4, border: 0, padding: 0, cursor: 'pointer', borderRadius: 2, background: active === i ? C.red : C.line, transition: 'background .3s' }} />
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <svg viewBox={`0 0 ${VB} ${VB}`} className="hs-journey-svg" style={{ width: 'min(46vw, 480px)', maxWidth: '100%', overflow: 'visible' }} aria-hidden="true">
                <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.line} strokeWidth="1.5" />
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="url(#hsArc)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - drawFrac)}
                  transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: prefersReduced() ? 'none' : 'stroke-dashoffset .25s linear' }} />
                <defs>
                  <linearGradient id="hsArc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#1FD0F0" /><stop offset="0.5" stopColor="#6E2BE8" /><stop offset="1" stopColor="#ED1C2E" />
                  </linearGradient>
                </defs>
                {stages.map((s, i) => {
                  const p = nodePos(i); const on = active === i;
                  return (
                    <g key={s.n} onClick={() => setManual(i)} style={{ cursor: 'pointer' }}>
                      <circle cx={p.x} cy={p.y} r={on ? 30 : 22} fill={on ? C.red : '#16123B'} stroke={on ? C.red : C.line} strokeWidth="1.5"
                        style={{ transition: 'all .35s var(--ease-entrance)', filter: on ? 'drop-shadow(0 0 22px rgba(237,28,46,0.6))' : 'none' }} />
                      <text x={p.x} y={p.y + 5} textAnchor="middle" fill={on ? '#fff' : C.muted} style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500 }}>{s.n}</text>
                      <text x={p.x} y={i === 2 ? p.y + 52 : (i === 0 ? p.y - 38 : p.y)}
                        dx={i === 1 ? 40 : i === 3 ? -40 : 0} textAnchor={i === 1 ? 'start' : i === 3 ? 'end' : 'middle'}
                        fill={on ? C.ink : C.dim} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.stage}</text>
                    </g>
                  );
                })}
                <text x={cx} y={cy - 8} textAnchor="middle" fill={C.muted} style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, letterSpacing: '-0.01em' }}>From first spark</text>
                <text x={cx} y={cy + 16} textAnchor="middle" fill={C.ink} style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 17, letterSpacing: '-0.01em' }}>to lasting movement.</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="hs-journey-mobile" style={{ display: 'none', padding: '90px clamp(24px,6vw,40px)' }}>
        <Eyebrow>The Hotshoes Method</Eyebrow>
        <Headline size="clamp(30px,8vw,44px)" style={{ marginTop: 20 }}>Experiences built around movement.</Headline>
        <div style={{ marginTop: 28, display: 'grid', gap: 14 }}>
          {stages.map((s) => (
            <div key={s.n} style={{ padding: 22, borderRadius: 'var(--radius-panel)', background: C.card, border: `1px solid ${C.line}`, borderLeft: `3px solid ${C.red}` }}>
              <p style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: F.mono, fontSize: 12, color: C.cyan }}>{s.n}</span>
                <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 24, letterSpacing: '-0.02em', color: C.ink, textTransform: 'uppercase' }}>{s.stage}</span>
              </p>
              <p style={{ margin: '4px 0 0 26px', fontFamily: F.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.dim }}>{s.label}</p>
              <p style={{ margin: '12px 0 0', fontFamily: F.sans, fontSize: 15, lineHeight: 1.6, color: C.muted }}>{s.copy}</p>
            </div>
          ))}
          <p style={{ margin: '8px 0 0', textAlign: 'center', fontFamily: F.display, fontWeight: 900, fontSize: 18, color: C.red, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>↻ From first spark to lasting movement.</p>
        </div>
      </div>
    </section>
  );
}

const LENS_TINT = ['#1FD0F0', '#2E5BFF', '#6E2BE8', '#C026D3', '#ED1C2E'];
export function FortyYearsValue() {
  const [active, setActive] = useState(0);
  const tint = LENS_TINT[active];
  return (
    <Section id="value" screen="40 Years Value" style={{ background: `radial-gradient(110% 120% at 18% 30%, ${tint}1f, var(--hs-void) 55%)`, transition: 'background .6s var(--ease-entrance)' }}>
      <Reveal><Eyebrow tone="red">What 40 years means for you</Eyebrow></Reveal>
      <Reveal delay={0.05} style={{ marginTop: 26 }}>
        <Headline>Four decades of experience.<br />Built for what brands need next.</Headline>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: 24 }}>
        <Lead>We are not celebrating 40 years to look back. We are using it to move forward — with the experience, network and creative discipline to help brands activate faster, smarter and stronger.</Lead>
      </Reveal>
      <Reveal delay={0.14} style={{ marginTop: 32 }}>
        <a href="#contact" className="hs-btn-primary">Put 40 Years to Work for You</a>
      </Reveal>

      <div className="hs-value-grid" style={{ marginTop: 64, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 'clamp(32px,4vw,56px)', alignItems: 'center' }}>
        <div className="hs-value-dial" style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg className="hs-ring-spin" viewBox="0 0 220 220" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color: tint, transition: 'color .6s var(--ease-entrance)' }} aria-hidden="true">
            <defs>
              <path id="hs-40-ring" fill="none" d="M110,110 m-101,0 a101,101 0 1,1 202,0 a101,101 0 1,1 -202,0" />
            </defs>
            <text style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 8.8, letterSpacing: '0.2em', fill: 'currentColor', opacity: 0.92 }}>
              <textPath href="#hs-40-ring" startOffset="0" textLength="634" lengthAdjust="spacing">
                HOTSHOES ASIA · 40 YEARS OF CREATING IMPACT · WHERE WORLDS MEET ·&nbsp;
              </textPath>
            </text>
          </svg>
          <svg viewBox="0 0 220 220" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
            <circle cx="110" cy="110" r="86" fill="none" stroke={C.line} strokeWidth="1.5" />
            {lenses.map((_, i) => {
              const seg = 1 / lenses.length;
              const circ = 2 * Math.PI * 86;
              return <circle key={i} cx="110" cy="110" r="86" fill="none" stroke={active === i ? LENS_TINT[i] : 'transparent'} strokeWidth="3.5"
                strokeDasharray={`${circ * seg * 0.9} ${circ}`} strokeDashoffset={-circ * seg * i} strokeLinecap="round"
                transform="rotate(-90 110 110)" style={{ transition: 'stroke .4s' }} />;
            })}
          </svg>
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(104px,13vw,184px)', lineHeight: 0.86, letterSpacing: '-0.04em', color: C.ink }}>40</div>
            <div style={{ fontFamily: F.mono, fontSize: 'clamp(11px,1vw,15px)', letterSpacing: '0.34em', textTransform: 'uppercase', color: C.dim }}>Years</div>
          </div>
        </div>
        <div>
          {lenses.map((l, i) => {
            const on = active === i;
            return (
              <div key={l.n} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} tabIndex={0}
                onFocus={() => setActive(i)} onKeyDown={(e) => { if (e.key === 'Enter') setActive(i); }}
                style={{ cursor: 'pointer', padding: '20px 0', borderTop: `1px solid ${C.line}`, outline: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 13, color: on ? LENS_TINT[i] : C.dim, transition: 'color .3s' }}>{l.n}</span>
                  <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 'clamp(22px,2.4vw,32px)', letterSpacing: '-0.015em', textTransform: 'uppercase', color: on ? C.ink : C.muted, transition: 'color .3s' }}>{l.title}</span>
                  <span style={{ marginLeft: 'auto', width: on ? 40 : 8, height: 3, background: on ? C.red : C.line, transition: 'all .35s var(--ease-entrance)' }} />
                </div>
                <div style={{ overflow: 'hidden', maxHeight: on ? 160 : 0, opacity: on ? 1 : 0, transition: 'max-height .45s var(--ease-entrance), opacity .4s' }}>
                  <p style={{ margin: '16px 0 0 29px', maxWidth: 520, fontFamily: F.sans, fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.6, color: C.muted }}>{l.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export function Capabilities() {
  const items = capabilities;
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  };
  return (
    <Section id="capabilities" bg="charcoal" screen="Capabilities">
      <div ref={ref} onMouseMove={onMove} className="hs-cap-stage" style={{ position: 'relative' }}>
        <div aria-hidden="true" className="hs-cap-spot" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal><Eyebrow>What we do</Eyebrow></Reveal>
          <Reveal delay={0.05} style={{ marginTop: 26 }}>
            <Headline size="clamp(30px,4vw,58px)" style={{ maxWidth: 1000 }}>Integrated capabilities for brands that need more than a one-off event.</Headline>
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 24 }}>
            <Lead>Hotshoes brings together strategy, creativity, activation, technology and production to create brand experiences that work across every stage of the customer journey.</Lead>
          </Reveal>
          <Reveal delay={0.14} style={{ marginTop: 32 }}>
            <a href="#contact" className="hs-btn-primary">Discuss Your Brand Activation</a>
          </Reveal>
          <div style={{ marginTop: 56 }}>
            {items.map((it) => <CapRow key={it.n} it={it} />)}
          </div>
        </div>
      </div>
    </Section>
  );
}

function CapRow({ it }) {
  const [h, setH] = useState(false);
  return (
    <Reveal>
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        className="hs-cap-row" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '72px minmax(0,0.9fr) minmax(0,1.1fr)', gap: 'clamp(20px,3vw,48px)', alignItems: 'center', padding: 'clamp(22px,2.4vw,32px) clamp(12px,1.6vw,24px)', borderTop: `1px solid ${C.line}`, borderRadius: 16, background: h ? 'linear-gradient(90deg, rgba(46,91,255,0.12), rgba(237,28,46,0.06) 58%, transparent)' : 'transparent', transform: h ? 'translateX(10px)' : 'none', transition: 'background .35s, transform .4s var(--ease-entrance)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F.mono, fontSize: 16, fontWeight: 600, color: h ? C.redBright : C.cyan, transition: 'color .3s' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: h ? C.red : 'transparent', transition: 'background .3s' }} />{it.n}
        </span>
        <h3 style={{ margin: 0, fontFamily: F.display, fontWeight: 800, fontSize: 'clamp(26px,3vw,42px)', lineHeight: 1.02, letterSpacing: '-0.02em', textTransform: 'uppercase', color: h ? C.redBright : C.ink, transition: 'color .3s' }}>{it.title}</h3>
        <p style={{ margin: 0, fontFamily: F.sans, fontSize: 'clamp(15px,1.3vw,17px)', lineHeight: 1.6, color: h ? C.ink : C.muted, transition: 'color .3s' }}>{it.copy}</p>
      </div>
    </Reveal>
  );
}

export function Delivery() {
  const pillars = delivery;
  return (
    <Section id="delivery" bg="void" screen="How We Deliver">
      <Reveal><Eyebrow>How we deliver</Eyebrow></Reveal>
      <Reveal delay={0.05} style={{ marginTop: 26 }}>
        <Headline>Bold ideas need<br />serious delivery.</Headline>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: 24 }}>
        <Lead>Our work is powered by multidisciplinary teams, trusted partners, certified systems and the operational experience needed to bring complex brand experiences to life.</Lead>
      </Reveal>
      <Reveal delay={0.14} style={{ marginTop: 32 }}>
        <a href="#contact" className="hs-btn-primary">Plan Your Campaign With Us</a>
      </Reveal>
      <div className="hs-deliver-grid" style={{ marginTop: 60, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {pillars.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.08}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'clamp(26px,2.6vw,36px)', borderRadius: 'var(--radius-panel)', background: C.card, border: `1px solid ${C.line}` }}>
              <span style={{ fontFamily: F.mono, fontSize: 13, color: C.cyan }}>{p.n}</span>
              <h3 style={{ margin: '18px 0 0', fontFamily: F.display, fontWeight: 800, fontSize: 'clamp(22px,2.2vw,28px)', lineHeight: 1.08, letterSpacing: '-0.015em', textTransform: 'uppercase', color: C.ink }}>{p.title}</h3>
              <p style={{ margin: '16px 0 0', fontFamily: F.sans, fontSize: 15.5, lineHeight: 1.6, color: C.muted }}>{p.copy}</p>
              <ul style={{ margin: '24px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 12, borderTop: `1px solid ${C.line}`, paddingTop: 22 }}>
                {p.points.map((pt) => (
                  <li key={pt} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.sans, fontSize: 14.5, color: C.ink }}>
                    <span style={{ width: 6, height: 6, background: C.cyan, flex: 'none' }} />{pt}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Certifications() {
  const certs = certifications;
  const feat = recordFeature;
  return (
    <Section id="certifications" bg="charcoal" screen="Certifications">
      <Reveal><Eyebrow>Certified to deliver</Eyebrow></Reveal>
      <Reveal delay={0.05} style={{ marginTop: 26 }}>
        <Headline>Built with the systems<br />serious brands expect.</Headline>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: 24 }}>
        <Lead>Behind the creativity is a delivery standard built for accountability, safety, quality and trust — giving clients confidence from planning to production.</Lead>
      </Reveal>
      <Reveal delay={0.14} style={{ marginTop: 32 }}>
        <a href="#contact" className="hs-btn-primary">Work With a Certified Partner</a>
      </Reveal>

      <Reveal delay={0.12} style={{ marginTop: 56 }}>
        <div className="hs-record-banner" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(28px,4vw,56px)', alignItems: 'center', padding: 'clamp(28px,3vw,44px)', borderRadius: 'var(--radius-panel)', background: C.card, border: `1px solid ${C.line}`, position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.red }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 160, padding: '0 clamp(8px,1.5vw,20px)' }}>
            <img src={feat.logo} alt={feat.badge} style={{ width: 'clamp(140px,12vw,184px)', height: 'auto', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.cyan, marginBottom: 16 }}>
              <span style={{ width: 7, height: 7, background: C.red }} />{feat.badge}
            </div>
            <h3 style={{ margin: 0, fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(24px,2.6vw,38px)', lineHeight: 1.04, letterSpacing: '-0.02em', color: C.ink, textTransform: 'uppercase', textWrap: 'balance' }}>{feat.title}</h3>
            <p style={{ margin: '18px 0 0', fontFamily: F.sans, fontSize: 15.5, lineHeight: 1.6, color: C.muted, maxWidth: '60ch' }}>{feat.copy}</p>
          </div>
        </div>
      </Reveal>

      <div className="hs-cert-grid" style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
        {certs.map((ct, i) => (
          <Reveal key={ct.code} delay={i * 0.08}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(28px,2.8vw,40px)', borderRadius: 'var(--radius-panel)', background: C.card, border: `1px solid ${C.line}` }}>
              <div className="hs-cert-logobox" style={{ height: 124, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {ct.logo ? (
                  <img className="hs-cert-logo" src={ct.logo} alt={`${ct.code} — ${ct.title}`} style={{ maxHeight: 116, maxWidth: '100%', width: 'auto', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(40px,3.4vw,56px)', lineHeight: 0.9, letterSpacing: '-0.03em', color: C.ink }}>{ct.code}</span>
                )}
              </div>
              <h3 style={{ margin: '28px 0 0', paddingTop: 22, borderTop: `1px solid ${C.line}`, width: '100%', fontFamily: F.mono, fontWeight: 500, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.cyan }}>{ct.code}</h3>
              <h4 style={{ margin: '12px 0 0', fontFamily: F.sans, fontWeight: 700, fontSize: 18, color: C.ink }}>{ct.title}</h4>
              <p style={{ margin: '12px 0 0', fontFamily: F.sans, fontSize: 15, lineHeight: 1.6, color: C.muted }}>{ct.copy}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
