import React, { useState } from 'react';
import {
  LayoutGrid,
  Ticket,
  Landmark,
  Armchair,
  FileSpreadsheet,
  Users,
  TrendingUp,
  CreditCard,
  SlidersHorizontal,
  Bell,
  Moon,
  Sun,
  HelpCircle,
  Search,
  Calendar,
  ChevronDown,
  Plus,
  ChevronsUpDown,
  Building2,
  LogIn,
  X,
  CheckCircle2,
} from 'lucide-react';

import { ShowflowLogo, ShowflowBrandSplash } from './components/ShowflowLogo';
import { DashboardView } from './components/DashboardView';
import { EventsOperationsView } from './components/EventsOperationsView';
import { SeatingEngineView } from './components/SeatingEngineView';
import { PatronCheckoutView } from './components/PatronCheckoutView';
import { PatronLoginView } from './components/PatronLoginView';
import { ManagementModulesView } from './components/ManagementModulesView';
import { EventDiscoveryView } from './components/EventDiscoveryView';
import { BookingsView } from './components/BookingsView';
import { MARKET_EVENTS, MarketEvent } from './data/events';

export type ActiveScreen =
  | 'discover'
  | 'dashboard'
  | 'events'
  | 'seating'
  | 'checkout'
  | 'bookings'
  | 'login'
  | 'venues'
  | 'customers'
  | 'analytics'
  | 'payments'
  | 'settings';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('login');
  const [selectedEvent, setSelectedEvent] = useState<MarketEvent>(MARKET_EVENTS[0]);
  const [selectedCluster, setSelectedCluster] = useState<string>('Mumbai · Jio World & DY Patil Arenas');
  const [showBrandSplash, setShowBrandSplash] = useState<boolean>(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState<boolean>(false);
  const [showNewVenueModal, setShowNewVenueModal] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // Switch cluster label automatically to match the reference screens or user choice
  const handleScreenChange = (screen: string) => {
    const target = screen as ActiveScreen;
    setActiveScreen(target);
    if (target === 'dashboard') {
      setSelectedCluster('Mumbai · Jio World & DY Patil Arenas');
    } else if (target === 'events' || target === 'seating' || target === 'checkout' || target === 'bookings') {
      setSelectedCluster('Navi Mumbai · Grand Horizon Arenas');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeScreen === 'discover') {
    return (
      <EventDiscoveryView
        onNavigate={handleScreenChange}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          handleScreenChange('checkout');
        }}
      />
    );
  }

  if (activeScreen === 'checkout') {
    return <PatronCheckoutView event={selectedEvent} onNavigate={handleScreenChange} />;
  }

  if (activeScreen === 'bookings') {
    return <BookingsView onNavigate={handleScreenChange} />;
  }

  // If user is on the full-screen Patron Login Portal (Screen 3), render it with a floating screen switcher
  if (activeScreen === 'login') {
    return (
      <div className="relative">
        {showBrandSplash && <ShowflowBrandSplash onClose={() => setShowBrandSplash(false)} />}
        <PatronLoginView
          onNavigate={handleScreenChange}
          onOpenBrandSplash={() => setShowBrandSplash(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f7] text-[#201a19] flex flex-col lg:flex-row">
      {showBrandSplash && <ShowflowBrandSplash onClose={() => setShowBrandSplash(false)} />}

      {toastMessage && (
        <div className="fixed bottom-16 right-5 z-50 bg-[#201a19] text-[#fbeeec] px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-[#8b4d45]/40">
          <CheckCircle2 className="w-4 h-4 text-[#ffb4a9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fff8f7] border border-[#e0c8c4] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-[#201a19]">
                Create New Live Event
              </h3>
              <button
                onClick={() => setShowCreateEventModal(false)}
                className="p-1 rounded-lg hover:bg-[#f2dfdc] text-[#6e5b58] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowCreateEventModal(false);
                handleScreenChange('events');
                triggerToast('New event production initialized in Live Event Operations');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#3b2b29] mb-1">
                  Production / Event Title
                </label>
                <input
                  type="text"
                  required
                  defaultValue="Summer Beats Festival · Mumbai 2026"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8c2be] text-[#201a19] focus:outline-none focus:border-[#8b4d45]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3b2b29] mb-1">Venue Target</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8c2be] text-[#201a19]">
                    <option>D.Y. Patil Stadium · Navi Mumbai</option>
                    <option>Jio World Garden · Mumbai</option>
                    <option>Grand Horizon Arenas · Bengaluru</option>
                    <option>HITEX Exhibition Centre · Hyderabad</option>
                    <option>Jawaharlal Nehru Stadium · Delhi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3b2b29] mb-1">
                    Manifest Capacity
                  </label>
                  <input
                    type="number"
                    defaultValue={5500}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8c2be] text-[#201a19] tabular-nums"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3e1de] text-[#3b2b29] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7d4842] text-white font-bold cursor-pointer"
                >
                  Launch Production
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Venue Modal */}
      {showNewVenueModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fff8f7] border border-[#e0c8c4] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-extrabold text-[#201a19]">
                Register New Venue Manifest
              </h3>
              <button
                onClick={() => setShowNewVenueModal(false)}
                className="p-1 rounded-lg hover:bg-[#f2dfdc] text-[#6e5b58] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowNewVenueModal(false);
                handleScreenChange('seating');
                triggerToast('Venue CAD seating grid loaded in Auditorium Engine');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-[#3b2b29] mb-1">Venue Name</label>
                <input
                  type="text"
                  required
                  defaultValue="Grand Horizon Arena"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8c2be] text-[#201a19] focus:outline-none focus:border-[#8b4d45]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3b2b29] mb-1">City / Region</label>
                  <select defaultValue="Mumbai / Navi Mumbai" className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8c2be] text-[#201a19]">
                    <option>Mumbai / Navi Mumbai</option>
                    <option>Bengaluru / Karnataka</option>
                    <option>Delhi NCR</option>
                    <option>Hyderabad / Telangana</option>
                    <option>Chennai / Tamil Nadu</option>
                    <option>Ahmedabad / Gujarat</option>
                    <option>Kochi / Kerala</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#3b2b29] mb-1">Seating Spec</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-white border border-[#d8c2be] text-[#201a19]">
                    <option>ARENA-CURVED-BOWL-V5</option>
                    <option>STADIUM-360-BOWL-V2</option>
                    <option>BLACKBOX-FLEX-HALL-V1</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewVenueModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#f3e1de] text-[#3b2b29] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7d4842] text-white font-bold cursor-pointer"
                >
                  Open Seating Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Left Sidebar Navigation (Fixed 250px on Desktop) */}
      <aside className="vv-operator-sidebar w-full lg:w-[252px] shrink-0 bg-[#f9ecea] border-b lg:border-b-0 lg:border-r border-[#ecdad6] flex flex-col justify-between lg:sticky lg:top-0 lg:h-screen select-none">
        <div className="p-4 space-y-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => setShowBrandSplash(true)}
              className="cursor-pointer"
              title="Click to preview Brand Identity Splash (Screen 1)"
            >
              <ShowflowLogo
                size="md"
                subtitle="EventPro Ticketing & Venue Mgmt"
                darkText={true}
              />
            </div>
          </div>

          {/* Cluster Selector Dropdown */}
          <button
            onClick={() =>
              setSelectedCluster((c) =>
                c === 'Mumbai · Jio World & DY Patil Arenas'
                  ? 'Navi Mumbai · Grand Horizon Arenas'
                  : c === 'Navi Mumbai · Grand Horizon Arenas'
                    ? 'Bengaluru · Grand Horizon Arenas'
                    : c === 'Bengaluru · Grand Horizon Arenas'
                      ? 'Delhi NCR · Metro Amphitheater'
                      : 'Mumbai · Jio World & DY Patil Arenas'
              )
            }
            className="w-full px-3 py-2 rounded-xl bg-[#f3dedb] hover:bg-[#ecd2ce] border border-[#e2c6c1] flex items-center justify-between gap-2 text-xs font-bold text-[#201a19] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-4 h-4 text-[#7d4842] shrink-0" />
              <span className="truncate">{selectedCluster}</span>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-[#6e5b58] shrink-0" />
          </button>

          {/* Primary Nav Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, badge: null },
              { id: 'events', label: 'Events', icon: Ticket, badge: '12 Active' },
              { id: 'venues', label: 'Venues', icon: Landmark, badge: null },
              { id: 'seating', label: 'Seating Charts', icon: Armchair, badge: null },
              { id: 'checkout', label: 'Tickets & Orders', icon: FileSpreadsheet, badge: null },
              { id: 'bookings', label: 'Bookings', icon: Ticket, badge: null },
              { id: 'customers', label: 'Customers', icon: Users, badge: null },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
              { id: 'payments', label: 'Payments', icon: CreditCard, badge: null },
              { id: 'settings', label: 'Settings', icon: SlidersHorizontal, badge: null },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleScreenChange(item.id);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#f4b8b0] text-[#380c08] shadow-2xs'
                      : 'text-[#4b3a38] hover:bg-[#f2dfdc]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp
                      className={`w-4 h-4 ${isActive ? 'text-[#5c1d16]' : 'text-[#5b4845]'}`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                        isActive
                          ? 'bg-[#fff0ee] text-[#7c3f37]'
                          : 'bg-[#f2dad6] text-[#7c3f37]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Direct Link to Patron Dark Auth Portal (Screen 3) */}
            <div className="pt-2 mt-2 border-t border-[#ecdad6]">
              <button
                onClick={() => handleScreenChange('login')}
                className="w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-bold text-[#7c3f37] bg-[#f4dfdc]/70 hover:bg-[#f2d2ce] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LogIn className="w-4 h-4 text-[#7d4842]" />
                  <span>Patron Login Portal</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#201a19] text-white">
                  Dark
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Sidebar Footer: Theme / Help + User Profile */}
        <div className="p-4 border-t border-[#ecdad6] bg-[#fff8f7]/60 space-y-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => triggerToast('All 12 venue telemetry channels nominal')}
              className="p-1.5 rounded-lg hover:bg-[#f2dfdc] text-[#4b3a38] relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7d4842] absolute top-1 right-1" />
            </button>

            <button
              onClick={() => handleScreenChange('login')}
              className="px-2.5 py-1 rounded-full bg-[#f4dfdc] hover:bg-[#eccbc6] text-[#7d4842] flex items-center gap-1.5 cursor-pointer"
              title="Switch to Dark Patron Portal"
            >
              <Moon className="w-3.5 h-3.5" />
              <Sun className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowBrandSplash(true)}
              className="p-1.5 rounded-lg hover:bg-[#f2dfdc] text-[#4b3a38] cursor-pointer"
              title="View Brand Splash"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5c3d38] to-[#201a19] text-white font-display text-xs font-bold flex items-center justify-center shrink-0 border border-[#d8c2be]">
                U
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-[#201a19] truncate">User</div>
                <div className="text-[10px] font-medium text-[#6e5b58] truncate">
                  Director of Operations
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#f4c6c0] text-[#6f251d] text-[10px] font-bold shrink-0">
              Admin
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Utility Header Bar */}
        <header className="vv-operator-header sticky top-0 z-30 bg-[#fff8f7]/95 backdrop-blur-md border-b border-[#efe0dd] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left Search + Live Pill + Date */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#7a6865] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search event"
                className="pl-8 pr-10 py-1.5 rounded-xl bg-white border border-[#e7d2ce] text-xs text-[#201a19] placeholder-[#7a6865] focus:outline-none focus:border-[#8b4d45] w-44 sm:w-52"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.2 rounded bg-[#f5deda] text-[#7c3f37] text-[10px] font-mono font-bold">
                ⌘K
              </span>
            </div>

            <button
              onClick={() => handleScreenChange('events')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faece9] border border-[#ebd5d1] text-[11px] font-bold text-[#4b3a38] hover:bg-[#f3dfdc] transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#7d4842]" />
              <span>5 Events On Sale Now</span>
            </button>

            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#faece9] border border-[#ebd5d1] text-xs font-semibold text-[#3b2b29] tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-[#7d4842]" />
              <span>Today • Oct 24, 2024</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6e5b58]" />
            </div>
          </div>

          {/* Right Action Buttons + Notifications + Avatar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowNewVenueModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f5e3e0] hover:bg-[#ebd3cf] text-[#3b2b29] text-xs font-bold border border-[#e5ceca] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Venue</span>
            </button>

            <button
              onClick={() => setShowCreateEventModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7d4842] hover:bg-[#693a35] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>

            <div className="h-5 w-px bg-[#ead8d5] mx-0.5 hidden sm:block" />

            <button
              onClick={() => triggerToast('Box office sync active — 0 alerts pending')}
              className="p-2 rounded-xl hover:bg-[#f4e4e1] text-[#3b2b29] relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7d4842] absolute top-1.5 right-1.5" />
            </button>

            <button
              onClick={() => handleScreenChange('login')}
              title="Switch to Patron Login Screen"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7d4842] to-[#201a19] text-white font-display text-xs font-bold flex items-center justify-center border border-[#d8c2be] cursor-pointer"
            >
              U
            </button>
          </div>
        </header>

        {/* Active View Content */}
        <main className="flex-1 px-6 pt-5 max-w-[1440px] w-full mx-auto">
          {activeScreen === 'dashboard' && (
            <DashboardView
              onNavigate={handleScreenChange}
              onOpenCreateEvent={() => setShowCreateEventModal(true)}
            />
          )}
          {activeScreen === 'events' && (
            <EventsOperationsView
              onNavigate={handleScreenChange}
              onOpenCreateEvent={() => setShowCreateEventModal(true)}
            />
          )}
          {activeScreen === 'seating' && (
            <SeatingEngineView onNavigate={handleScreenChange} />
          )}
          {(['venues', 'customers', 'analytics', 'payments', 'settings'] as const).includes(activeScreen as any) && (
            <ManagementModulesView
              module={activeScreen as 'venues' | 'customers' | 'analytics' | 'payments' | 'settings'}
              onNavigate={handleScreenChange}
              onToast={triggerToast}
            />
          )}
        </main>
      </div>

    </div>
  );
}
