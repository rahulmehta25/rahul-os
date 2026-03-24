import { useState, useCallback } from 'react';

interface ProjectCard {
  name: string;
  url: string;
  description: string;
  stack: string[];
  color: string;
  gradient: string;
  featured?: boolean;
}

const PROJECTS: ProjectCard[] = [
  {
    name: 'Portfolio',
    url: 'https://rahul-mehta.me',
    description: 'Personal portfolio with project showcases, AI chatbot, and Easter eggs. The traditional way to see my work.',
    stack: ['React', 'Vercel', 'OpenRouter'],
    color: '#74c7ec',
    gradient: 'linear-gradient(135deg, #0c1929 0%, #1a3a5c 30%, #2563eb 70%, #60a5fa 100%)',
    featured: true,
  },
  {
    name: 'Osmoti',
    url: 'https://osmoti.com',
    description: 'B2B SaaS platform for ad performance management and optimization. Multi-tenant architecture with AI-powered insights.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'AWS', 'Anthropic'],
    color: '#89b4fa',
    gradient: 'linear-gradient(135deg, #0f1a2e 0%, #1e3a5f 40%, #3b82f6 80%, #93c5fd 100%)',
  },
  {
    name: 'Keep Safe',
    url: 'https://beachbox.co',
    description: 'Hotel tech product: smart safe + speaker + charger + AI digital concierge. Secured $100K hotel partnership.',
    stack: ['React', 'Firebase', 'OpenAI', 'RAG'],
    color: '#a6e3a1',
    gradient: 'linear-gradient(135deg, #0a1f12 0%, #1a4731 40%, #22c55e 80%, #86efac 100%)',
  },
  {
    name: 'Analytics Pro',
    url: 'https://analytics-pro-frontend.vercel.app',
    description: 'Marketing analytics with AI-powered natural language querying. Ask questions in plain English, get SQL-backed answers.',
    stack: ['FastAPI', 'BigQuery', 'Vertex AI', 'Next.js'],
    color: '#f9e2af',
    gradient: 'linear-gradient(135deg, #1a1505 0%, #4a3a0a 30%, #eab308 70%, #fde68a 100%)',
  },
  {
    name: 'RahulOS',
    url: 'https://os.rahul-mehta.me',
    description: "You're using it right now. A browser-based desktop OS built as a creative portfolio piece.",
    stack: ['React 19', 'Zustand', 'Vite', 'Tailwind 4'],
    color: '#cba6f7',
    gradient: 'linear-gradient(135deg, #1a0f2e 0%, #3b1f6e 40%, #8b5cf6 80%, #c4b5fd 100%)',
  },
];

function BrowserChrome({ url, color }: { url: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3"
      style={{
        height: '28px',
        background: 'rgba(0,0,0,0.5)',
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <div className="rounded-full" style={{ width: '7px', height: '7px', background: '#ff5f57' }} />
        <div className="rounded-full" style={{ width: '7px', height: '7px', background: '#febc2e' }} />
        <div className="rounded-full" style={{ width: '7px', height: '7px', background: '#28c840' }} />
      </div>
      <div
        className="flex-1 px-2 py-0.5 rounded"
        style={{
          background: 'rgba(255,255,255,0.08)',
          fontSize: '10px',
          color: `${color}cc`,
          fontFamily: 'var(--font-mono)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {url}
      </div>
    </div>
  );
}

function PreviewContent({ project }: { project: ProjectCard }) {
  return (
    <div className="relative" style={{ height: project.featured ? '180px' : '140px', background: project.gradient, overflow: 'hidden' }}>
      <BrowserChrome url={project.url} color={project.color} />
      {/* Mock page content */}
      <div className="p-3" style={{ opacity: 0.6 }}>
        <div className="rounded" style={{ width: '40%', height: '8px', background: 'rgba(255,255,255,0.3)', marginBottom: '8px' }} />
        <div className="rounded" style={{ width: '70%', height: '6px', background: 'rgba(255,255,255,0.15)', marginBottom: '5px' }} />
        <div className="rounded" style={{ width: '55%', height: '6px', background: 'rgba(255,255,255,0.15)', marginBottom: '5px' }} />
        <div className="rounded" style={{ width: '30%', height: '6px', background: 'rgba(255,255,255,0.15)', marginBottom: '12px' }} />
        <div className="flex gap-2">
          <div className="rounded" style={{ width: '50px', height: '20px', background: `${project.color}30`, border: `1px solid ${project.color}40` }} />
          <div className="rounded" style={{ width: '50px', height: '20px', background: 'rgba(255,255,255,0.06)' }} />
        </div>
      </div>
      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '40px', background: 'linear-gradient(transparent, var(--color-bg-surface-solid))' }} />
    </div>
  );
}

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

  const featured = PROJECTS.filter((p) => p.featured);
  const regular = PROJECTS.filter((p) => !p.featured);

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
          <div className="rounded-full" style={{ width: '8px', height: '8px', background: 'var(--color-close)' }} />
          <div className="rounded-full" style={{ width: '8px', height: '8px', background: 'var(--color-minimize)' }} />
          <div className="rounded-full" style={{ width: '8px', height: '8px', background: 'var(--color-maximize)' }} />
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
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          {/* Header */}
          <div className="mb-6 text-center">
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

          {/* Featured project (full width) */}
          {featured.map((project) => (
            <div
              key={project.name}
              className="rounded-xl overflow-hidden mb-4"
              style={{
                background: 'var(--color-bg-surface-solid)',
                border: '1px solid var(--color-border)',
                transition: 'border-color 150ms, box-shadow 150ms',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = project.color + '50';
                e.currentTarget.style.boxShadow = `0 8px 32px ${project.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => handleVisit(project.url)}
            >
              <PreviewContent project={project} />
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {project.name}
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {project.url.replace('https://', '')}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
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
              </div>
            </div>
          ))}

          {/* Regular project cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '12px',
            }}
          >
            {regular.map((project) => (
              <div
                key={project.name}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'var(--color-bg-surface-solid)',
                  border: '1px solid var(--color-border)',
                  transition: 'border-color 150ms, box-shadow 150ms',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = project.color + '40';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${project.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => handleVisit(project.url)}
              >
                <PreviewContent project={project} />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {project.name}
                    </h3>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      {project.url.replace('https://', '')}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
