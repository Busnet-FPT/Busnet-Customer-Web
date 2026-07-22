import HeroPage from './HeroPage'
import OperatorSection from './OperatorSection'
import BlogSection from './BlogSection'
import PopularRoutesSection from './PopularRoutesSection'
import ContactSection from './ContactSection'

function HomePage() {
  return (
    <div className="w-full space-y-16 pb-16 bg-slate-50/50">
      <HeroPage />
      <OperatorSection />
      <BlogSection />
      <PopularRoutesSection />
      <ContactSection />
    </div>
  )
}

export default HomePage