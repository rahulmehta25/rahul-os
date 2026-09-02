import { useEffect, useRef } from 'react';
import { SEQUOIA_DARK } from '../../styles/wallpapers.ts';

const projects = [
  {
    title: 'Osmoti',
    description: 'B2B SaaS for ad performance management and optimization',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'AWS'],
    url: 'https://osmoti.com',
  },
  {
    title: 'Keep Safe',
    description: 'Smart hotel safe with digital concierge and analytics',
    tech: ['React', 'Firebase', 'OpenAI', 'RAG'],
    url: 'https://beachbox.co',
  },
  {
    title: 'Analytics Pro',
    description: 'Marketing analytics platform with AI-powered natural language queries',
    tech: ['Next.js', 'FastAPI', 'BigQuery', 'Vertex AI'],
    url: 'https://analytics-pro-frontend.vercel.app',
  },
  {
    title: 'RahulOS',
    description: 'This interactive desktop OS, built entirely in the browser',
    tech: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
    url: 'https://os.rahul-mehta.me',
  },
  {
    title: 'Screenshot Reviewer',
    description: 'Native macOS app for reviewing and cleaning screenshots with OCR',
    tech: ['Swift', 'SwiftUI', 'Vision', 'macOS'],
    url: 'https://github.com/rahulmehta25/File-Reviewer',
  },
];

const socials = [
  {
    label: 'GitHub',
    url: 'https://github.com/rahulmehta25',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/rahulmehta25',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Portfolio',
    url: 'https://rahul-mehta.me',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    url: 'mailto:rahulmehta2500@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' },
    );

    const children = el.querySelectorAll('[data-reveal]');
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export function MobileFallback() {
  const containerRef = useScrollReveal();

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#0e0e10',
        color: '#f5f5f7',
        fontFamily: 'var(--font-system)',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
      }}
    >
      <header
        style={{
          padding: '56px 24px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: SEQUOIA_DARK,
            filter: 'blur(64px) brightness(0.55) saturate(1.1)',
            transform: 'scale(1.2)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, transparent 20%, rgba(0,0,0,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))',
            border: '0.5px solid rgba(255,255,255,0.28)',
            boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.35), 0 12px 32px rgba(0,0,0,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: '#fff',
            position: 'relative',
          }}
        >
          RM
        </div>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: '0 0 8px',
            position: 'relative',
          }}
        >
          Rahul Mehta
        </h1>

        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.55)',
            margin: '0 0 24px',
            letterSpacing: '0.04em',
            position: 'relative',
          }}
        >
          Startup Founder and AI/ML Engineer
        </p>

        {/* Social icon buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            position: 'relative',
          }}
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                textDecoration: 'none',
                transition: 'background 200ms, transform 200ms',
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </header>

      <section style={{ padding: '8px 20px 28px' }}>
        <h2
          className="label-quiet"
          style={{
            marginBottom: '16px',
          }}
        >
          Projects
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {projects.map((p, i) => (
            <a
              key={p.title}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                borderRadius: '14px',
                background: 'rgba(28, 28, 30, 0.72)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '0.5px solid rgba(255, 255, 255, 0.12)',
                overflow: 'hidden',
                position: 'relative',
                opacity: 0,
                transform: 'translateY(8px)',
                transition: `opacity 420ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 40}ms, transform 420ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 40}ms`,
              }}
            >
              <div style={{ padding: '18px 18px 16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 500, letterSpacing: '-0.02em' }}>{p.title}</span>
                  <span style={{ fontSize: '12px', color: '#6e6e73', fontWeight: 400 }}>
                    Open
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: '#a1a1a6',
                    margin: '0 0 14px',
                  }}
                >
                  {p.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '3px 9px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#a1a1a6',
                        border: '0.5px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer
        data-reveal
        style={{
          margin: '4px 20px 36px',
          padding: '14px 20px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '0.5px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          fontSize: '13px',
          letterSpacing: '-0.01em',
          color: '#a1a1a6',
          opacity: 0,
          transform: 'translateY(8px)',
          transition: 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1) 160ms, transform 420ms cubic-bezier(0.22, 1, 0.36, 1) 160ms',
        }}
      >
        Visit on desktop for the full RahulOS experience
      </footer>
    </div>
  );
}
