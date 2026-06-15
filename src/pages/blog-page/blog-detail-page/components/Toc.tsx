import { useEffect, useState, useRef } from 'react'
import { IconList } from '@tabler/icons-react'

export interface TocEntry {
  id: string
  text: string
  level: number
}

export function TocNav({ toc }: { toc: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string>('')
  const isClicking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isClicking.current) return
      const headerOffset = 150
      let currentSectionId = ''

      for (const item of toc) {
        const element = document.getElementById(item.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= headerOffset) {
            currentSectionId = item.id
          } else {
            break
          }
        }
      }

      if (currentSectionId !== activeId) {
        setActiveId(currentSectionId)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc, activeId])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    isClicking.current = true
    setActiveId(id)

    const element = document.getElementById(id)
    if (element) {
      const rect = element.getBoundingClientRect()
      const offsetTop = window.scrollY + rect.top - 100
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      })
    }

    setTimeout(() => {
      isClicking.current = false
    }, 1000)
  }

  if (!toc || toc.length === 0) return null

  return (
    <aside aria-label="Table of Contents" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm select-none text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <IconList className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 leading-none text-[12px] font-primary uppercase tracking-wide">
            Table of Contents
          </h4>
          <p className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-widest mt-1">
            Article Content
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 font-primary">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`group relative py-1.5 px-3.5 rounded-xl transition-all duration-300 ${
              item.level === 2
                ? 'pl-4 font-bold text-slate-700 text-[11px]'
                : 'pl-8 text-slate-500 font-semibold text-[9.5px]'
            } ${activeId === item.id ? 'bg-primary/5 text-primary' : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {activeId === item.id && (
              <span className={`absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full transition-all duration-300 ${
                item.level === 2 ? 'left-1' : 'left-4.5'
              }`} />
            )}
            <span className="line-clamp-2">{item.text}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}
