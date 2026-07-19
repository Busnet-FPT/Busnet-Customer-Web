import type { SearchHistoryItem } from '../types/searchHistory'

interface RecentSearchesProps {
  items: SearchHistoryItem[]
  onSelect: (item: SearchHistoryItem) => void
  onDelete?: (id: string) => void
  onClear?: () => void
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateStr
  }
}

export default function RecentSearches({
  items,
  onSelect,
  onDelete,
  onClear
}: RecentSearchesProps) {
  if (!items || items.length === 0) {
    return null
  }

  // Only take max 3 items
  const displayItems = items.slice(0, 3)

  return (
    <div className="relative z-10 mt-4 w-full max-w-4xl text-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white font-primary drop-shadow-sm">
          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Searches
        </div>

        {onClear && displayItems.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-semibold text-white/85 hover:text-white transition-colors cursor-pointer underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {displayItems.map((item) => (
          <div
            key={item._id}
            onClick={() => onSelect(item)}
            className="group relative flex flex-col justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-md transition-all duration-200 cursor-pointer hover:border-primary/30 hover:shadow-lg active:scale-[0.98]"
          >
            {/* Route */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 font-primary truncate">
                {item.departureLocation} → {item.arrivalLocation}
              </span>

              {/* Single Item Delete Button */}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item._id)
                  }}
                  className="shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Remove this search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Date */}
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <svg className="w-3 h-3 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(item.departureDate)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
