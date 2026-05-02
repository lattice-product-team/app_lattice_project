import { 
  Button, 
  Chip,
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/react";
import { Icons } from "@/components/icons";

export default function EventsPage() {
  const events = [
    { id: "EVT-001", name: "F1 Spanish Grand Prix", venue: "Circuit de Barcelona", date: "May 12-14, 2026", status: "Active" },
    { id: "EVT-002", name: "Sonar Music Festival", venue: "Fira Gran Via", date: "June 18-20, 2026", status: "Upcoming" },
    { id: "EVT-003", name: "Primavera Sound", venue: "Parc del Fòrum", date: "June 4-6, 2026", status: "Planning" },
    { id: "EVT-004", name: "MWC Barcelona", venue: "Fira Barcelona", date: "March 2-5, 2026", status: "Completed" },
  ];

  return (
    <div className="flex-1 flex flex-col p-8 pt-12 gap-6 max-w-7xl mx-auto w-full">
      <header className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="ghost" className="text-white/70">
            <Icons.Sidebar className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight">Events</h1>
            <p className="text-white/30 text-xs font-medium mt-0.5">Manage and monitor live event operations.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="ghost" className="bg-white/5 text-white/70 rounded-full">
            <Icons.Search className="w-5 h-5" />
          </Button>
          <Button isIconOnly variant="ghost" className="bg-white/5 text-white/70 rounded-full">
            <Icons.Bell className="w-5 h-5" />
          </Button>
          <Button variant="primary" className="rounded-full font-medium">
            <Icons.UserPlus className="w-4 h-4" />
            Create
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-semibold text-white">All Events</h2>
          <Chip size="sm" className="bg-white/10 text-white border-none font-medium">4</Chip>
        </div>

        <Table
          className="bg-surface border border-white/5 shadow-none p-0 overflow-hidden rounded-3xl"
        >
          <TableContent>
            <TableHeader className="bg-transparent text-white/50 font-medium border-b border-white/5 px-6 py-4">
              <TableColumn key="id">Event ID</TableColumn>
              <TableColumn key="name">Event Name</TableColumn>
              <TableColumn key="venue">Venue</TableColumn>
              <TableColumn key="status">Status</TableColumn>
              <TableColumn key="actions" align="center">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="px-6 py-4">
                    <span className="font-mono text-xs text-white/40">{event.id}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="font-semibold text-white">{event.name}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icons.MapPin className="w-3 h-3 text-white/30" />
                      <span className="text-sm">{event.venue}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Chip 
                      size="sm" 
                      variant="flat"
                      color={event.status === "Active" ? "success" : event.status === "Upcoming" ? "primary" : event.status === "Planning" ? "warning" : "default"}
                      className="font-medium h-5 text-[10px] uppercase tracking-wider"
                    >
                      {event.status}
                    </Chip>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button isIconOnly size="sm" variant="ghost" className="text-white/50 hover:text-white">
                        <Icons.Eye className="w-4 h-4" />
                      </Button>
                      <Button isIconOnly size="sm" variant="ghost" className="text-white/50 hover:text-white">
                        <Icons.Edit className="w-4 h-4" />
                      </Button>
                      <Button isIconOnly size="sm" variant="ghost" className="text-danger/70 hover:text-danger">
                        <Icons.Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContent>
        </Table>
      </div>
    </div>
  );
}
