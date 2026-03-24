import { useState, useCallback } from 'react';

interface ProjectCard {
  name: string;
  url: string;
  description: string;
  stack: string[];
  color: string;
  icon: React.ReactNode;
}

const PROJECTS: ProjectCard[] = [
  {
    name: 'Osmoti',
    url: 'https://osmoti.com',
    description: 'B2B SaaS platform for ad performance management and optimization. Multi-tenant architecture with AI-powered insights.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'AWS', 'Anthropic'],
    color: '#89b4fa',
    icon: (
      <svg viewBox="0 0 32 32" width="100%" height="100%">
        <rect width="32" height="32" rx="8" fill="#89b4fa" opacity="0.15" />
        <circle cx="16" cy="16" r="8" stroke="#89b4fa" strokeWidth="2" fill="none" />
        <circle cx="16" cy="16" r="3" fill="#89b4fa" />
      </svg>
    ),
  },
  {
    name: 'Keep Safe',
    url: 'https://beachbox.co',
    description: 'Hotel tech product: smart safe + speaker + charger + AI digital concierge. Secured $100K hotel partnership.',
    stack: ['React', 'Firebase', 'OpenAI', 'RAG'],
    color: '#a6e3a1',
    icon: (
      <svg viewBox="0 0 32 32" width="100%" height="100%">
        <rect width="32" height="32" rx="8" fill="#a6e3a1" opacity="0.15" />
        <rect x="8" y="10" width="16" height="14" rx="2" stroke="#a6e3a1" strokeWidth="2" fill="none" />
        <circle cx="16" cy="17" r="2.5" stroke="#a6e3a1" strokeWidth="1.5" fill="none" />
        <path d="M11 10V8a5 5 0 0 1 10 0v2" stroke="#a6e3a1" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Analytics Pro',
    url: 'https://analytics-pro-frontend.vercel.app',
    description: 'Marketing analytics with AI-powered natural language querying. Ask questions in plain English, get SQL-backed answers.',
    stack: ['FastAPI', 'BigQuery', 'Vertex AI', 'Next.js'],
    color: '#f9e2af',
    icon: (
      <svg viewBox="0 0 32 32" width="100%" height="100%">
        <rect width="32" height="32" rx="8" fill="#f9e2af" opacity="0.15" />
        <rect x="7" y="18" width="4" height="6" rx="1" fill="#f9e2af" />
        <rect x="14" y="12" width="4" height="12" rx="1" fill="#f9e2af" />
        <rect x="21" y="8" width="4" height="16" rx="1" fill="#f9e2af" />
      </svg>
    ),
  },
  {
    name: 'RahulOS',
    url: 'https://os.rahul-mehta.me',
    description: "You're using it right now. A browser-based desktop OS built as a creative portfolio piece.",
    stack: ['React 19', 'Zustand', 'Vite', 'Tailwind 4'],
    color: '#cba6f7',
    icon: (
      <svg viewBox="0 0 32 32" width="100%" height="100%">
        <rect width="32" height="32" rx="8" fill="#cba6f7" opacity="0.15" />
        <rect x="6" y="6" width="20" height="14" rx="2" stroke="#cba6f7" strokeWidth="2" fill="none" />
        <line x1="10" y1="24" x2="22" y2="24" stroke="#cba6f7" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="20" x2="16" y2="24" stroke="#cba6f7" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Portfolio',
    url: 'https://rahul-mehta.me',
    description: 'Personal portfolio with project showcases, AI chatbot, and Easter eggs. The traditional way to see my work.',
    stack: ['React', 'Vercel', 'OpenRouter'],
    color: '#74c7ec',
    icon: (
      <svg viewBox="0 0 32 32" width="100%" height="100%">
        <rect width="32" height="32" rx="8" fill="#74c7ec" opacity="0.15" />
        <circle cx="16" cy="12" r="5" stroke="#74c7ec" strokeWidth="2" fill="none" />
        <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#74c7ec" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
];

export function Browser() {
  const [addressValue, setAddressValue] = useState('');

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

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'var(--font-system)' }}>
      {/* Address bar */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{
          height: '40px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg-hover)',
        }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className="rounded-full"
            style={{ width: '8px', height: '8px', background: 'var(--color-close)' }}
          />
          <div
            className="rounded-full"
            style={{ width: '8px', height: '8px', background: 'var(--color-minimize)' }}
          />
          <div
            className="rounded-full"
            style={{ width: '8px', height: '8px', background: 'var(--color-maximize)' }}
          />
        </div>

        <form onSubmit={handleAddressSubmit} className="flex-1">
          <input
            className="w-full px-3 py-1.5 rounded-lg"
            style={{
              fontSize: '12px',
              background: 'var(--color-bg-input)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              outline: 'none',
            }}
            placeholder="Enter a URL and press Enter to open in a new tab..."
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
        </form>
      </div>

      {/* Bookmarks / Start page */}
      <div className="flex-1 overflow-y-auto p-6">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '4px',
              }}
            >
              Bookmarks
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
              Rahul's projects, live on the internet
            </p>
          </div>

          {/* Project cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '16px',
            }}
          >
            {PROJECTS.map((project) => (
              <div
                key={project.name}
                className="rounded-xl"
                style={{
                  background: 'var(--color-bg-surface-solid)',
                  border: '1px solid var(--color-border)',
                  padding: '20px',
                  transition: 'border-color 150ms, box-shadow 150ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = project.color + '40';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${project.color}10`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>{project.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: '2px',
                      }}
                    >
                      {project.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {project.url.replace('https://', '')}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '12px',
                  }}
                >
                  {project.description}
                </p>

                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: '10px',
                        fontWeight: 500,
                        color: project.color,
                        background: project.color + '15',
                        border: `1px solid ${project.color}30`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Visit button */}
                <button
                  className="rounded-lg px-4 py-1.5"
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--color-text-inverse)',
                    background: project.color,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 150ms',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  onClick={() => handleVisit(project.url)}
                >
                  Visit →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
