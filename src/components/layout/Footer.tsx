import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-8 bg-background border-t border-border/30">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-bold text-xl text-primary">SkillGate</span>
          <p className="text-sm text-muted-foreground">© 2026 SkillGate. Menghubungkan Potensi Mahasiswa dengan UMKM Indonesia.</p>
        </div>
        <div className="flex gap-6 text-muted-foreground text-sm font-medium">
          <Link href="#" className="hover:text-primary transition-colors hover:underline">Kebijakan Privasi</Link>
          <Link href="#" className="hover:text-primary transition-colors hover:underline">Syarat & Ketentuan</Link>
          <Link href="#" className="hover:text-primary transition-colors hover:underline">Kontak</Link>
        </div>
      </div>
    </footer>
  );
}
