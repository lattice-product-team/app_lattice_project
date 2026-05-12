import { Avatar } from '@heroui/react';
import { SidebarNav } from '@/components/sidebar-nav';
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
    <div className="flex h-screen overflow-hidden bg-eggshell">
      {/* Sidebar - Editorial Style */}
      <aside className="w-64 bg-eggshell border-r border-chalk flex flex-col z-50">
        <div className="p-8 pt-12">
          <div className="flex items-center gap-3 px-1 pb-6 border-b border-chalk/50 mb-8">
            <Avatar 
              name={displayName[0]}
              className="bg-powder text-obsidian font-bold rounded-full w-10 h-10 border border-chalk" 
            />
            <div className="flex flex-col">
              <span className="text-admin-base font-semibold text-obsidian leading-tight">
                {displayName}
              </span>
              <span className="text-admin-xs text-gravel font-medium">Administrator</span>
            </div>
          </div>
        </div>

        <SidebarNav />
      </aside>

      <main className="flex-1 flex flex-col min-h-0 bg-eggshell">
        <div className="flex-1 overflow-y-auto w-full">{children}</div>
      </main>
    </div>
  );
}
