"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Card, InputGroup, Select, ListBox } from "@heroui/react";
import { Icons } from "@/components/icons";

const API_BASE = "http://localhost:3000/api/v1";

export default function Dashboard() {
  const [stats, setStats] = useState({ activeEvents: 0, liveUsers: 0, activeAlerts: 0, totalVenues: 0 });
  const [venues, setVenues] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, venuesRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE}/stats`),
          fetch(`${API_BASE}/venues`),
          fetch(`${API_BASE}/events`)
        ]);

        const statsData = await statsRes.json();
        const venuesData = await venuesRes.json();
        const eventsData = await eventsRes.json();

        setStats(statsData || { activeEvents: 0, liveUsers: 0, activeAlerts: 0, totalVenues: 0 });
        setVenues(Array.isArray(venuesData) ? venuesData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
        
        if (Array.isArray(venuesData) && venuesData.length > 0) setSelectedVenue(venuesData[0].id.toString());
        if (Array.isArray(eventsData) && eventsData.length > 0) {
           const firstEvent = eventsData.find((e: any) => e.venueId?.toString() === (Array.isArray(venuesData) ? venuesData[0]?.id.toString() : "")) || eventsData[0];
           if (firstEvent) setSelectedEvent(firstEvent.id.toString());
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEvents = useMemo(() => 
    events.filter(e => e.venueId?.toString() === selectedVenue),
    [selectedVenue, events]
  );

  const activeEvent = useMemo(() => 
    events.find(e => e.id.toString() === selectedEvent) || events[0],
    [selectedEvent, events]
  );

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-white/50 font-medium animate-pulse">Initializing Operations Center...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-8 pt-12 gap-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Lattice Global OPS</h2>
          </div>
          <h1 className="text-[32px] font-semibold text-white tracking-tight">Operations Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="ghost" className="bg-white/5 text-white/70 rounded-full border-white/5">
            <Icons.Search className="w-5 h-5" />
          </Button>
          <Button variant="primary" className="rounded-full font-bold bg-accent text-accent-foreground px-6">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </header>

      {/* Global Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-surface border border-white/5 shadow-none p-6">
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Live Users</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-white">{stats.liveUsers.toLocaleString()}</h3>
            <Chip size="sm" variant="flat" color="success" className="text-[9px] font-bold">+12%</Chip>
          </div>
        </Card>
        <Card className="bg-surface border border-white/5 shadow-none p-6">
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Active Events</p>
          <h3 className="text-3xl font-bold text-white">{stats.activeEvents}</h3>
        </Card>
        <Card className="bg-surface border border-white/5 shadow-none p-6">
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Total Venues</p>
          <h3 className="text-3xl font-bold text-white">{stats.totalVenues}</h3>
        </Card>
        <Card className="bg-surface border border-white/5 shadow-none p-6 bg-danger/5 border-danger/20">
          <p className="text-[10px] text-danger/50 font-black uppercase tracking-widest mb-1">Active Alerts</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-danger">{stats.activeAlerts}</h3>
            <div className="w-2 h-2 rounded-full bg-danger animate-ping mb-2" />
          </div>
        </Card>
      </div>

      {/* Main Focus Selection */}
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 mt-2">
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
          <Icons.MapPin className="w-4 h-4 text-accent" />
          <Select 
            className="w-48"
            selectedKey={selectedVenue}
            onSelectionChange={(key) => {
              const value = key as string;
              setSelectedVenue(value);
              const firstEvent = events.find(ev => ev.venueId?.toString() === value);
              if (firstEvent) setSelectedEvent(firstEvent.id.toString());
            }}
          >
            <Select.Trigger className="bg-transparent border-none min-h-0 h-auto p-0 flex items-center gap-2 outline-none">
              <Select.Value className="text-xs font-bold text-white uppercase tracking-wider" />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="bg-surface border border-white/10 rounded-xl p-1 min-w-48">
                {venues.map((v: any) => (
                  <ListBox.Item key={v.id} id={v.id.toString()} textValue={v.name} className="flex items-center px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-white/5 cursor-pointer outline-none focus:bg-white/10">
                    {v.name}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        <Icons.ChevronRight className="w-4 h-4 text-white/10" />

        <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
          <Icons.Calendar className="w-4 h-4 text-accent" />
          <Select 
            className="w-48"
            selectedKey={selectedEvent}
            onSelectionChange={(key) => setSelectedEvent(key as string)}
          >
            <Select.Trigger className="bg-transparent border-none min-h-0 h-auto p-0 flex items-center gap-2 outline-none">
              <Select.Value className="text-xs font-bold text-white uppercase tracking-wider" />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="bg-surface border border-white/10 rounded-xl p-1 min-w-48">
                {filteredEvents.map((ev: any) => (
                  <ListBox.Item key={ev.id} id={ev.id.toString()} textValue={ev.name} className="flex items-center px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-white/5 cursor-pointer outline-none focus:bg-white/10">
                    {ev.name}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
        
        <div className="ml-auto flex items-center gap-4 px-4">
           {activeEvent && (
             <>
               <Chip size="sm" variant="dot" color="success" className="border-none text-[10px] font-bold text-white/50 uppercase">
                 Event Status: {activeEvent.type}
               </Chip>
               <span className="text-white/20 text-xs font-mono">
                 {new Date(activeEvent.startDate).toLocaleDateString()}
               </span>
             </>
           )}
        </div>
      </div>

      {/* Active Event Overview */}
      {activeEvent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-surface border border-white/5 shadow-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="p-8 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{activeEvent.name}</h3>
                  <p className="text-sm text-white/40">{activeEvent.description || "No description provided."}</p>
                </div>
                <Button variant="flat" className="rounded-full bg-white/5 text-white/60 font-bold text-[10px] uppercase">
                  Event Details
                </Button>
              </div>
              
              <div className="mt-auto grid grid-cols-3 gap-8">
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-xl font-bold text-white">45,000</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Entry Rate</p>
                  <p className="text-xl font-bold text-white">120/min</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Avg Stay</p>
                  <p className="text-xl font-bold text-white">4.2h</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-surface border border-white/5 shadow-none p-8">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Staff Connectivity</h3>
            <div className="space-y-6">
              {[
                { label: "Security Alpha", status: "Online", load: "High" },
                { label: "Medical Unit B", status: "Online", load: "Normal" },
                { label: "Entry Support", status: "Standby", load: "Low" }
              ].map((staff, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${staff.status === "Online" ? "bg-success" : "bg-warning"}`} />
                    <span className="text-sm font-medium text-white/80">{staff.label}</span>
                  </div>
                  <Chip size="sm" variant="flat" className="text-[9px] font-bold">{staff.load}</Chip>
                </div>
              ))}
            </div>
            <Button fullWidth className="mt-8 rounded-xl bg-white/5 text-white/60 font-bold py-6">
              Open Comm Center
            </Button>
          </Card>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-white/20 font-bold uppercase tracking-widest">No active event selected</p>
        </div>
      )}

      {/* Global Event List Table */}
      <div className="mt-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold text-white">Global Event Timeline</h2>
           <div className="flex gap-2">
             <Button size="sm" variant="flat" className="bg-white/5 text-white/60 rounded-full font-bold text-[10px]">ALL VENUES</Button>
             <Button size="sm" variant="flat" className="bg-accent/20 text-accent rounded-full font-bold text-[10px]">UPCOMING</Button>
           </div>
        </div>
        
        <Table
          className="bg-surface border border-white/5 shadow-none p-0 overflow-hidden rounded-3xl"
        >
          <TableContent>
            <TableHeader className="bg-white/[0.02] text-white/30 font-black text-[10px] uppercase tracking-widest border-b border-white/5 px-8 py-5">
              <TableColumn key="name">Event Name</TableColumn>
              <TableColumn key="venue">Venue</TableColumn>
              <TableColumn key="date">Start Date</TableColumn>
              <TableColumn key="type">Type</TableColumn>
              <TableColumn key="status" align="center">Status</TableColumn>
            </TableHeader>
            <TableBody>
              {events.map((item: any) => (
                <TableRow key={item.id} className="border-b border-white/5">
                  <TableCell className="px-8 py-6">
                    <span className="text-sm font-bold text-white">{item.name}</span>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <span className="text-xs text-white/40">{venues.find(v => v.id === item.venueId)?.name || "Unknown"}</span>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <span className="text-xs font-mono text-white/60">{new Date(item.startDate).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <Chip size="sm" variant="flat" className="bg-white/5 text-white/50 text-[9px] font-bold uppercase tracking-tighter">
                      {item.type}
                    </Chip>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center justify-center">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest 
                        ${new Date(item.endDate) > new Date() ? 'bg-success/10 text-success' : 'bg-white/5 text-white/30'}`}>
                        {new Date(item.endDate) > new Date() ? 'Active' : 'Past'}
                      </div>
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
