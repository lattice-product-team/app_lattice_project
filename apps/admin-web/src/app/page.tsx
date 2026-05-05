"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Table, Chip } from "@heroui/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStats, useVenues, useEvents } from "@/hooks/use-admin-data";

export default function Dashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { venues, loading: venuesLoading } = useVenues();
  const { events, loading: eventsLoading } = useEvents();

  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  useEffect(() => {
    if (venues.length > 0 && !selectedVenue) {
      setSelectedVenue(venues[0].id.toString());
    }
  }, [venues, selectedVenue]);

  const loading = statsLoading || venuesLoading || eventsLoading;

  const filteredEvents = useMemo(() => 
    events.filter((e: any) => e.venueId?.toString() === selectedVenue),
    [selectedVenue, events]
  );

  const activeEvent = useMemo(() => 
    events.find((e: any) => e.id.toString() === selectedEvent) || events[0],
    [selectedEvent, events]
  );

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-eggshell h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
        <p className="text-gravel font-medium animate-pulse uppercase tracking-widest text-admin-xs">Initializing Operations Center...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex flex-col max-w-2xl">
          <p className="text-gravel text-admin-base font-medium mb-2 uppercase tracking-widest">Global Operations Center</p>
          <h1 className="waldenburg-display text-admin-display text-obsidian leading-[1.08] mb-6">
            Architecting real-time event operations with restraint.
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="primary">
              <Icons.Plus className="w-4 h-4 mr-2" />
              Create New Event
            </Button>
            <Button variant="ghost">
              Contact Support
            </Button>
          </div>
        </div>
      </header>

      {/* Global Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-gravel text-admin-xs font-bold uppercase tracking-widest mb-4">Live Users</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-admin-xl font-bold text-obsidian">{stats?.liveUsers?.toLocaleString() ?? "0"}</h3>
            <span className="text-admin-xs font-bold text-obsidian">+12%</span>
          </div>
        </Card>
        <Card>
          <p className="text-gravel text-admin-xs font-bold uppercase tracking-widest mb-4">Active Events</p>
          <h3 className="text-admin-xl font-bold text-obsidian">{stats?.activeEvents ?? "0"}</h3>
        </Card>
        <Card>
          <p className="text-gravel text-admin-xs font-bold uppercase tracking-widest mb-4">Total Venues</p>
          <h3 className="text-admin-xl font-bold text-obsidian">{stats?.totalVenues ?? "0"}</h3>
        </Card>
        <Card className="bg-obsidian">
          <p className="text-eggshell/50 text-admin-xs font-bold uppercase tracking-widest mb-4">Active Alerts</p>
          <div className="flex items-center gap-3">
             <h3 className="text-admin-xl font-bold text-eggshell">{stats?.activeAlerts ?? "0"}</h3>
             <div className="w-2 h-2 rounded-full bg-ember animate-ping" />
          </div>
        </Card>
      </div>

      {/* Active Event Showcase */}
      {activeEvent && (
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
            <div className="lg:col-span-3 p-12 flex flex-col justify-center border-r border-chalk">
               <div className="flex items-center gap-2 mb-6">
                 <div className="w-2 h-2 rounded-full bg-signal-blue shadow-hairline" />
                 <span className="pill-label text-admin-xs text-obsidian">Live Environment</span>
               </div>
               <h2 className="waldenburg-display text-[36px] text-obsidian mb-4 leading-tight">{activeEvent.name}</h2>
               <p className="text-gravel text-admin-md leading-relaxed mb-8 max-w-md">
                 {activeEvent.description || "Comprehensive operational oversight for this venue. Type-first monitoring and severe yet warm control systems."}
               </p>
               <div className="flex gap-4">
                 <Button variant="ghost">View Venue Map</Button>
                 <Button variant="ghost">Staff Directory</Button>
               </div>
            </div>
            <div className="lg:col-span-2 p-12 bg-powder/30 space-y-12">
               <div>
                 <p className="text-gravel text-[10px] font-black uppercase tracking-widest mb-2">Estimated Capacity</p>
                 <p className="text-admin-xl font-bold text-obsidian">45,000</p>
               </div>
               <div>
                 <p className="text-gravel text-[10px] font-black uppercase tracking-widest mb-2">Entry Rate</p>
                 <p className="text-admin-xl font-bold text-obsidian">120/min</p>
               </div>
               <div className="pt-4 border-t border-chalk">
                  <p className="text-gravel text-admin-xs mb-4">Staff Connectivity</p>
                  <div className="space-y-4">
                    {["Security Alpha", "Medical Unit B"].map((staff, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-obsidian text-admin-base font-medium">{staff}</span>
                        <Chip size="sm" variant="soft" className="bg-white text-obsidian border border-chalk text-[10px] font-bold">ONLINE</Chip>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </Card>
      )}

      {/* Timeline Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-chalk pb-4">
          <h3 className="waldenburg-display text-admin-xl text-obsidian">Global Event Timeline</h3>
          <Button variant="ghost" size="sm">Read all stories</Button>
        </div>
        
        <Table
          aria-label="Global Event Timeline"
          className="bg-transparent shadow-none"
        >
          <Table.Content>
            <Table.Header>
              <Table.Column key="name" id="name" isRowHeader className="text-gravel uppercase text-[10px] tracking-widest font-black">Event Name</Table.Column>
              <Table.Column key="venue" id="venue" className="text-gravel uppercase text-[10px] tracking-widest font-black">Venue</Table.Column>
              <Table.Column key="date" id="date" className="text-gravel uppercase text-[10px] tracking-widest font-black">Start Date</Table.Column>
              <Table.Column key="status" id="status" className="text-gravel uppercase text-[10px] tracking-widest font-black text-right">Status</Table.Column>
            </Table.Header>
            <Table.Body>
              {events.map((item: any) => (
                <Table.Row key={item.id} id={item.id.toString()} className="border-b border-chalk hover:bg-powder/30 transition-colors">
                  <Table.Cell className="py-6">
                    <span className="text-admin-base font-bold text-obsidian">{item.name}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6">
                    <span className="text-admin-base text-gravel">{venues.find(v => v.id === item.venueId)?.name || "Primary Venue"}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6">
                    <span className="text-admin-sm font-medium text-slate">{new Date(item.startDate).toLocaleDateString()}</span>
                  </Table.Cell>
                  <Table.Cell className="py-6 text-right">
                    <Chip size="sm" variant="soft" className="bg-obsidian text-eggshell text-[10px] font-black uppercase rounded-full">
                      {new Date(item.endDate) > new Date() ? 'Active' : 'Past'}
                    </Chip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table>
      </section>
    </div>
  );
}
