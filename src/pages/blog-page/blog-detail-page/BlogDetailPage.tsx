// Reading this as: Blog detail page for transit news, with editorial typography, clean reading layout, and standard back navigation.
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { IconArrowLeft, IconCalendar, IconUser, IconClock, IconLoader } from '@tabler/icons-react'
import { ReadingProgressBar } from './components/ReadingProgressBar'
import { ShareButtons } from './components/ShareButtons'
import { TocNav } from './components/Toc'
import { getBlogDetail, type BlogPost } from '../../../services/blogService'

interface TocEntry {
  id: string
  text: string
  level: number
}

// Helper to parse HTML strings from MongoDB using browser native DOMParser
// This automatically generates anchor IDs for all h2 & h3 tags, and extracts them for the ToC list
const parseHtmlAndGenerateToc = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const headings = doc.querySelectorAll('h2, h3')
  const toc: TocEntry[] = []

  headings.forEach((heading, idx) => {
    // Generate a URL-safe ID if it doesn't already exist
    const id = heading.id || (heading.textContent
      ? heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : `heading-${idx}`)
    
    heading.id = id
    toc.push({
      id,
      text: heading.textContent || '',
      level: heading.tagName.toLowerCase() === 'h2' ? 2 : 3
    })
  })

  return {
    htmlContent: doc.body.innerHTML,
    toc
  }
}

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // API States
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)
      try {
        const data = await getBlogDetail(id)
        setPost(data)
        window.scrollTo(0, 0)
      } catch (err) {
        console.error('Failed to fetch blog details:', err)
        setError('Article not found or has been deleted.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogDetail()
  }, [id])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center font-primary flex flex-col items-center justify-center space-y-3">
        <IconLoader className="w-8 h-8 text-primary animate-spin" />
        <p className="text-slate-400 text-sm font-semibold">Loading article...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-primary">
        <h1 className="text-2xl font-bold text-slate-800">Article Not Found</h1>
        <p className="text-slate-500 mt-2">{error || 'This article does not exist or has been deleted.'}</p>
        <button
          onClick={() => navigate('/blog')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <IconArrowLeft className="w-4 h-4" /> Back to Blog
        </button>
      </div>
    )
  }

  // Parse HTML content and generate Table of Contents dynamically
  const { htmlContent, toc: tocEntries } = post.content
    ? parseHtmlAndGenerateToc(post.content)
    : { htmlContent: '', toc: [] }

  const shareUrl = window.location.href

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 font-secondary text-left relative">
      {/* Scroll reading progress bar */}
      <ReadingProgressBar />

      <div className="max-w-6xl mx-auto px-4">
        
        {/* Back navigation button */}
        <button
          onClick={() => navigate('/blog')}
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm mb-8 transition-colors active:scale-[0.98] cursor-pointer"
        >
          <IconArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          BACK TO BLOG
        </button>

        {/* Two-Column split layout for reading and dynamic widgets */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Article Container Column */}
          <div className="w-full lg:w-[68%]">
            <article className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 md:p-10 space-y-6 animate-fade-in">
              
              {/* Header and metadata */}
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-50 text-primary rounded-lg font-primary">
                  {post.tag}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight font-primary">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 border-b border-slate-100 pb-5">
                  <span className="flex items-center gap-1.5 font-primary text-slate-700">
                    <IconUser className="w-3.5 h-3.5 text-slate-400" />
                    {post.authorId?.fullName || 'BusNet Editor'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconCalendar className="w-3.5 h-3.5" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5" />
                    5 Min Read
                  </span>
                </div>
              </div>

              {/* Main scenic featured photo banner */}
              <div className="aspect-2/1 rounded-2xl overflow-hidden shadow-inner border border-slate-150">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Main typography HTML content container */}
              <div 
                className="html-content text-slate-700 text-base leading-relaxed space-y-5 font-secondary pt-2"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

            </article>
          </div>

          {/* Sticky sidebar widgets: ToC & Sharing buttons */}
          <aside className="w-full lg:w-[32%] lg:sticky lg:top-24 space-y-6">
            {/* Table of Contents widget */}
            {tocEntries.length > 0 && <TocNav toc={tocEntries} />}

            {/* Sharing buttons widget */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <ShareButtons url={shareUrl} title={post.title} />
            </div>
          </aside>

        </div>

      </div>
    </div>
  )
}

export default BlogDetailPage
