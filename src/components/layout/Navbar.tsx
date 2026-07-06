import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md shadow-sm border-b border-border/30">
      <div className="flex justify-between items-center px-4 md:px-6 lg:px-8 max-w-[1280px] mx-auto h-16">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-2xl text-primary hover:opacity-90 transition-opacity">
            SkillGate
          </Link>
        </div>
        
        <div className="hidden md:flex gap-8 items-center">
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden md:block px-4 py-2 rounded-xl font-medium text-sm text-primary hover:bg-primary/10 transition-colors">
            Login
          </Link>
          <button className="md:hidden p-2 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
