"use client";

import { Chip, Table } from "@heroui/react";
import { Icons } from "@/components/icons";
import { ElevenButton } from "@/components/ui/eleven-button";
import { ElevenInput } from "@/components/ui/eleven-input";

export default function EventsPage() {
  const events = [
    { id: "EVT-001", name: "F1 Spanish Grand Prix", venue: "Circuit de Barcelona", date: "May 12-14, 2026", status: "Active" },
    { id: "EVT-002", name: "Sonar Music Festival", venue: "Fira Gran Via", date: "June 18-20, 2026", status: "Upcoming" },
    { id: "EVT-003", name: "Primavera Sound", venue: "Parc del Fòrum", date: "June 4-6, 2026", status: "Planning" },
    { id: "EVT-004", name: "MWC Barcelona", venue: "Fira Barcelona", date: "March 2-5, 2026", status: "Completed" },
  ];

  return (
    <div className="space-y-12 pb-24">
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-[14px] font-medium mb-2 uppercase tracking-widest">Event Operations</p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-4">
            Monitoring global event lifecycles.
          </h1>
          <p className="text-gravel text-[16px] leading-relaxed">
            Oversee planning, execution, and post-event analysis. High-fidelity telemetry integration for operational excellence.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ElevenButton variant="ghost">Archive All</ElevenButton>
          <ElevenButton variant="primary" startContent={<Icons.Plus className="w-4 h-4" />}>
            Create New Event
          </ElevenButton>
        </div>
      </header>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-chalk pb-4">
          <div className="flex items-center gap-3">
            <h2 className="waldenburg-display text-[24px] text-obsidian">Active Schedule</h2>
            <span className="bg-powder px-2 py-0.5 rounded text-[10px] font-black border border-chalk text-obsidian uppercase tracking-widest">4 Events</span>
          </div>
          <div className="w-64">
             <ElevenInput placeholder="Search schedule..." variant="transparent" startContent={<Icons.Search className="w-4 h-4 text-gravel" />} />
          </div>
        </div>

        <Table
          aria-label="All Events List"
          className="bg-transparent shadow-none"
        >
          <Table.Content>
            <Table.Header>
              <Table.Column key="id" id="id" isRowHeader className="text-gravel uppercase text-[10px] tracking-widest font-black">ID</Table.Column>
              <Table.Column key="name" id="name" className="text-gravel uppercase text-[10px] tracking-widest font-black">Event Name</Table.Column>
              <Table.Column key="venue" id="venue" className="text-gravel uppercase text-[10px] tracking-widest font-black">Venue</Table.Column>
              <Table.Column key="status" id="status" className="text-gravel uppercase text-[10px] tracking-widest font-black">Status</Table.Column>
              <Table.Column key="actions" id="actions" className="text-gravel uppercase text-[10px] tracking-widest font-black text-right">Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {events.map((event) => (
                <Table.Row key={event.id} id={event.id.toString()} className="border-b border-chalk hover:bg-powder/30 transition-colors">
                  <Table.Cell className="py-6">
                    <span className="font-mono text-[12px] text-slate">{event.id}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6">
                    <span className="font-bold text-obsidian text-[14px]">{event.name}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6">
                    <span className="text-[14px] text-gravel">{event.venue}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6">
                    <Chip 
                      size="sm" 
                      variant="flat"
                      className={`font-black text-[10px] uppercase tracking-widest rounded-full
                        ${event.status === "Active" ? "bg-obsidian text-eggshell" : "bg-powder text-gravel border border-chalk"}`}
                    >
                      {event.status}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ElevenButton variant="compact">Manage</ElevenButton>
                      <ElevenButton variant="compact">Archive</ElevenButton>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      </div>
    </div>
  );
}
