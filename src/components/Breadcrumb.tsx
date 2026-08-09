interface Crumb {
  label: string
  onClick?: () => void
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5 px-4 pt-4 text-sm">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-neutral-300 dark:text-neutral-600">/</span>}
          {c.onClick ? (
            <button
              onClick={c.onClick}
              className="text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {c.label}
            </button>
          ) : (
            <span className="font-medium text-neutral-900 dark:text-neutral-100">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
