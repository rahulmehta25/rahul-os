import { useEffect, useRef } from 'react';

const projects = [
  {
    title: 'Osmoti',
    description: 'B2B SaaS for ad performance management and optimization',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'AWS'],
    url: 'https://osmoti.com',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    accent: '#3b82f6',
  },
  {
    title: 'Keep Safe',
    description: 'Smart hotel safe with digital concierge and analytics',
    tech: ['React', 'Firebase', 'OpenAI', 'RAG'],
    url: 'https://beachbox.co',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    accent: '#22c55e',
  },
  {
    title: 'Analytics Pro',
    description: 'Marketing analytics platform with AI-powered natural language queries',
    tech: ['Next.js', 'FastAPI', 'BigQuery', 'Vertex AI'],
    url: 'https://analytics-pro-frontend.vercel.app',
    gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
    accent: '#eab308',
  },
  {
    title: 'RahulOS',
    description: 'This interactive desktop OS, built entirely in the browser',
    tech: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
    url: 'https://os.rahul-mehta.me',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    accent: '#8b5cf6',
  },
  {
    title: 'Screenshot Reviewer',
    description: 'Native macOS app for reviewing and cleaning screenshots with OCR',
    tech: ['Swift', 'SwiftUI', 'Vision', 'macOS'],
    url: 'https://github.com/rahulmehta25/File-Reviewer',
    gradient: 'linear-gradient(135deg, #e11d48, #be123c)',
    accent: '#e11d48',
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
        background: '#111111',
        color: '#f5f5f7',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif",
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
      }}
    >
      {/* Header with gradient background */}
      <header
        style={{
          background: 'linear-gradient(135deg, #0c1929 0%, #1a1a3e 40%, #2563eb 100%)',
          padding: '48px 24px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle noise/glow overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Avatar */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 4px 24px rgba(59, 130, 246, 0.35)',
            position: 'relative',
          }}
        >
          RM
        </div>

        {/* Name */}
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 4px',
            position: 'relative',
          }}
        >
          Rahul Mehta
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 20px',
            position: 'relative',
          }}
        >
          Startup Founder & AI/ML Engineer
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

      {/* Projects section */}
      <section style={{ padding: '28px 20px' }}>
        <h2
          style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            color: '#6e6e73',
            marginBottom: '16px',
          }}
        >
          Projects
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                background: '#1c1c1e',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                position: 'relative',
                opacity: 0,
                transform: 'translateY(16px)',
                transition: `opacity 400ms ease ${i * 80}ms, transform 400ms ease ${i * 80}ms`,
              }}
            >
              {/* Left accent border */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  background: p.gradient,
                  borderRadius: '3px 0 0 3px',
                }}
              />

              <div style={{ padding: '16px 16px 16px 20px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>{p.title}</span>
                  <span style={{ fontSize: '13px', color: p.accent, fontWeight: 500 }}>
                    View Project →
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.5,
                    color: '#a1a1a6',
                    margin: '0 0 12px',
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
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: `${p.accent}18`,
                        color: p.accent,
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

      {/* Desktop experience banner */}
      <footer
        data-reveal
        style={{
          margin: '8px 20px 32px',
          padding: '14px 20px',
          borderRadius: '100px',
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          fontSize: '14px',
          color: '#a1a1a6',
          opacity: 0,
          transform: 'translateY(16px)',
          transition: 'opacity 400ms ease 400ms, transform 400ms ease 400ms',
        }}
      >
        Visit on desktop for the full RahulOS experience 💻
      </footer>
    </div>
  );
}
