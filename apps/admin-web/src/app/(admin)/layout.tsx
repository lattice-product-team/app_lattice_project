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
    <div className="relative h-screen w-full overflow-hidden bg-eggshell flex flex-col font-sans antialiased">
      <FloatingWrapper />

      {/* Main Content Canvas - Full screen to allow maps/backgrounds to show behind nav */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
