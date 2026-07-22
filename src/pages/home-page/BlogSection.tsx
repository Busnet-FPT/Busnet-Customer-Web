import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBlogs, type BlogPost } from '../../services/blogService'
import {
  IconCalendar,
  IconClock,
  IconArrowRight,
  IconLoader,
  IconBook,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react'

export default function BlogSection() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs({ page: 1, limit: 8 }) // Fetch up to 8 posts for carousel
        setPosts(data.blogs)
      } catch (err) {
        console.error('Failed to fetch blogs for homepage:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current
      // Scroll by 80% of width to ensure smooth transition and overlap visual cue
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8
      scrollContainerRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 font-primary">
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div className="text-left space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Travel Journal
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Latest from BusNet Blog
          </h2>
          <p className="text-sm text-slate-500 font-secondary max-w-lg leading-relaxed">
            Stay updated with travel guides, smart transit tips, and the latest news from our partners.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        {!isLoading && posts.length > 3 && (
          <div className="flex gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-full border border-slate-100 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-primary transition-all active:scale-90 cursor-pointer flex items-center justify-center"
              aria-label="Previous posts"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full border border-slate-100 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-primary transition-all active:scale-90 cursor-pointer flex items-center justify-center"
              aria-label="Next posts"
            >
              <IconChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <IconLoader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-slate-400 text-xs font-secondary animate-pulse">Loading articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs font-secondary">
          No articles published yet.
        </div>
      ) : (
        <div className="space-y-10">
          {/* Carousel Track Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4 items-stretch"
          >
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] group bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-slate-200/50 transition-all duration-350 overflow-hidden cursor-pointer hover:-translate-y-1 flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-slate-100 shrink-0 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs rounded-md">
                    {post.tag}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5 text-left">
                    {/* Date and Read Time */}
                    <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 font-secondary">
                      <span className="flex items-center gap-1">
                        <IconCalendar className="w-3.5 h-3.5" />
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconClock className="w-3.5 h-3.5" />
                        5 Min Read
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-500 font-secondary leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  </div>

                  {/* Bottom Link */}
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold font-secondary">
                      By {post.authorId?.fullName || 'BusNet Editor'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-1.5 transition-all">
                      Read Article
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 cursor-pointer shadow-md shadow-slate-900/10 hover:shadow-lg"
            >
              <IconBook className="w-4 h-4" />
              View All Articles
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
