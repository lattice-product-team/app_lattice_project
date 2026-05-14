import { Suspense } from 'react';
import { FloatingWrapper } from '@/components/command-center/FloatingWrapper';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const email = session?.email || 'admin@lattice.studio';
  const displayName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background flex flex-col font-sans antialiased transition-colors duration-300">
      <FloatingWrapper />

      {/* Main Content Canvas - Full screen to allow maps/backgrounds to show behind nav */}
      <main className="flex-1 w-full overflow-y-auto h-full">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center bg-background h-screen">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
