import Link from "next/link";
import { Home, Briefcase, MessageSquare, User } from "lucide-react";

export function MobileNav() {
  // TODO: Implement actual auth check. For now we assume the user is authenticated if this component is rendered.
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe">
      <nav className="flex items-center justify-around h-16">
        <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-primary transition-colors">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>
        <Link href="/gigs/my-gigs" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-primary transition-colors">
          <Briefcase className="h-5 w-5" />
          <span className="text-[10px] font-medium">Gig Saya</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-primary transition-colors">
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] font-medium">Pesan</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-primary transition-colors">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profil</span>
        </Link>
      </nav>
    </div>
  );
}
