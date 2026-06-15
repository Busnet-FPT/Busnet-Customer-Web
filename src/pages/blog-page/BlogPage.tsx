// Reading this as: Editorial Blog page for a smart transit platform, with articles published by transit operators, leaning toward clean cards, interactive grid-list toggles, and search sidebar.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconLayoutGrid,
  IconList,
  IconSearch,
  IconClock,
  IconCalendar,
  IconArrowRight,
  IconLoader
} from '@tabler/icons-react'
import { getBlogs, type BlogPost } from '../../services/blogService'

const SIDEBAR_CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Destinations', value: 'Destinations' },
  { label: 'Travel Guides', value: 'Guides' },
  { label: 'Transit News', value: 'News' },
]

export function BlogPage() {
  const navigate = useNavigate()
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // API States
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch blogs on query changes
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      try {
        const data = await getBlogs({
          page: currentPage,
          limit: 10,
          search: searchQuery || undefined,
          category: selectedCategory || undefined
        })
        
        if (data.blogs && data.blogs.length > 0) {
          // Setting the first post as featured if on page 1 and no active category/search filter
          if (currentPage === 1 && !searchQuery && !selectedCategory) {
            setFeaturedPost(data.blogs[0])
            setPosts(data.blogs.slice(1))
          } else {
            setFeaturedPost(null)
            setPosts(data.blogs)
          }
        } else {
          setFeaturedPost(null)
          setPosts([])
        }
        setTotalPages(data.pagination.totalPages)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
      } finally {
        setIsLoading(false)
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchBlogs()
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery, selectedCategory, currentPage])

  // Popular articles for sidebar (use first 2 posts as placeholder)
  const popularPosts = posts.slice(0, 2)

  return (
    <div className="bg-slate-50/50 min-h-screen py-6 font-secondary text-left">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        
        {/* 1. Featured Post Hero Banner */}
        {featuredPost && !isLoading && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-2xl group min-h-[380px] md:min-h-[460px] flex flex-col justify-end text-white select-none animate-fade-in">
            <div className="absolute inset-0 z-0">
              <img
                src={featuredPost.coverImage}
                alt="Featured Post Hero"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-700"
              />
              {/* Dark glass cover gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/55 to-slate-900/10"></div>
            </div>

            <div className="relative z-10 p-6 md:p-10 max-w-3xl space-y-4">
              <span className="inline-block px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-primary text-white rounded-lg font-primary">
                {featuredPost.tag}
              </span>
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight leading-tight font-primary">
                {featuredPost.title}
              </h2>
              <p className="text-white/80 text-[14px] leading-relaxed hidden sm:block max-w-2xl font-secondary">
                {featuredPost.summary}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-white/70">
                <span className="flex items-center gap-1.5 font-primary text-white font-bold">
                  <span className="w-5.5 h-5.5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] shrink-0 text-white font-extrabold">F</span>
                  {featuredPost.authorId?.fullName || 'BusNet Editor'}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCalendar className="w-3.5 h-3.5" />
                  {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <button
                  onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-extrabold tracking-wide text-xs hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer font-primary ml-auto shadow-md"
                >
                  Read Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Main content split column grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Latest posts grid list */}
          <div className="w-full lg:w-[68%] space-y-6">
            
            {/* Grid Header and switches */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 font-primary uppercase tracking-wide">
                {searchQuery || selectedCategory ? 'Search Results' : 'Latest Articles'}
              </h3>
              
              {/* Grid / List switches buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLayoutView('grid')}
                  className={`p-1.5 rounded-lg border transition-all active:scale-90 cursor-pointer ${layoutView === 'grid' ? 'bg-white border-slate-200 text-primary shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
                  title="Layout Grid"
                >
                  <IconLayoutGrid className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setLayoutView('list')}
                  className={`p-1.5 rounded-lg border transition-all active:scale-90 cursor-pointer ${layoutView === 'list' ? 'bg-white border-slate-200 text-primary shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-650'}`}
                  title="Layout List"
                >
                  <IconList className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <IconLoader className="w-8 h-8 text-primary animate-spin" />
                <p className="text-slate-400 text-sm font-semibold">Loading articles...</p>
              </div>
            ) : posts.length === 0 && !featuredPost ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center space-y-3">
                <p className="text-slate-400 text-[14px]">No matching articles found.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory(null); setCurrentPage(1); }}
                  className="px-4 py-1.5 text-xs font-bold text-primary border border-primary/20 bg-primary/5 rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                {/* Toggle Layout Views */}
                <div className={layoutView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                  {posts.map((post) => (
                    <article
                      key={post._id}
                      className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200/60 transition-all duration-300 overflow-hidden flex ${layoutView === 'grid' ? 'flex-col' : 'flex-col md:flex-row'}`}
                    >
                      {/* Featured Image */}
                      <div className={`relative overflow-hidden shrink-0 ${layoutView === 'grid' ? 'aspect-1.6/1 w-full' : 'w-full md:w-[35%] aspect-1.5/1 md:aspect-auto min-h-[170px]'}`}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transform hover:scale-103 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs rounded-md font-primary">
                          {post.tag}
                        </span>
                      </div>

                      {/* Text content details */}
                      <div className="p-5 flex flex-col justify-between grow space-y-4 text-left">
                        <div className="space-y-2">
                          <h4
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            className="text-base font-extrabold text-slate-900 hover:text-primary transition-colors cursor-pointer leading-snug font-primary line-clamp-2"
                          >
                            {post.title}
                          </h4>
                          <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 font-secondary">
                            {post.summary}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs font-semibold text-slate-400">
                          <span className="flex items-center gap-1 font-primary text-slate-700">
                            {post.authorId?.fullName || 'BusNet Editor'}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[11px]">
                              <IconClock className="w-3.5 h-3.5" />
                              5 Min Read
                            </span>
                            <button
                              onClick={() => navigate(`/blog/${post.slug}`)}
                              className="group inline-flex items-center gap-1 text-primary font-bold text-xs cursor-pointer active:scale-95 transition-transform"
                            >
                              Read more
                              <IconArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 pt-6 select-none font-primary">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-extrabold text-slate-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Search & widgets sidebar */}
          <aside className="w-full lg:w-[32%] space-y-6">
            
            {/* Widget 1: Search widget */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Search Articles
              </h4>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter keywords..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
                <IconSearch className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Widget 2: Categories topics list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Categories
              </h4>
              <div className="space-y-1.5">
                {SIDEBAR_CATEGORIES.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedCategory(category.value); setCurrentPage(1); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] font-semibold transition-all active:scale-[0.99] cursor-pointer ${selectedCategory === category.value ? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span className="font-secondary">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 3: Popular posts panel */}
            {popularPosts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                  Popular Articles
                </h4>
                <div className="space-y-4">
                  {popularPosts.map((post) => (
                    <article key={post._id} className="flex gap-3 text-left group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-inner">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                      <div className="space-y-1 my-auto">
                        <h5
                          onClick={() => navigate(`/blog/${post.slug}`)}
                          className="text-[13px] font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer leading-snug font-primary line-clamp-2"
                        >
                          {post.title}
                        </h5>
                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 font-secondary">
                          <IconCalendar className="w-3.5 h-3.5" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>

      </div>
    </div>
  )
}

export default BlogPage