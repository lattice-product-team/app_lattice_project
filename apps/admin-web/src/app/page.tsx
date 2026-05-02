"use client";

import React, { useState, useMemo } from "react";
import { Button, Table, Chip, Card, InputGroup, Select, ListBox } from "@heroui/react";
import { Icons } from "@/components/icons";

// Mock Data
const VENUES = [
  { id: "V-01", name: "Circuit de Barcelona" },
  { id: "V-02", name: "Fira Gran Via" },
  { id: "V-03", name: "Parc del Fòrum" },
];

const EVENTS = [
  { id: "E-01", venueId: "V-01", name: "Formula 1 Spanish GP", status: "Live", type: "sports", attendees: "84,215", alerts: 4, claimed: "92%" },
  { id: "E-02", venueId: "V-02", name: "Sonar Music Festival", status: "Upcoming", type: "festival", attendees: "15,400", alerts: 0, claimed: "45%" },
  { id: "E-03", venueId: "V-03", name: "Primavera Sound", status: "Planning", type: "festival", attendees: "0", alerts: 0, claimed: "0%" },
  { id: "E-04", venueId: "V-02", name: "MWC Barcelona 2026", status: "Live", type: "conference", attendees: "42,800", alerts: 2, claimed: "88%" },
];

const GATES_DATA: Record<string, any[]> = {
  "E-01": [
    { id: "G-04", name: "North Entrance - Grandstand G", load: "High", wait: "22 min", status: "Open" },
    { id: "G-01", name: "Main Entrance - Paddock", load: "Low", wait: "2 min", status: "Open" },
    { id: "G-12", name: "West Gate - Pelouse Area", load: "Moderate", wait: "12 min", status: "Open" },
  ],
  "E-04": [
    { id: "H-01", name: "Hall 1 - Main Registration", load: "Moderate", wait: "8 min", status: "Open" },
    { id: "H-08", name: "Hall 8 - VIP Access", load: "Low", wait: "1 min", status: "Open" },
    { id: "S-02", name: "South Entrance - Shuttle", load: "High", wait: "15 min", status: "Open" },
  ],
  "E-02": [
    { id: "F-01", name: "Stage A - Main Access", load: "Low", wait: "2 min", status: "Open" },
    { id: "F-05", name: "Food Court Entrance", load: "Moderate", wait: "5 min", status: "Open" },
  ]
};

export default function Dashboard() {
  const [selectedVenue, setSelectedVenue] = useState<string>("V-01");
  const [selectedEvent, setSelectedEvent] = useState<string>("E-01");

  const filteredEvents = useMemo(() => 
    EVENTS.filter(e => e.venueId === selectedVenue),
    [selectedVenue]
  );

  const activeEvent = useMemo(() => 
    EVENTS.find(e => e.id === selectedEvent) || EVENTS[0],
    [selectedEvent]
  );

  const activeGates = useMemo(() => 
    GATES_DATA[selectedEvent] || [],
    [selectedEvent]
  );

  const participantLabel = activeEvent.type === "conference" ? "Attendees" : 
                         activeEvent.type === "festival" ? "Participants" : "Spectators";

  return (
    <div className="flex-1 flex flex-col p-8 pt-12 gap-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2">
            <Select 
              className="w-48"
              selectedKey={selectedVenue}
              onSelectionChange={(key) => {
                const value = key as string;
                setSelectedVenue(value);
                const firstEvent = EVENTS.find(ev => ev.venueId === value);
                if (firstEvent) setSelectedEvent(firstEvent.id);
              }}
            >
              <Select.Trigger className="bg-white/5 border border-white/10 rounded-full h-8 min-h-unit-8 flex items-center justify-between px-3 outline-none">
                <Select.Value className="text-[11px] font-bold text-white/50 uppercase tracking-wider" />
                <Select.Indicator className="text-white/20" />
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={VENUES} className="bg-surface border border-white/10 rounded-xl p-1 min-w-48">
                  {(v) => (
                    <ListBox.Item id={v.id} textValue={v.name} className="flex items-center px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-white/5 cursor-pointer outline-none focus:bg-white/10">
                      {v.name}
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
            <Icons.ChevronRight className="w-3 h-3 text-white/20" />
            <Select 
              className="w-48"
              selectedKey={selectedEvent}
              onSelectionChange={(key) => setSelectedEvent(key as string)}
            >
              <Select.Trigger className="bg-white/5 border border-white/10 rounded-full h-8 min-h-unit-8 flex items-center justify-between px-3 outline-none">
                <Select.Value className="text-[11px] font-bold text-white/50 uppercase tracking-wider" />
                <Select.Indicator className="text-white/20" />
              </Select.Trigger>
              <Select.Popover>
                <ListBox items={filteredEvents} className="bg-surface border border-white/10 rounded-xl p-1 min-w-48">
                  {(e) => (
                    <ListBox.Item id={e.id} textValue={e.name} className="flex items-center px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-white/5 cursor-pointer outline-none focus:bg-white/10">
                      {e.name}
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
          
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-semibold text-white tracking-tight">{activeEvent.name}</h1>
            <Chip 
              size="sm" 
              variant="flat" 
              color={activeEvent.status === "Live" ? "success" : activeEvent.status === "Upcoming" ? "primary" : "warning"}
              className="font-bold text-[10px] uppercase tracking-wider h-5"
            >
              {activeEvent.status}
            </Chip>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="ghost" className="bg-white/5 text-white/70 rounded-full">
            <Icons.Search className="w-5 h-5" />
          </Button>
          <Button variant="primary" className="rounded-full font-medium">
            <Icons.Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>
      </header>

      {/* Operational Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-surface border border-white/5 shadow-none p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icons.Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Active {participantLabel}</p>
              <h3 className="text-2xl font-bold text-white">{activeEvent.attendees}</h3>
            </div>
          </div>
        </Card>
        <Card className="bg-surface border border-white/5 shadow-none p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger">
              <Icons.Bell className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Incident Alerts</p>
                  <h3 className="text-2xl font-bold text-white">{activeEvent.alerts} Active</h3>
                </div>
                {activeEvent.alerts > 0 && (
                  <Chip size="sm" color="danger" variant="flat" className="font-bold text-[10px]">High</Chip>
                )}
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-surface border border-white/5 shadow-none p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
              <Icons.List className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Tickets Claimed</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-white">{activeEvent.claimed}</h3>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-surface border border-white/5 shadow-none h-64">
          <div className="p-6 flex flex-col h-full">
            <h3 className="text-sm text-white/50 mb-6">{participantLabel} Inflow (Hourly)</h3>
            <div className="flex-1 flex items-end justify-between gap-2">
              {[15, 25, 45, 80, 65, 40, 30].map((val, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-primary rounded-t-sm" style={{ height: `${val}%` }} />
                  <span className="text-[10px] text-white/30">{String(8 + i).padStart(2, '0')}:00</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="bg-surface border border-white/5 shadow-none h-64">
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-sm text-white/50">Zone Density Trend</h3>
               <span className="text-xs text-white/30">Saturation %</span>
            </div>
            {/* Density Trend Chart */}
            <div className="flex-1 w-full h-full relative">
               <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                 <polyline points="0,35 10,30 20,25 30,10 40,8 50,15 60,18 70,12 80,5 90,8 100,10" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
                 <polyline points="0,40 10,38 20,35 30,30 40,28 50,25 60,22 70,20 80,18 90,15 100,12" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white/20" />
               </svg>
               <div className="flex justify-between mt-4">
                 <span className="text-[10px] text-white/20">08:00</span>
                 <span className="text-[10px] text-white/20">11:00</span>
                 <span className="text-[10px] text-white/20">14:00</span>
               </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-semibold text-white">
            {activeEvent.type === "conference" ? "Check-in Point Status" : 
             activeEvent.type === "festival" ? "Zone Access Status" : "Gate Status Monitor"}
          </h2>
          <Chip size="sm" className="bg-white/10 text-white border-none font-medium text-[10px]">LIVE</Chip>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="bg-white/5 text-white/70 rounded-full">
              <Icons.Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" className="bg-white/5 text-white/70 rounded-full">
              <Icons.SortDesc className="w-4 h-4" />
              Sort
            </Button>
          </div>
          <InputGroup className="w-64" size="sm" variant="secondary">
            <InputGroup.Prefix>
              <Icons.Search className="w-4 h-4 text-white/50" />
            </InputGroup.Prefix>
            <InputGroup.Input 
              placeholder="Search points..." 
              className="bg-transparent border-none"
            />
          </InputGroup>
        </div>

        <Table
          classNames={{
            wrapper: "bg-surface border border-white/5 shadow-none p-0",
            th: "bg-transparent text-white/50 font-medium border-b border-white/5 px-6 py-4",
            td: "px-6 py-4 border-b border-white/5",
          }}
        >
          <TableHeader>
            <TableColumn key="id">ID</TableColumn>
            <TableColumn key="name">Location Name</TableColumn>
            <TableColumn key="load">Current Load</TableColumn>
            <TableColumn key="wait">Est. Wait</TableColumn>
            <TableColumn key="status" align="center">Status</TableColumn>
          </TableHeader>
          <TableBody items={activeGates}>
            {(gate: any) => (
              <TableRow key={gate.id}>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-white/40">{gate.id}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Icons.MapPin className="w-3 h-3 text-white/20" />
                    <span className="text-sm font-medium">{gate.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    color={gate.load === "High" ? "danger" : gate.load === "Moderate" ? "warning" : "success"}
                    className="font-bold text-[10px] uppercase tracking-wider"
                  >
                    {gate.load}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className={`text-sm ${gate.load === "High" ? "text-danger font-bold" : "text-white/60"}`}>
                    {gate.wait}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Chip 
                      size="sm" 
                      variant="dot" 
                      color={gate.status === "Open" ? "success" : "warning"}
                      className="border-none bg-transparent text-[10px] font-bold uppercase"
                    >
                      {gate.status}
                    </Chip>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
