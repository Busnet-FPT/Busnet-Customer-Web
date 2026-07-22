import { useState } from 'react'
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconShare,
  IconLink,
  IconCheck
} from '@tabler/icons-react'

export function ShareButtons({
  url,
  title,
  hideLabel = false
}: {
  url: string
  title: string
  hideLabel?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const shareLinks = [
    {
      name: 'Facebook',
      icon: IconBrandFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10'
    },
    {
      name: 'Twitter',
      icon: IconBrandTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10'
    },
    {
      name: 'LinkedIn',
      icon: IconBrandLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10'
    }
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3">
      {!hideLabel && (
        <div className="flex items-center gap-2 mb-1 justify-start">
          <IconShare className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest font-primary">Share Article</span>
        </div>
      )}
      <div className={`flex ${hideLabel ? 'flex-col' : 'flex-row'} gap-2`}>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 transition-all duration-300 ${link.color} shadow-sm active:scale-95`}
            title={`Share on ${link.name}`}
          >
            <link.icon className="w-4.5 h-4.5" />
          </a>
        ))}
        <button
          onClick={copyToClipboard}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 transition-all duration-300 hover:text-primary hover:bg-primary/10 shadow-sm active:scale-95 cursor-pointer"
          title="Copy Link"
        >
          {copied ? <IconCheck className="w-4.5 h-4.5 text-emerald-500" /> : <IconLink className="w-4.5 h-4.5" />}
        </button>
      </div>
    </div>
  )
}
