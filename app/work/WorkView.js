"use client";

import { useState } from "react";
import Link from "next/link";
import { C, F } from "../components/Shared";
import { cases, caseCategories } from "../data/content";

const ALL = "All";

export default function WorkView() {
  const [active, setActive] = useState(ALL);

  const filtered = active === ALL ? cases : cases.filter((c) => c.category === active);

  return (
    <div style={{ background: 'var(--hs-void)', minHeight: '100vh', color: C.ink }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px clamp(20px,5vw,56px)',
        background: 'rgba(7,6,15,0.82)', backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.line}`,
      }}>
        <Link href="/" aria-label="Hotshoes Asia home">
          <img src="/assets/logo-white.png" alt="Hotshoes Asia" style={{ height: 24, width: 'auto', display: 'block' }} />
        </Link>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 9,
          fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
          textDecoration: 'none', color: 'rgba(244,243,248,0.72)',
          transition: 'color .2s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,243,248,0.72)')}>
          <span style={{ color: C.red }}>←</span> Back to Home
        </Link>
      </header>

      {/* Hero */}
      <section style={{ padding: 'clamp(72px,10vw,128px) clamp(24px,6vw,96px) clamp(40px,5vw,64px)', maxWidth: 1360, margin: '0 auto' }}>
        <p style={{ margin: '0 0 20px', fontFamily: F.mono, fontSize: 12, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.cyan, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 7, height: 7, background: C.red, display: 'inline-block' }} />
          Our Work
        </p>
        <h1 style={{ margin: 0, fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(48px,7vw,104px)', lineHeight: 0.92, letterSpacing: '-0.03em', textTransform: 'uppercase', textWrap: 'balance' }}>
          All Case<br />Studies
        </h1>
        <p style={{ margin: '28px 0 0', maxWidth: 560, fontFamily: F.sans, fontSize: 'clamp(16px,1.4vw,19px)', lineHeight: 1.6, color: C.muted }}>
          40 years of turning business objectives into brand experiences. Filter by discipline to explore the work.
        </p>
      </section>

      {/* Filter Bar */}
      <div style={{ position: 'sticky', top: 65, zIndex: 20, borderBottom: `1px solid ${C.line}`, background: 'rgba(7,6,15,0.92)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 clamp(24px,6vw,96px)', overflowX: 'auto', display: 'flex', gap: 4, scrollbarWidth: 'none' }}>
          {[ALL, ...caseCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                flexShrink: 0,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '18px 16px',
                fontFamily: F.mono, fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: active === cat ? C.ink : C.dim,
                borderBottom: `2px solid ${active === cat ? C.red : 'transparent'}`,
                transition: 'color .2s, border-color .2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { if (active !== cat) e.currentTarget.style.color = 'rgba(244,243,248,0.7)'; }}
              onMouseLeave={(e) => { if (active !== cat) e.currentTarget.style.color = C.dim; }}
            >
              {cat}
              {cat !== ALL && (
                <span style={{ marginLeft: 8, color: C.dim, fontSize: 10 }}>
                  ({cases.filter((c) => c.category === cat).length})
                </span>
              )}
              {cat === ALL && (
                <span style={{ marginLeft: 8, color: C.dim, fontSize: 10 }}>({cases.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      <main style={{ maxWidth: 1360, margin: '0 auto', padding: 'clamp(48px,6vw,80px) clamp(24px,6vw,96px) clamp(80px,10vw,128px)' }}>
        {filtered.length === 0 ? (
          <p style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.dim, textAlign: 'center', padding: '80px 0' }}>
            No case studies in this category yet.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 480px), 1fr))', gap: 'clamp(24px,3vw,40px)' }}>
            {filtered.map((cs) => (
              <CaseCard key={cs.n} cs={cs} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: '40px clamp(24px,6vw,96px)', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/#contact" className="hs-btn-primary">Start a Project</Link>
        <p style={{ margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.12em', color: C.dim }}>© 1986 — 2026 HOTSHOES ASIA</p>
      </footer>
    </div>
  );
}

function CaseCard({ cs }) {
  const [h, setH] = useState(false);
  return (
    <Link
      href={`/case-study/${cs.n}`}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      {/* Image */}
      <div style={{
        position: 'relative', aspectRatio: '16 / 10',
        borderRadius: 'var(--radius-panel)', overflow: 'hidden',
        background: '#0A0814',
        border: `1px solid ${h ? C.red : C.line}`,
        transition: 'border-color .3s',
      }}>
        <img
          src={cs.photo} alt={cs.title} loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: h ? 'scale(1.04)' : 'scale(1)', transition: 'transform .9s var(--ease-entrance)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,6,15,0.75) 0%, rgba(7,6,15,0.1) 60%)' }} />

        {/* Client badge */}
        <span style={{
          position: 'absolute', left: 20, top: 18,
          fontFamily: F.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: C.ink, background: 'rgba(7,6,15,0.55)', backdropFilter: 'blur(6px)',
          border: `1px solid ${C.line}`, padding: '7px 12px', borderRadius: 7,
        }}>{cs.client}</span>

        {/* Category badge */}
        <span style={{
          position: 'absolute', right: 20, top: 18,
          fontFamily: F.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: C.cyan, background: 'rgba(7,6,15,0.55)', backdropFilter: 'blur(6px)',
          border: `1px solid rgba(31,208,240,0.25)`, padding: '7px 12px', borderRadius: 7,
        }}>{cs.category}</span>

        {/* YouTube indicator */}
        {cs.youtubeId && (
          <span style={{
            position: 'absolute', left: 20, bottom: 18,
            fontFamily: F.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#fff', background: '#FF0000', padding: '5px 10px', borderRadius: 5,
          }}>▶ Video</span>
        )}
      </div>

      {/* Text */}
      <div style={{ padding: '22px 4px 8px' }}>
        <h2 style={{
          margin: 0, fontFamily: F.display, fontWeight: 900,
          fontSize: 'clamp(22px,2.2vw,30px)', lineHeight: 1.0, letterSpacing: '-0.02em',
          textTransform: 'uppercase', color: h ? C.redBright : C.ink,
          transition: 'color .3s', textWrap: 'balance',
        }}>{cs.title}</h2>
        <p style={{ margin: '10px 0 0', fontFamily: F.sans, fontSize: 14, lineHeight: 1.55, color: C.muted }}>
          {cs.impact}
        </p>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16,
          fontFamily: F.mono, fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: h ? C.redBright : C.dim, transition: 'color .3s',
        }}>View Case Study <span style={{ color: C.red }}>→</span></span>
      </div>
    </Link>
  );
}
