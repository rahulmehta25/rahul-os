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
    title: 'Smart Legal Contracts',
    description: 'AI-powered arbitration clause analysis for legal documents',
    tech: ['FastAPI', 'NLP', 'SQLAlchemy', 'Transformers'],
    url: 'https://github.com/rahulmehta25/Smart-Legal-Contracts',
  },
  {
    title: 'RahulOS',
    description: 'This interactive desktop OS, built entirely in the browser',
    tech: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
    url: 'https://github.com/rahulmehta25/RahulOS',
  },
];

const links = [
  { label: 'GitHub', url: 'https://github.com/rahulmehta25', icon: '↗' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/rahulmehta25', icon: '↗' },
  { label: 'Portfolio', url: 'https://rahul-mehta.me', icon: '↗' },
  { label: 'Email', url: 'mailto:rahulmehta2500@gmail.com', icon: '✉' },
];

export function MobileFallback() {
  return (
    <div
      className="min-h-screen px-5 py-10"
      style={{
        background: 'var(--color-bg-desktop)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-system)',
      }}
    >
      {/* Header */}
      <header className="mb-10 text-center">
        <div
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold"
          style={{
            background: 'var(--color-accent-subtle)',
            color: 'var(--color-accent)',
          }}
        >
          RM
        </div>
        <h1 className="mb-1 text-2xl font-bold">Rahul Mehta</h1>
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Startup Founder & AI/ML Engineer, Georgia Tech 2027
        </p>
      </header>

      {/* Projects */}
      <section className="mb-10">
        <h2
          className="mb-4 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Projects
        </h2>
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <a
              key={p.title}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl p-4 transition-colors"
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold">{p.title}</span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  ↗
                </span>
              </div>
              <p
                className="mb-3 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {p.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md px-2 py-0.5 text-xs"
                    style={{
                      background: 'var(--color-accent-subtle)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="mb-10">
        <h2
          className="mb-4 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Links
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors"
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              {l.label}
              <span
                className="text-xs"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {l.icon}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Desktop banner */}
      <footer
        className="rounded-lg p-4 text-center text-sm"
        style={{
          background: 'var(--color-accent-subtle)',
          color: 'var(--color-accent)',
        }}
      >
        💻 Visit on desktop for the full RahulOS experience
      </footer>
    </div>
  );
}
