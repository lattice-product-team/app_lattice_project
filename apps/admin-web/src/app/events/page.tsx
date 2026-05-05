"use client";

import { Chip, Table, Spinner } from "@heroui/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvents } from "@/hooks/use-admin-data";

export default function EventsPage() {
  const { events, loading, error } = useEvents();

  return (
    <div className="space-y-12 pb-24">
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">Event Operations</p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-4">
            Monitoring global event lifecycles.
          </h1>
          <p className="text-gravel text-admin-md leading-relaxed">
            Oversee planning, execution, and post-event analysis. High-fidelity telemetry integration for operational excellence.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Archive All</Button>
          <Button variant="primary">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-admin-base font-medium">
          Failed to load events: {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-chalk pb-4">
          <div className="flex items-center gap-3">
            <h2 className="waldenburg-display text-[24px] text-obsidian">Active Schedule</h2>
            {!loading && (
              <span className="bg-powder px-2 py-0.5 rounded text-[10px] font-black border border-chalk text-obsidian uppercase tracking-widest">
                {events.length} Events
              </span>
            )}
          </div>
          <div className="w-64">
             <Input placeholder="Search schedule..." variant="transparent" aria-label="Search schedule" />
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
              <Table.Column key="location" id="location" className="text-gravel uppercase text-[10px] tracking-widest font-black">Location</Table.Column>
              <Table.Column key="status" id="status" className="text-gravel uppercase text-[10px] tracking-widest font-black">Status</Table.Column>
              <Table.Column key="actions" id="actions" className="text-gravel uppercase text-[10px] tracking-widest font-black text-right">Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {loading ? (
                <Table.Row key="loading">
                  <Table.Cell className="py-6 text-center" colSpan={5}>
                    <Spinner color="current" size="sm" label="Loading events..." />
                  </Table.Cell>
                </Table.Row>
              ) : events.length === 0 ? (
                <Table.Row key="empty">
                  <Table.Cell className="py-6 text-center text-gravel" colSpan={5}>
                    No events found.
                  </Table.Cell>
                </Table.Row>
              ) : (
                events.map((event: any) => (
                <Table.Row key={event.id} id={event.id.toString()} className="border-b border-chalk hover:bg-powder/30 transition-colors">
                  <Table.Cell className="py-6">
                    <span className="font-mono text-admin-xs text-slate">EVT-{event.id.toString().padStart(3, '0')}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6">
                    <span className="font-bold text-obsidian text-admin-base">{event.name}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6">
                    <span className="text-admin-base text-gravel">{event.locationName || "Virtual"}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6">
                    <Chip 
                      size="sm" 
                      variant="soft"
                      className="font-black text-[10px] uppercase tracking-widest rounded-full bg-obsidian text-eggshell"
                    >
                      {new Date(event.endDate) > new Date() ? 'Active' : 'Past'}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="compact">Manage</Button>
                      <Button variant="compact">Archive</Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )))}
            </Table.Body>
          </Table.Content>
        </Table>
      </div>
    </div>
  );
}
