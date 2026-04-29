"use client";

import { Link } from "@heroui/react";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-2.5 mt-2">
      <NavItem href="/venues" icon={<Icons.MapPin className="w-6 h-6" />} label="Venues" active={pathname === "/venues"} />
      <NavItem href="/events" icon={<Icons.Calendar className="w-6 h-6" />} label="Events" active={pathname === "/events"} />
      <NavItem href="/map" icon={<Icons.Map className="w-6 h-6" />} label="Map Editor" active={pathname === "/map"} />
      <NavItem href="/radar" icon={<Icons.Users className="w-6 h-6" />} label="Crowd Radar" active={pathname === "/radar"} />
    </nav>
  );
}

function NavItem({ href, icon, label, active = false, badge }: { href: string; icon: React.ReactNode; label: string; active?: boolean; badge?: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      underline="none"
      className={`
        flex items-center justify-between px-5 py-3.5 rounded-full transition-all group w-full no-underline
        ${active 
          ? 'bg-surface text-white font-semibold shadow-lg shadow-black/20' 
          : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
        }
      `}
    >
      <div className="flex items-center gap-5">
        <span className={`transition-all ${active ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>
          {icon}
        </span>
        <span className="text-lg font-semibold tracking-tight">{label}</span>
      </div>
      {badge && badge}
    </Link>
  );
}
