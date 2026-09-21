export type Page = 'onboarding' | 'wardrobe' | 'generator' | 'buy-check' | 'colors' | 'saved'

const TABS: { id: Page; label: string }[] = [
  { id: 'wardrobe', label: 'Wardrobe' },
  { id: 'generator', label: 'Generate' },
  { id: 'buy-check', label: 'Should I buy?' },
  { id: 'colors', label: 'Color combos' },
  { id: 'saved', label: 'Saved' },
]

export default function NavBar({
  page,
  onNavigate,
  onEditProfile,
}: {
  page: Page
  onNavigate: (p: Page) => void
  onEditProfile: () => void
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200/70 bg-neutral-50/90 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={() => onNavigate('wardrobe')}
          className="text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          Outfitter
        </button>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                page === tab.id
                  ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-200/70 dark:text-neutral-300 dark:hover:bg-neutral-800/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button
          onClick={onEditProfile}
          className="shrink-0 rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Profile
        </button>
      </div>
    </header>
  )
}
