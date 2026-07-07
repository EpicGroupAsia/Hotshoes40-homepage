"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { C, F } from "../../components/Shared";
import { cases } from "../../data/content";

const pad = (n) => String(n).padStart(2, "0");
const caseHref = (cs) => `/case-study/${cs.n}`;

export default function CaseStudyView({ caseId }) {
  const router = useRouter();
  const total = cases.length;
  const idx = Math.max(0, cases.findIndex((c) => c.n === caseId));
  const cs = cases[idx] || cases[0];
  const prev = cases[(idx - 1 + total) % total];
  const next = cases[(idx + 1) % total];

  useEffect(() => {
    window.scrollTo(0, 0);
    const onKey = (e) => {
      if (e.key === "ArrowRight") router.push(caseHref(next));
      if (e.key === "ArrowLeft") router.push(caseHref(prev));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, next, prev, router]);

  const details = [
    { n: "01", label: "The Challenge", body: cs.challenge },
    { n: "02", label: "The Experience", body: cs.experience },
    { n: "03", label: "The Impact", body: cs.impact, accent: true },
  ];

  return (
    <div>
      <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px clamp(20px,5vw,56px)', background: 'rgba(7,6,15,0.78)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${C.line}` }}>
        <Link href="/" aria-label="Hotshoes Asia home"><img src="/assets/logo-white.png" alt="Hotshoes Asia" style={{ height: 24, width: 'auto', display: 'block' }} /></Link>
        <Link href="/#work" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', color: 'rgba(244,243,248,0.82)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,243,248,0.82)')}>
          <span style={{ color: C.red }}>←</span> Back to Work
        </Link>
      </header>

      <section className="cs-rise" key={`hero-${cs.n}`} style={{ position: 'relative', minHeight: 'min(78vh, 720px)', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <img src={cs.photo} alt={cs.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,6,15,0.96) 0%, rgba(7,6,15,0.55) 42%, rgba(7,6,15,0.12) 78%, rgba(7,6,15,0.4) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1360, margin: '0 auto', padding: 'clamp(40px,7vw,96px) clamp(24px,6vw,96px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan, marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, background: C.red }} />
            <span>Case {pad(idx + 1)} / {pad(total)}</span>
            <span style={{ color: C.dim }}>·</span>
            <span style={{ color: C.ink }}>{cs.client}</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(38px,6.4vw,92px)', lineHeight: 0.94, letterSpacing: '-0.03em', color: C.ink, textTransform: 'uppercase', textWrap: 'balance', maxWidth: '16ch' }}>{cs.title}</h1>
          <p style={{ margin: '24px 0 0', fontFamily: F.mono, fontSize: 12.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted }}>{cs.category}</p>
        </div>
      </section>

      <div style={{ height: 3, background: 'linear-gradient(90deg, #1FD0F0, #2E5BFF, #6E2BE8, #C026D3, #ED1C2E)' }} />

      {/* YouTube video + photos media section */}
      {(cs.youtubeId || (cs.photos && cs.photos.length > 0)) && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(48px,7vw,80px) clamp(24px,6vw,96px) 0' }}>
          {cs.youtubeId && (
            <div style={{ marginBottom: cs.photos?.length ? 32 : 0 }}>
              <p style={{ margin: '0 0 18px', fontFamily: F.mono, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 7, height: 7, background: C.red, display: 'inline-block' }} />
                Campaign Video
              </p>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 'var(--radius-panel)', overflow: 'hidden', background: '#000', border: `1px solid ${C.line}` }}>
                <iframe
                  src={`https://www.youtube.com/embed/${cs.youtubeId}?rel=0&modestbranding=1`}
                  title={`${cs.title} — Campaign Video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                />
              </div>
            </div>
          )}
          {cs.photos && cs.photos.length > 0 && (
            <div>
              <p style={{ margin: '0 0 18px', fontFamily: F.mono, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.cyan, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 7, height: 7, background: C.red, display: 'inline-block' }} />
                Campaign Gallery
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
                {cs.photos.map((src, i) => (
                  <div key={i} style={{ aspectRatio: '4 / 3', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.line}`, background: '#000' }}>
                    <img src={src} alt={`${cs.title} — photo ${i + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(64px,9vw,120px) clamp(24px,6vw,96px)' }}>
        <div style={{ display: 'grid', gap: 'clamp(40px,5vw,72px)' }}>
          {details.map((d) => (
            <div key={d.n} className="cs-detail-row" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'clamp(20px,4vw,56px)', alignItems: 'start', paddingTop: 34, borderTop: `1px solid ${C.line}` }}>
              <div>
                <div style={{ fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(34px,4vw,56px)', lineHeight: 1, letterSpacing: '-0.02em', color: d.accent ? C.red : 'rgba(244,243,248,0.18)' }}>{d.n}</div>
                <div style={{ marginTop: 14, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: d.accent ? C.redBright : C.cyan }}>{d.label}</div>
              </div>
              <p style={{ margin: 0, fontFamily: F.sans, fontSize: 'clamp(19px,2vw,26px)', lineHeight: 1.5, color: d.accent ? C.ink : C.muted, textWrap: 'pretty', maxWidth: '34ch' }}>{d.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'clamp(56px,7vw,88px)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <Link href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 13, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff', background: C.red, padding: '16px 30px', borderRadius: 'var(--radius-button)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.redBright)} onMouseLeave={(e) => (e.currentTarget.style.background = C.red)}>Start a project like this →</Link>
          <Link href="/work" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', color: C.ink, padding: '16px 28px', borderRadius: 'var(--radius-button)', border: `1px solid ${C.line}` }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.ink)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.line)}>All case studies</Link>
        </div>
      </section>

      <nav style={{ borderTop: `1px solid ${C.line}`, background: '#0A0814' }}>
        <div className="cs-nav-grid" style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
          <CaseNavLink dir="prev" cs={prev} pos={(((idx - 1 + total) % total) + 1)} total={total} />
          <div style={{ background: C.line }} />
          <CaseNavLink dir="next" cs={next} pos={(((idx + 1) % total) + 1)} total={total} />
        </div>
      </nav>

      <footer style={{ borderTop: `1px solid ${C.line}`, padding: '40px clamp(24px,6vw,96px)', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', color: 'rgba(244,243,248,0.82)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.ink)} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,243,248,0.82)')}>
          <span style={{ color: C.red }}>←</span> Back to homepage
        </Link>
        <p style={{ margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.12em', color: C.dim }}>© 1986 — 2026 HOTSHOES ASIA</p>
      </footer>
    </div>
  );
}

function CaseNavLink({ dir, cs, pos, total }) {
  const [h, setH] = useState(false);
  const isNext = dir === "next";
  return (
    <Link href={caseHref(cs)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className={isNext ? 'cs-nav-next' : ''}
      style={{ display: 'flex', flexDirection: 'column', alignItems: isNext ? 'flex-end' : 'flex-start', gap: 12, textAlign: isNext ? 'right' : 'left',
        textDecoration: 'none', padding: 'clamp(28px,4vw,52px) clamp(24px,5vw,72px)', transition: 'background .3s', background: h ? 'rgba(237,28,46,0.06)' : 'transparent' }}>
      <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.dim }}>
        {isNext ? <>Next · {pad(pos)} / {pad(total)} <span style={{ color: C.red }}>→</span></> : <><span style={{ color: C.red }}>←</span> Previous · {pad(pos)} / {pad(total)}</>}
      </span>
      <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.cyan }}>{cs.client}</span>
      <span style={{ fontFamily: F.display, fontWeight: 900, fontSize: 'clamp(22px,2.6vw,38px)', lineHeight: 1.0, letterSpacing: '-0.025em', textTransform: 'uppercase', color: h ? C.redBright : C.ink, transition: 'color .3s', maxWidth: '14ch' }}>{cs.title}</span>
    </Link>
  );
}
