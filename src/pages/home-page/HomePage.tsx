import HeroPage from './HeroPage'
import OperatorSection from './OperatorSection'
import BlogSection from './BlogSection'

function HomePage() {
  return (
    <div className="w-full space-y-16 pb-16 bg-slate-50/50">
      <HeroPage />
      <OperatorSection />
      <BlogSection />
    </div>
  )
}

export default HomePage