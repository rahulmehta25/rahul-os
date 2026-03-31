import { useState, useCallback, useRef } from 'react';

interface ProjectCard {
  name: string;
  url: string;
  description: string;
  stack: string[];
  color: string;
  gradient: string;
  featured?: boolean;
  tagline?: string;
  mockElements?: 'portfolio' | 'dashboard' | 'landing' | 'app' | 'tool' | 'os';
}

const PROJECTS: ProjectCard[] = [
  {
    name: 'Portfolio',
    url: 'https://rahul-mehta.me',
    description:
      'Personal portfolio with project showcases, AI chatbot, and Easter eggs. The traditional way to see my work.',
    stack: ['React', 'Vercel', 'OpenRouter'],
    color: '#74c7ec',
    gradient: 'linear-gradient(135deg, #0c1929 0%, #1a3a5c 30%, #2563eb 70%, #60a5fa 100%)',
    featured: true,
    tagline: 'Startup Founder | AI/ML Engineer | GT 2027',
    mockElements: 'portfolio',
  },
  {
    name: 'Osmoti',
    url: 'https://osmoti.com',
    description:
      'B2B SaaS platform for ad performance management and optimization. Multi-tenant architecture with AI-powered insights.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'AWS', 'Anthropic'],
    color: '#89b4fa',
    gradient: 'linear-gradient(135deg, #0f1a2e 0%, #1e3a5f 40%, #3b82f6 80%, #93c5fd 100%)',
    mockElements: 'dashboard',
  },
  {
    name: 'Keep Safe',
    url: 'https://beachbox.co',
    description:
      'Hotel tech product: smart safe + speaker + charger + AI digital concierge. Secured $100K hotel partnership.',
    stack: ['React', 'Firebase', 'OpenAI', 'RAG'],
    color: '#a6e3a1',
    gradient: 'linear-gradient(135deg, #0a1f12 0%, #1a4731 40%, #22c55e 80%, #86efac 100%)',
    mockElements: 'landing',
  },
  {
    name: 'Analytics Pro',
    url: 'https://analytics-pro-frontend.vercel.app',
    description:
      'Marketing analytics with AI-powered natural language querying. Ask questions in plain English, get SQL-backed answers.',
    stack: ['FastAPI', 'BigQuery', 'Vertex AI', 'Next.js'],
    color: '#f9e2af',
    gradient: 'linear-gradient(135deg, #1a1505 0%, #4a3a0a 30%, #eab308 70%, #fde68a 100%)',
    mockElements: 'dashboard',
  },
  {
    name: 'RahulOS',
    url: 'https://os.rahul-mehta.me',
    description:
      "You're using it right now. A browser-based desktop OS built as a creative portfolio piece.",
    stack: ['React 19', 'Zustand', 'Vite', 'Tailwind 4'],
    color: '#cba6f7',
    gradient: 'linear-gradient(135deg, #1a0f2e 0%, #3b1f6e 40%, #8b5cf6 80%, #c4b5fd 100%)',
    mockElements: 'os',
  },
  {
    name: 'Screenshot Reviewer',
    url: 'https://github.com/rahulmehta25/File-Reviewer',
    description:
      'Native macOS SwiftUI app for reviewing and cleaning screenshots. Keyboard-driven keep/delete workflow with OCR categorization.',
    stack: ['Swift', 'SwiftUI', 'Vision', 'macOS'],
    color: '#f38ba8',
    gradient: 'linear-gradient(135deg, #2a0f1a 0%, #5c1a35 40%, #e11d48 80%, #fda4af 100%)',
    mockElements: 'tool',
  },
];

/* ── Mock screenshot internals ── */

function MockNavbar({ color, type }: { color: string; type: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 10px',
        background: 'rgba(0,0,0,0.35)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: `${color}40` }} />
      <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
        {(type === 'portfolio'
          ? ['About', 'Projects', 'Contact']
          : type === 'dashboard'
            ? ['Overview', 'Analytics', 'Settings']
            : type === 'landing'
              ? ['Home', 'Features', 'Pricing']
              : type === 'os'
                ? ['File', 'Edit', 'View']
                : ['Home', 'Docs', 'GitHub']
        ).map((label) => (
          <div
            key={label}
            style={{
              fontSize: '7px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-system)',
              letterSpacing: '0.3px',
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div style={{ width: '40px', height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.08)' }} />
    </div>
  );
}

function MockScreenshot({ project }: { project: ProjectCard }) {
  const c = project.color;
  const type = project.mockElements || 'app';

  if (type === 'portfolio') {
    return (
      <div style={{ padding: '12px 14px' }}>
        <MockNavbar color={c} type={type} />
        <div style={{ marginTop: '10px' }}>
          <div style={{ width: '30%', height: '7px', borderRadius: '3px', background: `${c}60`, marginBottom: '6px' }} />
          <div style={{ width: '55%', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.25)', marginBottom: '4px' }} />
          <div style={{ width: '70%', height: '5px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', marginBottom: '3px' }} />
          <div style={{ width: '50%', height: '5px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '52px', height: '18px', borderRadius: '9px', background: `${c}35`, border: `1px solid ${c}50` }} />
            <div style={{ width: '52px', height: '18px', borderRadius: '9px', background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '32px',
                  borderRadius: '6px',
                  background: `${c}${10 + i * 5}`,
                  border: `1px solid ${c}20`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div style={{ padding: '12px 14px' }}>
        <MockNavbar color={c} type={type} />
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
          {/* Sidebar */}
          <div style={{ width: '50px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: '6px',
                  borderRadius: '3px',
                  background: i === 1 ? `${c}40` : 'rgba(255,255,255,0.06)',
                  width: i === 1 ? '100%' : `${60 + i * 8}%`,
                }}
              />
            ))}
          </div>
          {/* Main content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '24px',
                    borderRadius: '4px',
                    background: `${c}${8 + i * 6}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: '60%', height: '4px', borderRadius: '2px', background: `${c}40` }} />
                </div>
              ))}
            </div>
            {/* Chart area */}
            <div
              style={{
                height: '30px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.04)',
                display: 'flex',
                alignItems: 'flex-end',
                gap: '2px',
                padding: '4px 6px',
              }}
            >
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: '1px',
                    background: `${c}${30 + Math.floor(h / 3)}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'landing') {
    return (
      <div style={{ padding: '12px 14px' }}>
        <MockNavbar color={c} type={type} />
        <div style={{ marginTop: '10px', textAlign: 'center' as const }}>
          <div style={{ width: '60%', height: '9px', borderRadius: '4px', background: 'rgba(255,255,255,0.2)', margin: '0 auto 5px' }} />
          <div style={{ width: '75%', height: '5px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', margin: '0 auto 4px' }} />
          <div style={{ width: '55%', height: '5px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', margin: '0 auto 10px' }} />
          <div style={{ width: '70px', height: '16px', borderRadius: '8px', background: `${c}35`, border: `1px solid ${c}45`, margin: '0 auto 12px' }} />
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: `${c}25` }} />
                <div style={{ width: '50%', height: '3px', borderRadius: '1px', background: 'rgba(255,255,255,0.1)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'os') {
    return (
      <div style={{ padding: '12px 14px' }}>
        <div
          style={{
            height: '10px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '2px 2px 0 0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 6px',
            gap: '3px',
          }}
        >
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#28c840' }} />
          <div style={{ flex: 1 }} />
          <div style={{ width: '30px', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }} />
        </div>
        <div
          style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '0 0 4px 4px',
            padding: '6px',
            display: 'flex',
            gap: '4px',
          }}
        >
          {/* Mini windows */}
          <div style={{ flex: 2, height: '50px', borderRadius: '3px', background: `${c}15`, border: `1px solid ${c}20` }}>
            <div style={{ height: '8px', background: `${c}10`, borderRadius: '3px 3px 0 0' }} />
          </div>
          <div style={{ flex: 1, height: '50px', borderRadius: '3px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px 3px 0 0' }} />
          </div>
        </div>
        {/* Dock */}
        <div
          style={{
            marginTop: '6px',
            display: 'flex',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          {[c, '#89b4fa', '#a6e3a1', '#f9e2af'].map((col, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '3px', background: `${col}40` }} />
          ))}
        </div>
      </div>
    );
  }

  // tool / app fallback
  return (
    <div style={{ padding: '12px 14px' }}>
      <MockNavbar color={c} type={type} />
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: `${c}20`, border: `1px solid ${c}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: `${c}40` }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
            <div style={{ width: '60%', height: '7px', borderRadius: '3px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ width: '80%', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '20px',
                borderRadius: '4px',
                background: i === 1 ? `${c}20` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === 1 ? `${c}30` : 'rgba(255,255,255,0.06)'}`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Card preview with mini Safari chrome ── */

function PreviewContent({ project }: { project: ProjectCard }) {
  const height = project.featured ? 220 : 164;
  return (
    <div
      style={{
        position: 'relative',
        height: `${height}px`,
        background: project.gradient,
        overflow: 'hidden',
      }}
    >
      {/* Mini Safari chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '0 10px',
          height: '24px',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div
          style={{
            flex: 1,
            height: '14px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 6px',
            gap: '3px',
          }}
        >
          <span style={{ fontSize: '7px', opacity: 0.5 }}>🔒</span>
          <span
            style={{
              fontSize: '8px',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'var(--font-system)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.url.replace('https://', '')}
          </span>
        </div>
      </div>

      {/* Mock screenshot content */}
      <MockScreenshot project={project} />

      {/* Bottom gradient fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          background: 'linear-gradient(transparent, var(--color-bg-surface-solid))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ── Main Browser component ── */

export function Browser() {
  const [addressValue, setAddressValue] = useState('');
  const [addressFocused, setAddressFocused] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);

  const handleAddressSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!addressValue.trim()) return;
      let url = addressValue.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener');
    },
    [addressValue],
  );

  const handleVisit = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener');
  }, []);

  const featured = PROJECTS.filter((p) => p.featured);
  const regular = PROJECTS.filter((p) => !p.featured);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'var(--font-system)' }}>
      {/* Safari toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 14px',
          height: '44px',
          background: 'var(--color-bg-titlebar)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}
      >
        {/* Navigation arrows */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              fontSize: '14px',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>
          <button
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              fontSize: '14px',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ›
          </button>
        </div>

        {/* Address bar pill */}
        <form onSubmit={handleAddressSubmit} style={{ flex: 1 }}>
          <div
            style={{
              position: 'relative',
              height: '28px',
              borderRadius: '8px',
              background: 'var(--color-bg-input)',
              border: addressFocused
                ? '1px solid var(--color-accent)'
                : '1px solid transparent',
              boxShadow: addressFocused
                ? '0 0 0 3px rgba(10, 132, 255, 0.15)'
                : 'none',
              transition: 'border-color 150ms, box-shadow 150ms',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '11px', opacity: 0.5, flexShrink: 0 }}>🔒</span>
            <input
              ref={addressRef}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-system)',
              }}
              placeholder="Search or enter website name"
              value={addressValue}
              onChange={(e) => setAddressValue(e.target.value)}
              onFocus={(e) => {
                setAddressFocused(true);
                e.target.select();
              }}
              onBlur={() => setAddressFocused(false)}
            />
          </div>
        </form>

        {/* Share / tabs buttons */}
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              fontSize: '12px',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ⬆
          </button>
          <button
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              fontSize: '12px',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ⊞
          </button>
        </div>
      </div>

      {/* Start page content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: '28px 24px', background: 'var(--color-bg-surface-solid)' }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Favorites header */}
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '16px',
              paddingLeft: '2px',
            }}
          >
            Favorites
          </h2>

          {/* Featured portfolio card (full width) */}
          {featured.map((project) => (
            <div
              key={project.name}
              onClick={() => handleVisit(project.url)}
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'var(--color-bg-surface-solid)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                marginBottom: '16px',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 8px 32px ${project.color}20, 0 2px 8px rgba(0,0,0,0.2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
            >
              <PreviewContent project={project} />
              <div style={{ padding: '16px 18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      margin: 0,
                    }}
                  >
                    {project.name}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-tertiary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {project.url.replace('https://', '')}
                  </span>
                </div>
                {project.tagline && (
                  <p
                    style={{
                      fontSize: '13px',
                      color: project.color,
                      fontWeight: 500,
                      marginBottom: '6px',
                      opacity: 0.9,
                    }}
                  >
                    {project.tagline}
                  </p>
                )}
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '14px',
                  }}
                >
                  {project.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          color: project.color,
                          background: project.color + '15',
                          border: `1px solid ${project.color}25`,
                          padding: '2px 8px',
                          borderRadius: '10px',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'var(--color-accent)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    Visit Portfolio →
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Regular project grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            {regular.map((project) => (
              <div
                key={project.name}
                onClick={() => handleVisit(project.url)}
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'var(--color-bg-surface-solid)',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 24px ${project.color}15, 0 2px 8px rgba(0,0,0,0.2)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                }}
              >
                <PreviewContent project={project} />
                <div style={{ padding: '12px 14px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h3
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        margin: 0,
                      }}
                    >
                      {project.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--color-text-tertiary)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {project.url.replace('https://', '')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.4,
                      marginBottom: '10px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {project.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: '10px',
                          fontWeight: 500,
                          color: project.color,
                          background: project.color + '15',
                          border: `1px solid ${project.color}25`,
                          padding: '2px 8px',
                          borderRadius: '10px',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
