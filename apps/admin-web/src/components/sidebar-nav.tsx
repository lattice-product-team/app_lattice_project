'use client';

import { Link, Button } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { logout } from '@/app/actions';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex-1 flex flex-col h-full">
      <nav className="flex-1 px-4 py-6 space-y-1 mt-4">
        <NavItem
          href="/"
          icon={<Icons.LayoutDashboard className="w-5 h-5" />}
          label="Dashboard"
          active={pathname === '/'}
        />
        <NavItem
          href="/events"
          icon={<Icons.Calendar className="w-5 h-5" />}
          label="Events"
          active={pathname === '/events'}
        />

        {/* Points of Interest with subtitle for current event */}
        <NavItem
          href="/pois"
          icon={<Icons.MapPin className="w-5 h-5" />}
          label="Points of Interest"
          active={pathname === '/pois'}
        />

        <NavItem
          href="/map"
          icon={<Icons.Map className="w-5 h-5" />}
          label="Map Editor"
          active={pathname === '/map'}
        />
        <NavItem
          href="/radar"
          icon={<Icons.Users className="w-5 h-5" />}
          label="Crowd Radar"
          active={pathname === '/radar'}
        />
      </nav>

      {/* Logout Action */}
      <div className="px-4 py-8 border-t border-chalk/30">
        <form action={logout}>
          <Button
            type="submit"
            variant="light"
            className="w-full flex items-center justify-start gap-4 px-5 py-2.5 rounded-full text-gravel hover:text-obsidian hover:bg-powder/50 font-medium transition-all no-underline text-admin-base"
          >
            <Icons.LogOut className="w-5 h-5" />
            <span className="tracking-tight leading-tight">Sign Out</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  subtitle,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-4 px-5 py-2.5 rounded-full transition-all group w-full no-underline text-admin-base
        ${
          active
            ? 'bg-powder text-obsidian font-semibold'
            : 'text-gravel hover:bg-powder/50 hover:text-obsidian font-medium'
        }
      `}
    >
      <span
        className={`transition-all ${active ? 'text-obsidian' : 'text-slate group-hover:text-obsidian'}`}
      >
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="tracking-tight leading-tight">{label}</span>
        {subtitle && (
          <span className="text-[10px] text-slate font-medium uppercase tracking-wider mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}
