"use client";
import { useState, useEffect, useRef } from "react";
import { C, F, prefersReduced, Reveal, Section, Eyebrow, Headline, Lead, ParallaxBg } from "./Shared";
import { awards, clientsRowA, clientsRowB, workWith, beyond, enquiryTypes } from "../data/content";

const RING_R = [74, 122, 170];
const RING_TINT = ['#1FD0F0', '#6E2BE8', '#ED1C2E'];
export function AwardsRecognition() {
  const groups = awards;
  const sectionRef = useRef(null);
  const [prog, setProg] = useState(0);
  const [manual, setManual] = useState(null);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    const scroller = document.getElementById('site-scroll');
    if (!scroller) return;
    let raf = 0;
    const update = () => {
      const el = sectionRef.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = scroller.clientHeight;
      const range = r.height - vh;
      setProg(range > 0 ? Math.max(0, Math.min(1, -r.top / range)) : 0);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { scroller.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const scrollActive = Math.min(2, Math.floor(prog * 3.3));
  const active = manual != null ? manual : scrollActive;
  const cur = groups[active];
  const VB = 460, ctr = 230;

  return (
    <section ref={sectionRef} id="awards" data-screen-label="Awards & Recognition" style={{ position: 'relative', background: 'radial-gradient(120% 100% at 50% 10%, #0c0a24, var(--hs-void) 60%)' }} className="hs-awards-sec">
      <div className="hs-awards-pin" style={{ position: 'sticky', top: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '110px clamp(24px,6vw,96px)' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', width: '100%' }}>
          <Eyebrow tone="red">Award-winning work</Eyebrow>
          <Headline size="clamp(28px,3.4vw,52px)" style={{ marginTop: 24 }}>Recognised across events,<br />experiences and marketing impact.</Headline>
          <div className="hs-awards-grid" style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>
            <div className="hs-radar-wrap" style={{ position: 'relative', width: 'min(46vw, 460px)', aspectRatio: '1', margin: '0 auto' }}>
              <svg viewBox={`0 0 ${VB} ${VB}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
                {RING_R.map((r, i) => {
                  const on = active === i; const reached = active >= i;
                  return <circle key={i} cx={ctr} cy={ctr} r={r} fill="none"
                    stroke={reached ? RING_TINT[i] : C.line} strokeWidth={on ? 3 : 1.5}
                    style={{ transition: 'stroke .5s, stroke-width .4s', filter: on ? `drop-shadow(0 0 16px ${RING_TINT[i]}aa)` : 'none', opacity: reached ? 1 : 0.5 }} />;
                })}
                {[0, 60, 120, 180, 240, 300].map((a) => {
                  const rad = a * Math.PI / 180;
                  return <line key={a} x1={ctr} y1={ctr} x2={ctr + 170 * Math.cos(rad)} y2={ctr + 170 * Math.sin(rad)} stroke={C.line} strokeWidth="0.75" opacity="0.5" />;
                })}
                <circle cx={ctr} cy={ctr} r="4" fill={C.red} />
                <text x={ctr} y={ctr - 14} textAnchor="middle" fill={C.muted} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em' }}>RECOGNITION</text>
              </svg>
              {cur.bodies.map((b, i) => {
                const n = cur.bodies.length;
                const ang = (-90 + (i * 360 / n)) * Math.PI / 180;
                const r = RING_R[active];
                const x = 50 + (r / VB * 100) * Math.cos(ang);
                const y = 50 + (r / VB * 100) * Math.sin(ang);
                return (
                  <span key={b} style={{
                    position: 'absolute', left: x + '%', top: y + '%', transform: 'translate(-50%,-50%)',
                    fontFamily: F.mono, fontSize: 'clamp(8px,0.9vw,11px)', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    padding: '5px 9px', borderRadius: 'var(--radius-chip)', background: 'rgba(10,8,20,0.9)',
                    border: `1px solid ${RING_TINT[active]}66`, color: C.ink,
                    animation: prefersReduced() ? 'none' : `hs-chip-in .5s var(--ease-entrance) ${i * 0.06}s both`,
                  }}>{b}</span>
                );
              })}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
                {groups.map((g, i) => (
                  <button key={g.ring} onClick={() => setManual(i)} aria-label={g.tier}
                    style={{ flex: 1, height: 4, border: 0, padding: 0, cursor: 'pointer', borderRadius: 2, background: active === i ? RING_TINT[i] : C.line, transition: 'background .3s' }} />
                ))}
              </div>
              <p style={{ margin: 0, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: RING_TINT[active] === '#ED1C2E' ? C.redBright : RING_TINT[active] }}>{cur.ring} · Ring {active + 1} / 3</p>
              <h3 style={{ margin: '14px 0 0', fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(30px,4vw,56px)', lineHeight: 0.98, letterSpacing: '-0.03em', textTransform: 'uppercase', color: C.ink }}>{cur.tier}</h3>
              <p style={{ margin: '20px 0 0', maxWidth: 460, fontFamily: F.sans, fontSize: 'clamp(15px,1.4vw,17px)', lineHeight: 1.6, color: C.muted }}>{cur.copy}</p>
              <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cur.bodies.map((b) => (
                  <span key={b} style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '0.08em', padding: '6px 11px', borderRadius: 'var(--radius-chip)', border: `1px solid ${C.line}`, color: C.muted }}>{b}</span>
                ))}
              </div>
              <button onClick={() => setListOpen(true)} style={{ marginTop: 30, display: 'inline-flex', alignItems: 'center', gap: 10, background: 'none', border: 0, cursor: 'pointer', fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.ink }}>
                View Full Recognition List <span style={{ color: C.red }}>→</span>
              </button>
            </div>
          </div>
          <p style={{ margin: '36px 0 0', maxWidth: 720, fontFamily: F.sans, fontSize: 14, lineHeight: 1.6, color: C.dim, fontStyle: 'italic' }}>
            Awards matter because they reflect consistency — but the real measure is what the work does for the brand, the audience and the business.
          </p>
        </div>
      </div>

      <div className="hs-awards-mobile" style={{ display: 'none', padding: '90px clamp(24px,6vw,40px)' }}>
        <Eyebrow tone="red">Award-winning work</Eyebrow>
        <Headline size="clamp(28px,8vw,42px)" style={{ marginTop: 20 }}>Recognised across events, experiences and marketing impact.</Headline>
        <div style={{ marginTop: 28, display: 'grid', gap: 14 }}>
          {groups.map((g, i) => (
            <div key={g.ring} style={{ padding: 22, borderRadius: 'var(--radius-panel)', background: C.card, border: `1px solid ${C.line}`, borderLeft: `3px solid ${RING_TINT[i]}` }}>
              <p style={{ margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: RING_TINT[i] === '#ED1C2E' ? C.redBright : RING_TINT[i] }}>Ring {i + 1} / 3</p>
              <h3 style={{ margin: '8px 0 0', fontFamily: F.display, fontWeight: 900, fontSize: 24, textTransform: 'uppercase', letterSpacing: '-0.02em', color: C.ink }}>{g.tier}</h3>
              <p style={{ margin: '12px 0 0', fontFamily: F.sans, fontSize: 14.5, lineHeight: 1.6, color: C.muted }}>{g.copy}</p>
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 7, overflowX: 'auto' }}>
                {g.bodies.map((b) => <span key={b} style={{ fontFamily: F.mono, fontSize: 10.5, whiteSpace: 'nowrap', padding: '5px 9px', borderRadius: 'var(--radius-chip)', border: `1px solid ${C.line}`, color: C.muted }}>{b}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {listOpen && (
        <div onClick={() => setListOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(4,3,10,0.8)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(92vw, 520px)', height: '100%', overflowY: 'auto', background: '#0A0814', borderLeft: `1px solid ${C.line}`, padding: 'clamp(28px,4vw,48px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan }}>Full Recognition</p>
              <button onClick={() => setListOpen(false)} aria-label="Close" style={{ background: 'none', border: 0, color: C.ink, fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            {groups.map((g, i) => (
              <div key={g.ring} style={{ marginTop: 32 }}>
                <h4 style={{ margin: 0, fontFamily: F.display, fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.01em', color: RING_TINT[i] === '#ED1C2E' ? C.redBright : RING_TINT[i] }}>{g.tier}</h4>
                <ul style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
                  {g.bodies.map((b) => (
                    <li key={b} style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: F.sans, fontSize: 15, color: C.ink }}>
                      <span style={{ width: 6, height: 6, background: RING_TINT[i], flex: 'none' }} />{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p style={{ marginTop: 36, fontFamily: F.sans, fontSize: 13, lineHeight: 1.6, color: C.dim }}>A full year-by-year recognition record is available in the Hotshoes company profile on request.</p>
          </div>
        </div>
      )}
    </section>
  );
}

export function TrustClients() {
  return (
    <Section id="clients" bg="void" screen="Trust & Clients" pad="120px 0">
      <div style={{ padding: '0 clamp(24px,6vw,96px)' }}>
        <Reveal><Eyebrow>Trusted by leading brands</Eyebrow></Reveal>
        <Reveal delay={0.05} style={{ marginTop: 26 }}>
          <Headline>Built on relationships.<br />Proven through delivery.</Headline>
        </Reveal>
        <Reveal delay={0.1} style={{ marginTop: 24 }}>
          <Lead>For 40 years, brands have trusted Hotshoes to create experiences that carry their message, protect their reputation and connect with their audiences.</Lead>
        </Reveal>
      </div>

      <div className="hs-logo-wall" style={{ marginTop: 64, position: 'relative', display: 'grid', gap: 22, padding: '40px 0', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, overflow: 'hidden' }}>
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: -1, height: 2, background: 'linear-gradient(90deg, #1FD0F0, #2E5BFF, #6E2BE8, #C026D3, #ED1C2E)', opacity: 0.7 }} />
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: 'linear-gradient(90deg, #ED1C2E, #C026D3, #6E2BE8, #2E5BFF, #1FD0F0)', opacity: 0.7 }} />
        <LogoMarquee items={clientsRowA} dir="left" dur={42} />
        <LogoMarquee items={clientsRowB} dir="right" dur={52} />
      </div>

      <div style={{ padding: '0 clamp(24px,6vw,96px)' }}>
        <Reveal style={{ marginTop: 40 }}>
          <p style={{ margin: 0, maxWidth: 640, fontFamily: F.sans, fontSize: 16, lineHeight: 1.6, color: C.dim }}>
            The trust is earned on the ground — <span style={{ color: C.ink }}>project by project, audience by audience, experience by experience.</span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function LogoMarquee({ items, dir, dur }) {
  const loop = [...items, ...items];
  const anim = dir === 'left' ? 'hs-marq-l' : 'hs-marq-r';
  return (
    <div className="hs-logo-track-mask">
      <div className="hs-logo-track" style={{ display: 'inline-flex', alignItems: 'stretch', animation: prefersReduced() ? 'none' : `${anim} ${dur}s linear infinite` }}>
        {loop.map((cl, i) => <LogoTile key={i} cl={cl} />)}
      </div>
    </div>
  );
}

function LogoTile({ cl }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      title={cl.name}
      style={{ flex: 'none', width: 'clamp(200px,18vw,272px)', height: 'clamp(100px,9.5vw,134px)', marginRight: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(22px,2.6vw,38px)',
        borderRadius: 'var(--radius-panel)', background: h ? 'rgba(237,28,46,0.06)' : C.card,
        border: `1px solid ${h ? C.red : C.line}`, transition: 'background .35s, border-color .35s' }}>
      <img src={cl.logo} alt={cl.name} loading="lazy" className="hs-logo-img"
        style={{ maxWidth: '88%', maxHeight: '62%', width: 'auto', height: 'auto', objectFit: 'contain',
          opacity: h ? 1 : 0.66, filter: h ? 'none' : 'grayscale(1)', transition: 'opacity .35s, filter .35s' }} />
    </div>
  );
}

export function WorkWith() {
  const items = workWith;
  return (
    <Section id="work-with" bg="charcoal" screen="Work With Hotshoes">
      <Reveal><Eyebrow>Work with Hotshoes</Eyebrow></Reveal>
      <Reveal delay={0.05} style={{ marginTop: 26 }}>
        <Headline size="clamp(30px,4vw,58px)" style={{ maxWidth: 980 }}>Looking for the right creative activation partner?</Headline>
      </Reveal>
      <Reveal delay={0.1} style={{ marginTop: 24 }}>
        <Lead>Whether you are building a campaign, launching a product, producing an event or exploring a regional brand experience, Hotshoes is built to help you move from idea to execution.</Lead>
      </Reveal>
      <div className="hs-deliver-grid" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {items.map((it, i) => <WorkCard key={it.n} it={it} delay={i * 0.08} />)}
      </div>
    </Section>
  );
}
function WorkCard({ it, delay }) {
  const [h, setH] = useState(false);
  return (
    <Reveal delay={delay}>
      <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'clamp(28px,3vw,40px)', borderRadius: 'var(--radius-panel)', background: C.card, border: `1px solid ${h ? C.red : C.line}`, transition: 'border-color .3s' }}>
        <span style={{ fontFamily: F.mono, fontSize: 13, color: C.cyan }}>{it.n}</span>
        <h3 style={{ margin: '18px 0 0', fontFamily: F.display, fontWeight: 800, fontSize: 'clamp(24px,2.6vw,34px)', letterSpacing: '-0.02em', textTransform: 'uppercase', color: C.ink }}>{it.title}</h3>
        <p style={{ margin: '16px 0 0', fontFamily: F.sans, fontSize: 15.5, lineHeight: 1.6, color: C.muted }}>{it.copy}</p>
        <a href="#contact" style={{ marginTop: 'auto', paddingTop: 28, display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', color: h ? C.redBright : C.ink, transition: 'color .3s' }}>
          {it.cta}<span style={{ color: C.red }}>→</span>
        </a>
      </div>
    </Reveal>
  );
}

export function BeyondEvent() {
  const points = beyond;
  return (
    <section id="beyond" data-screen-label="Beyond the Event" style={{ position: 'relative', overflow: 'hidden', padding: '120px clamp(24px,6vw,96px)' }}>
      <ParallaxBg src="/assets/backgrounds/circles-06.png" align="right center" scrim="left" />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1360, margin: '0 auto' }}>
        <Reveal><Eyebrow tone="red">Beyond the event</Eyebrow></Reveal>
        <Reveal delay={0.05} style={{ marginTop: 26 }}>
          <Headline>The experience does not end<br />when the event does.</Headline>
        </Reveal>
        <Reveal delay={0.1} style={{ marginTop: 24 }}>
          <Lead>We help brands extend their impact through content, social engagement, influencer amplification, performance marketing, digital platforms and Web3-enabled experiences where relevant.</Lead>
        </Reveal>
        <div className="hs-beyond-grid" style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {points.map((p, i) => (
            <Reveal key={p} delay={(i % 3) * 0.06}>
              <div style={{ padding: '24px 26px', borderRadius: 'var(--radius-panel)', background: 'rgba(14,11,38,0.7)', border: `1px solid ${C.line}`, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: F.mono, fontSize: 12, color: C.cyan }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 'clamp(15px,1.4vw,18px)', color: C.ink }}>{p}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="final-cta" data-screen-label="Final CTA" style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(110px,14vw,180px) clamp(24px,6vw,96px)', textAlign: 'center', background: 'radial-gradient(90% 120% at 50% 120%, rgba(237,28,46,0.28), var(--hs-void) 58%)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '-10%', transform: 'translateX(-50%)', width: 'min(70vw,560px)', height: 'min(70vw,560px)', borderRadius: '50%', background: 'radial-gradient(circle at 50% 40%, rgba(237,28,46,0.4), rgba(237,28,46,0) 62%)', filter: 'blur(20px)', animation: prefersReduced() ? 'none' : 'hs-hero-float 18s ease-in-out infinite' }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1000, margin: '0 auto' }}>
        <Reveal><Eyebrow tone="red">Ready for what&rsquo;s next?</Eyebrow></Reveal>
        <Reveal delay={0.06} style={{ marginTop: 30 }}>
          <h2 style={{ margin: 0, fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(44px,9vw,118px)', lineHeight: 0.92, letterSpacing: '-0.035em', textTransform: 'uppercase', color: C.ink, textWrap: 'balance' }}>
            40 years behind us.<br />The next big idea<br /><span style={{ color: C.red }}>starts now.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12} style={{ marginTop: 30 }}>
          <p style={{ margin: '0 auto', maxWidth: 560, fontFamily: F.sans, fontSize: 'clamp(16px,1.6vw,20px)', lineHeight: 1.6, color: C.muted }}>Let&rsquo;s create the next experience people will remember.</p>
        </Reveal>
        <Reveal delay={0.18} style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
            <a href="#contact" className="hs-btn-primary">Start a Project</a>
            <a href="#contact" className="hs-btn-secondary">Talk to Hotshoes</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  const types = enquiryTypes;
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);
  const text = (label, name, req, ph) => ({ label, name, req, ph, kind: 'text' });
  const fields = [
    text('Full Name', 'name', true), text('Company', 'company', true),
    text('Email', 'email', true, 'name@company.com'), text('Phone Number', 'phone', true),
    { label: 'Enquiry Type', name: 'enquiry', kind: 'select', req: true },
    text('Purpose', 'purpose', false), text('Objective', 'objective', false),
    text('Audience Segmentation', 'audience', false), text('Timeline', 'timeline', false),
    text('Criteria / Decision Making', 'criteria', false), text('Investment Allocated', 'investment', false),
    text('Required Response Time', 'response', false),
  ];
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get('name') || !fd.get('email') || !fd.get('enquiry')) { setErr(true); return; }
    setErr(false); setSent(true);
  };
  const labelStyle = { display: 'block', marginBottom: 8, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted };
  const inputStyle = { width: '100%', boxSizing: 'border-box', fontFamily: F.sans, fontSize: 15, color: C.ink, background: 'transparent', border: `1px solid ${C.line}`, borderRadius: 'var(--radius-input)', padding: '12px 14px', outline: 'none', transition: 'border-color .3s' };
  const focus = (e) => (e.currentTarget.style.borderColor = C.cyan);
  const blur = (e) => (e.currentTarget.style.borderColor = C.line);

  return (
    <Section id="contact" bg="indigo" screen="Contact">
      <div className="hs-contact-spot" aria-hidden="true" />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Reveal><Eyebrow>Start a conversation</Eyebrow></Reveal>
        <Reveal delay={0.05} style={{ marginTop: 26 }}>
          <Headline>Tell us what you<br />need to move.</Headline>
        </Reveal>
        <Reveal delay={0.1} style={{ marginTop: 24 }}>
          <Lead>Share your objective, audience and timeline. We will help shape the right experience, activation or campaign approach.</Lead>
        </Reveal>

        {sent ? (
          <div style={{ marginTop: 48, maxWidth: 760, padding: 'clamp(32px,4vw,48px)', borderRadius: 'var(--radius-panel)', background: C.card, border: `1px solid ${C.red}` }}>
            <p style={{ margin: 0, fontFamily: F.display, fontWeight: 800, fontSize: 'clamp(24px,3vw,34px)', textTransform: 'uppercase', letterSpacing: '-0.01em', color: C.redBright }}>Thank you.</p>
            <p style={{ margin: '12px 0 0', fontFamily: F.sans, fontSize: 17, lineHeight: 1.6, color: C.muted }}>We have received your enquiry and will be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate style={{ marginTop: 48, maxWidth: 880 }}>
            <div className="hs-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 22 }}>
              {fields.map((fl) => (
                <div key={fl.name} className={fl.kind === 'select' ? 'hs-form-full' : ''}>
                  <label htmlFor={fl.name} style={labelStyle}>{fl.label}{fl.req && <span style={{ color: C.red }}> *</span>}</label>
                  {fl.kind === 'select' ? (
                    <select id={fl.name} name={fl.name} required={fl.req} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focus} onBlur={blur} defaultValue="">
                      <option value="" disabled style={{ background: '#0A0814' }}>Select an enquiry type…</option>
                      {types.map((t) => <option key={t} value={t} style={{ background: '#0A0814' }}>{t}</option>)}
                    </select>
                  ) : (
                    <input id={fl.name} name={fl.name} type={fl.name === 'email' ? 'email' : 'text'} required={fl.req} placeholder={fl.ph || ''} style={inputStyle} onFocus={focus} onBlur={blur} />
                  )}
                </div>
              ))}
              <div className="hs-form-full">
                <label htmlFor="message" style={labelStyle}>Message</label>
                <textarea id="message" name="message" rows={4} placeholder="Tell us about your project…" style={{ ...inputStyle, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
              </div>
            </div>
            {err && <p style={{ margin: '18px 0 0', fontFamily: F.mono, fontSize: 12, color: C.redBright }}>Something went wrong. Please complete the required fields, or email us directly.</p>}
            <button type="submit" className="hs-btn-primary" style={{ marginTop: 28, border: 0 }}>Send Enquiry</button>
          </form>
        )}
      </div>
    </Section>
  );
}
