import { socialLinks } from "@/lib/constants";
import { LiteToggle } from "@/components/ui/LiteToggle";

export function Footer() {
  const glass =
    "border border-white/15 bg-white/10 backdrop-blur-2xl backdrop-saturate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(255,255,255,0.05)]";
  const link = "text-text-soft transition-colors hover:text-white";

  return (
    <footer className="relative z-10 px-4 pb-10 pt-6">
      <div className={`mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-full px-5 py-3 ${glass}`}>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0e0e0e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
          </span>
          <span className="font-body text-sm font-semibold text-text-strong">© {new Date().getFullYear()} Yuvraj Sanghai</span>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-5 font-body text-sm font-medium">
          <a className={link} href="https://github.com/yuv008/portfolio" target="_blank" rel="noreferrer">
            Source
          </a>
          <a className={link} href={socialLinks.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className={link} href={`mailto:${socialLinks.email}`}>
            Email
          </a>
          <LiteToggle className="hidden text-[13px] sm:inline" />
        </nav>
      </div>
      <div className="mt-3 text-center sm:hidden">
        <LiteToggle className="text-xs" />
      </div>
    </footer>
  );
}
