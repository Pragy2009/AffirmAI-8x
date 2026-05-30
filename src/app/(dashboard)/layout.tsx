import { NavBar } from '@/components/nav-bar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[hsl(var(--color-background))]">
      <main className="pb-24">
        {children}
      </main>
      <NavBar />
    </div>
  );
}
