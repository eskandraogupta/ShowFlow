import React, { useState } from 'react';
import {
  Download,
  Plus,
  Search,
  MapPin,
  Calendar,
  Building2,
  CheckCircle2,
  Edit3,
  Share2,
  PauseCircle,
  PlayCircle,
  Banknote,
  Ticket,
  Armchair,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  LayoutGrid,
  Users,
  Tag,
  Activity,
  ExternalLink,
  Copy,
  BarChart2,
  List,
  MoreVertical,
  Trash2,
  Upload,
} from 'lucide-react';

import { eventImages } from '../data/imageAssets';
import { ImageWithFallback } from './ImageWithFallback';

interface EventsOperationsViewProps {
  onNavigate: (screen: string) => void;
  onOpenCreateEvent: () => void;
}

type EventStatusFilter = 'All Statuses' | 'Published' | 'Drafts' | 'Sold Out' | 'Completed';
type SubTab =
  | 'Ticket Types & Pricing'
  | 'Overview & Run of Show'
  | 'Seating Layout Binding'
  | 'Attendee Orders'
  | 'Promo Codes'
  | 'Pace Analytics';

interface TicketTier {
  id: string;
  name: string;
  badge: string;
  badgeStyle: string;
  description: string;
  basePrice: string;
  capacity: string;
  inventoryStatus: string;
  inventoryStyle: string;
  soldCount: string;
  soldPct: string;
  pctValue: number;
  barColor: string;
}

const INITIAL_TIERS: TicketTier[] = [
  {
    id: 'tier-1',
    name: 'VIP 3-Day Platinum Pass',
    badge: 'VIP Reserved',
    badgeStyle: 'bg-[#faecd2] text-[#8a5a14]',
    description: 'Lounge access, Express entry & Dedicated artist bar',
    basePrice: '₹2,500',
    capacity: '400',
    inventoryStatus: '86 Remaining',
    inventoryStyle: 'bg-[#f8ead0] text-[#7c5313]',
    soldCount: '314 Sold',
    soldPct: '78.5%',
    pctValue: 78.5,
    barColor: 'bg-[#7d4842]',
  },
  {
    id: 'tier-2',
    name: 'Premium Orchestra Level',
    badge: 'Assigned Seat',
    badgeStyle: 'bg-[#f2dedb] text-[#7d4842]',
    description: 'Reserved seating in Rows A-K with acoustic direct line-of-sight',
    basePrice: '₹1,400',
    capacity: '1,600',
    inventoryStatus: '1,386 Sold',
    inventoryStyle: 'bg-[#f3e3e0] text-[#4b3a38]',
    soldCount: '214 Left',
    soldPct: '86.6%',
    pctValue: 86.6,
    barColor: 'bg-[#7d4842]',
  },
  {
    id: 'tier-3',
    name: 'General Admission Standing Pit',
    badge: 'GA Standing',
    badgeStyle: 'bg-[#f2dedb] text-[#6b5350]',
    description: 'Lawn access, main stage standing bowl and festival village',
    basePrice: '₹750',
    capacity: '3,000',
    inventoryStatus: '3,000 Sold',
    inventoryStyle: 'bg-[#f3e3e0] text-[#4b3a38]',
    soldCount: '0 Left',
    soldPct: '100%',
    pctValue: 100,
    barColor: 'bg-[#7d4842]',
  },
  {
    id: 'tier-4',
    name: 'Early Bird Tier 1 Special',
    badge: 'Closed',
    badgeStyle: 'bg-[#f8d7dc] text-[#b92b43]',
    description: 'Early release discount window (Ended May 1st)',
    basePrice: '₹550',
    capacity: '500',
    inventoryStatus: 'Sold Out',
    inventoryStyle: 'bg-[#f8d7dc] text-[#b92b43]',
    soldCount: '500 Sold',
    soldPct: '100%',
    pctValue: 100,
    barColor: 'bg-[#d93848]',
  },
];

export const EventsOperationsView: React.FC<EventsOperationsViewProps> = ({
  onNavigate,
  onOpenCreateEvent,
}) => {
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Ticket Types & Pricing');
  const [salesPaused, setSalesPaused] = useState(false);
  const [tiers, setTiers] = useState<TicketTier[]>(INITIAL_TIERS);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState('195.00');
  const [newTierCap, setNewTierCap] = useState('250');
  const [viewDensity, setViewDensity] = useState<'grid' | 'list'>('grid');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTierName.trim()) return;
    const added: TicketTier = {
      id: `tier-${Date.now()}`,
      name: newTierName.trim(),
      badge: 'Assigned Seat',
      badgeStyle: 'bg-[#f2dedb] text-[#7d4842]',
      description: 'Priority acoustic zone with dedicated concourse access',
      basePrice: `₹${parseFloat(newTierPrice || '150').toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      capacity: newTierCap || '250',
      inventoryStatus: `${newTierCap || '250'} Remaining`,
      inventoryStyle: 'bg-[#f8ead0] text-[#7c5313]',
      soldCount: '0 Sold',
      soldPct: '0.0%',
      pctValue: 5,
      barColor: 'bg-[#7d4842]',
    };
    setTiers((prev) => [...prev, added]);
    setNewTierName('');
    setShowAddTierModal(false);
    showToast(`Added "${added.name}" to Summer Beats Festival 2026`);
  };

  const scheduledEvents = [
    {
      id: 'evt-1',
      statusBadge: 'Published • On Sale',
      statusStyle: 'bg-[#363d4a]/85 text-white',
      venueTag: 'Jio World Convention Centre',
      soldTag: '84% Sold',
      title: 'TechConnect Global 2026',
      date: 'Aug 12–14, 2026 • 9:00 AM',
      capacityText: '2,520 / 3,000 Capacity',
      pct: 84,
      barColor: 'bg-[#7d4842]',
      grossLabel: 'Gross: ₹6,30,000',
      rightNote: '480 left',
      rightNoteColor: 'text-[#5b4845]',
      org: 'Tech Innovations Ltd',
      image: eventImages.technology,
      category: 'Published',
    },
    {
      id: 'evt-2',
      statusBadge: 'Sold Out',
      statusStyle: 'bg-[#e63956] text-white',
      venueTag: 'NCPA, Nariman Point',
      soldTag: '100% Sold',
      title: 'Stand-Up Comedy Gala Night',
      date: 'Sep 04, 2026 • 8:00 PM',
      capacityText: '1,200 / 1,200 Capacity',
      pct: 100,
      barColor: 'bg-[#c92a42]',
      grossLabel: 'Gross: ₹84,000',
      rightNote: 'Waitlist: 312',
      rightNoteColor: 'text-[#c92a42]',
      org: 'LaughTrack Pro',
      image: eventImages.comedy,
      category: 'Sold Out',
    },
    {
      id: 'evt-3',
      statusBadge: 'Draft Mode',
      statusStyle: 'bg-[#49423e]/85 text-white',
      venueTag: 'BIEC, Bengaluru',
      soldTag: 'Unpublished',
      title: 'Business Leadership Summit',
      date: 'Oct 15, 2026 • 8:30 AM',
      capacityText: '850 Planned Seats',
      pct: 18,
      barColor: 'bg-[#dfcac6]',
      grossLabel: 'Target: ₹2,12,500',
      rightNote: 'Pending Tier Review',
      rightNoteColor: 'text-[#9b6a1d]',
      org: 'Apex Forum Inc',
      image: eventImages.summit,
      category: 'Drafts',
    },
    {
      id: 'evt-4',
      statusBadge: 'Published • On Sale',
      statusStyle: 'bg-[#363d4a]/85 text-white',
      venueTag: 'Jio World Garden',
      soldTag: '62% Sold',
      title: 'Symphony Under the Stars',
      date: 'Nov 01, 2026 • 7:30 PM',
      capacityText: '2,170 / 3,500 Capacity',
      pct: 62,
      barColor: 'bg-[#8c6b3f]',
      grossLabel: 'Gross: ₹1,95,300',
      rightNote: '1,330 left',
      rightNoteColor: 'text-[#5b4845]',
      org: 'Philharmonic Trust',
      image: eventImages.lounge,
      category: 'Published',
    },
  ].filter((ev) => {
    const matchesStatus =
      statusFilter === 'All Statuses' ||
      (statusFilter === 'Published' && ev.category === 'Published') ||
      (statusFilter === 'Drafts' && ev.category === 'Drafts') ||
      (statusFilter === 'Sold Out' && ev.category === 'Sold Out');
    const matchesQuery =
      !searchQuery.trim() ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venueTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-12">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#201a19] text-[#fbeeec] px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border border-[#8b4d45]/40">
          <CheckCircle2 className="w-4 h-4 text-[#ffb4a9]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Add Tier Modal */}
      {showAddTierModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fff8f7] border border-[#e0c8c4] rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="font-display text-lg font-bold text-[#201a19]">
              Add Ticket Tier Configuration
            </h3>
            <p className="text-xs text-[#6e5b58] mt-1">
              Configure a new pricing tier for Summer Beats Festival 2026
            </p>
            <form onSubmit={handleAddTier} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#3b2b29] mb-1">
                  Tier Name &amp; Package Label
                </label>
                <input
                  type="text"
                  required
                  value={newTierName}
                  onChange={(e) => setNewTierName(e.target.value)}
                  placeholder="e.g. Backstage Acoustic Lounge Pass"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#d8c2be] text-xs text-[#201a19] focus:outline-none focus:border-[#8b4d45]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3b2b29] mb-1">
                    Base Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newTierPrice}
                    onChange={(e) => setNewTierPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#d8c2be] text-xs text-[#201a19] tabular-nums focus:outline-none focus:border-[#8b4d45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3b2b29] mb-1">
                    Allocated Capacity
                  </label>
                  <input
                    type="number"
                    required
                    value={newTierCap}
                    onChange={(e) => setNewTierCap(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#d8c2be] text-xs text-[#201a19] tabular-nums focus:outline-none focus:border-[#8b4d45]"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTierModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-[#f3e1de] text-[#3b2b29] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#7d4842] text-white text-xs font-semibold cursor-pointer"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Section Header */}
      <div className="space-y-3">
        <div>
          <div className="text-[11px] font-bold tracking-wider uppercase text-[#7d5650] flex items-center gap-1.5">
            <span>OPERATIONS &amp; CATALOG MANAGEMENT •</span>
            <span className="text-[#6f362f] font-extrabold">LIVE PRODUCTION CLUSTER</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#201a19] tracking-tight mt-0.5">
            Live Event Operations
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => showToast('Manifest exported to EVT-98421-Manifest.csv')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-semibold border border-[#e0c8c4] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Manifest</span>
          </button>
          <button
            onClick={onOpenCreateEvent}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7d4842] hover:bg-[#693a35] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create New Event</span>
          </button>
        </div>

        {/* Filter Bar Box */}
        <div className="bg-[#f9ecea] border border-[#ebd9d6] rounded-2xl p-3 space-y-2.5">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { label: 'All Statuses', count: '27', dot: null },
                { label: 'Published', count: '8', dot: 'bg-[#7d4842]' },
                { label: 'Drafts', count: '2', dot: 'bg-[#7a6865]' },
                { label: 'Sold Out', count: '3', dot: 'bg-[#d93848]' },
                { label: 'Completed', count: '14', dot: null },
              ] as const
            ).map((st) => {
              const active = statusFilter === st.label;
              return (
                <button
                  key={st.label}
                  onClick={() => setStatusFilter(st.label)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#e9afa6] text-[#380c08]'
                      : 'bg-[#f3e2df] text-[#5b4845] hover:bg-[#ead5d1]'
                  }`}
                >
                  {st.dot && <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />}
                  <span>{st.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] tabular-nums ${
                      active ? 'bg-[#8b4d45] text-white' : 'text-[#6e5b58]'
                    }`}
                  >
                    {st.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Venue Dropdown + Quarter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#7a6865] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter title, artist, promoter..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-[#e2ccc8] text-xs text-[#201a19] placeholder-[#8c7875] focus:outline-none focus:border-[#8b4d45]"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f3e2df] border border-[#e2ccc8] text-xs font-semibold text-[#4b3a38]">
              <MapPin className="w-3.5 h-3.5 text-[#7d4842]" />
              <span>All Venues: Metro ...</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f3e2df] border border-[#e2ccc8] text-xs font-semibold text-[#4b3a38] tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-[#7d4842]" />
              <span>Q3 - Q4 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Featured Event Hero Card: Summer Beats Festival 2026 */}
      <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-3xl overflow-hidden shadow-xs">
        {/* Top Photographic Concert Banner with Gradient Fade */}
        <div className="relative pt-8 pb-6 px-6 overflow-hidden">
          <div className="absolute inset-0 h-52 overflow-hidden pointer-events-none">
            <ImageWithFallback
              src={eventImages.concert}
              alt="Summer Beats Festival 2026 Concert Stage"
              className="w-full h-full object-cover object-center opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e1b4b]/30 via-[#faf0ee]/80 to-[#faf0ee]" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-6">
            <div className="space-y-2">
              {/* Top status tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4dfdc] text-[#7c3f37] text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#d97757]" />
                  {salesPaused ? 'Sales Paused • Hold' : 'Published • Live On Sale'}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#f2e2df] text-[#3b2b29] text-[11px] font-mono font-bold">
                  EVENT ID: EVT-98421
                </span>
              </div>

              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-[#faecd2] text-[#8a5a14] text-[10px] font-bold mb-1">
                  High Demand Velocity
                </span>
                <h2 className="font-display text-3xl font-extrabold text-[#201a19] tracking-tight">
                  Summer Beats Festival 2026
                </h2>
              </div>

              <div className="space-y-1 text-xs text-[#5b4845] pt-1">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#7d4842]" />
                  <span>July 18–20, 2026 • 4:00 PM EDT (3-Day Pass)</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-[#7d4842]" />
                  <span>
                    Metro Amphitheater &amp; Pavilion{' '}
                    <strong className="text-[#201a19]">(Capacity: 5,500)</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8c6b3f]" />
                  <span>Horizon Live Entertainment</span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => showToast('Opening event metadata editor for EVT-98421')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-semibold border border-[#e0c8c4] transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
              <button
                onClick={() => onNavigate('checkout')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-semibold border border-[#e0c8c4] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Box Office URL</span>
              </button>
              <button
                onClick={() => {
                  setSalesPaused((p) => !p);
                  showToast(
                    !salesPaused
                      ? 'Public ticket sales paused for EVT-98421'
                      : 'Public ticket sales resumed for EVT-98421'
                  );
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-xs font-semibold transition-colors cursor-pointer ${
                  salesPaused
                    ? 'bg-[#276957] hover:bg-[#1e5244]'
                    : 'bg-[#ef4464] hover:bg-[#d93250]'
                }`}
              >
                {salesPaused ? (
                  <>
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Resume Sales</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Pause Sales</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 5 KPI Cards Inside Event Card */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3.5">
            {/* Gross Revenue */}
            <div className="bg-[#f5e5e2] border border-[#e6d0cc] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#7d4842] rounded-r" />
              <div className="flex items-center justify-between pl-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  GROSS REVENUE
                </span>
                <Banknote className="w-3.5 h-3.5 text-[#7d4842]" />
              </div>
              <div className="pl-2 my-2.5">
                <div className="font-display text-2xl font-extrabold text-[#201a19] tabular-nums">
                  ₹3,84,500
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1 tabular-nums">
                  <span className="text-[#6e5b58]">Target: ₹4,10,000</span>
                  <span className="font-bold text-[#3b2b29]">93.8%</span>
                </div>
              </div>
              <div className="pl-2">
                <div className="w-full h-1.5 bg-[#e3cac5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#7d4842] rounded-full" style={{ width: '93.8%' }} />
                </div>
              </div>
            </div>

            {/* Tickets Sold */}
            <div className="bg-[#f5e5e2] border border-[#e6d0cc] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#7d4842] rounded-r" />
              <div className="flex items-center justify-between pl-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  TICKETS SOLD
                </span>
                <Ticket className="w-3.5 h-3.5 text-[#63514f]" />
              </div>
              <div className="pl-2 my-2.5">
                <div className="font-display text-2xl font-extrabold text-[#201a19] tabular-nums">
                  5,200 <span className="text-xs font-normal text-[#6e5b58]">/ 5,500</span>
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1">
                  <span className="font-semibold text-[#4b3a38]">94.5% Manifest Filled</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#63514f]" />
                </div>
              </div>
              <div className="pl-2">
                <div className="w-full h-1.5 bg-[#e3cac5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5b4845] rounded-full" style={{ width: '94.5%' }} />
                </div>
              </div>
            </div>

            {/* Remaining Seats */}
            <div className="bg-[#f5e5e2] border border-[#e6d0cc] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#9b6a1d] rounded-r" />
              <div className="flex items-center justify-between pl-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  REMAINING SEATS
                </span>
                <Armchair className="w-3.5 h-3.5 text-[#7d4842]" />
              </div>
              <div className="pl-2 my-2.5">
                <div className="font-display text-2xl font-extrabold text-[#8a5a14] tabular-nums">
                  300
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1">
                  <span className="text-[#6e5b58]">86 VIP • 214 Standard</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#faecd2] text-[#8a5a14] text-[10px] font-bold">
                    Fast Sellout
                  </span>
                </div>
              </div>
              <div className="pl-2">
                <div className="w-full h-1.5 bg-[#e3cac5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#9b6a1d] rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>

            {/* Avg Order Value */}
            <div className="bg-[#f5e5e2] border border-[#e6d0cc] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  AVG ORDER VALUE
                </span>
                <ShoppingCart className="w-3.5 h-3.5 text-[#b08982]" />
              </div>
              <div className="my-2.5">
                <div className="font-display text-2xl font-extrabold text-[#201a19] tabular-nums">
                  ₹148.50
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1 tabular-nums">
                  <span className="text-[#6e5b58]">2.38 tickets/patron</span>
                  <span className="font-bold text-[#3b2b29]">+11.4% vs 2025</span>
                </div>
              </div>
              <div className="text-[11px] font-medium text-[#5b4845]">
                ↑ Cart add-ons tracking high
              </div>
            </div>

            {/* Refund Rate */}
            <div className="bg-[#f5e5e2] border border-[#e6d0cc] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  REFUND RATE
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#63514f]" />
              </div>
              <div className="my-2.5">
                <div className="font-display text-2xl font-extrabold text-[#201a19] tabular-nums">
                  0.2%
                </div>
                <div className="flex items-center justify-between text-[11px] mt-1">
                  <span className="text-[#6e5b58]">4 requests processed</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#ece0dd] text-[#3b2b29] text-[10px] font-bold">
                    Healthy
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#5b4845]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5b4845]" />
                <span>Well below 1.5% SLA limit</span>
              </div>
            </div>
          </div>

          {/* Sub-navigation Tabs Bar */}
          <div className="mt-5 bg-[#f4e3e0] border border-[#e5ceca] rounded-xl px-4 py-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4">
              {(
                [
                  { id: 'Ticket Types & Pricing', icon: SlidersHorizontal, badge: `${tiers.length} Tiers` },
                  { id: 'Overview & Run of Show', icon: LayoutGrid, badge: null },
                  { id: 'Seating Layout Binding', icon: Armchair, badge: null },
                  { id: 'Attendee Orders', icon: Users, badge: '2,180' },
                  { id: 'Promo Codes', icon: Tag, badge: '(14)' },
                  { id: 'Pace Analytics', icon: Activity, badge: null },
                ] as const
              ).map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'Seating Layout Binding') {
                        onNavigate('seating');
                      } else {
                        setActiveSubTab(tab.id);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 py-1.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[#8b4d45] text-[#7c3f37]'
                        : 'border-transparent text-[#5b4845] hover:text-[#201a19]'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.id}</span>
                    {tab.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums ${
                          isActive
                            ? 'bg-[#e8c6c0] text-[#6f362f]'
                            : 'bg-[#ead6d3] text-[#5b4845]'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6e5b58]">
              <span className="w-2 h-2 rounded-full bg-[#5b4845]" />
              <span>Last inventory sync 12s ago</span>
            </div>
          </div>

          {/* Two-Column Body: Ticket Tiers Configuration (2/3) + Venue Layout Binding (1/3) */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2/3: Ticket Tiers Configuration */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-base font-bold text-[#201a19]">
                    Ticket Tiers Configuration
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#f2dad6] text-[#7c3f37] text-[11px] font-bold tabular-nums">
                    {tiers.length} Configured
                  </span>
                </div>
                <button
                  onClick={() => setShowAddTierModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-semibold border border-[#e0c8c4] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tier</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#ebd9d6] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#efe0dd] text-[10px] font-bold uppercase tracking-wider text-[#6e5b58] bg-[#fdf6f5]">
                        <th className="py-3 px-4">TIER NAME &amp; PERKS</th>
                        <th className="py-3 px-3">BASE PRICE</th>
                        <th className="py-3 px-3">CAPACITY</th>
                        <th className="py-3 px-3">INVENTORY STATUS</th>
                        <th className="py-3 px-4">SOLD PACE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3e5e2] text-xs">
                      {tiers.map((t) => (
                        <tr key={t.id} className="hover:bg-[#fdf6f5] transition-colors">
                          <td className="py-4 px-4 max-w-[240px]">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#201a19] text-sm">{t.name}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.badgeStyle}`}
                              >
                                {t.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6e5b58] mt-1 leading-relaxed">
                              {t.description}
                            </p>
                          </td>
                          <td className="py-4 px-3 font-bold text-[#201a19] tabular-nums">
                            {t.basePrice}
                          </td>
                          <td className="py-4 px-3 font-medium text-[#5b4845] tabular-nums">
                            {t.capacity}
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold tabular-nums ${t.inventoryStyle}`}
                            >
                              {t.inventoryStatus}
                            </span>
                          </td>
                          <td className="py-4 px-4 min-w-[140px]">
                            <div className="flex items-center justify-between text-[11px] tabular-nums mb-1.5">
                              <span className="font-semibold text-[#3b2b29]">{t.soldCount}</span>
                              <span className="font-bold text-[#6e5b58]">{t.soldPct}</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#ead8d5] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${t.barColor}`}
                                style={{ width: `${t.pctValue}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 1/3: Venue Layout Binding */}
            <div className="bg-white border border-[#ebd9d6] rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#201a19]">
                      Venue Layout Binding
                    </h3>
                    <p className="text-[11px] font-semibold text-[#5b4845] mt-0.5">
                      Jio World Garden: Open-air Bowl Spec V2
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#ece0dd] text-[#4b3a38] text-[10px] font-bold">
                    Live Sync
                  </span>
                </div>

                {/* Mini Schematic Bowl Graphic */}
                <div className="my-4 bg-[#f9ecea] border border-[#eedbd7] rounded-xl p-5 flex flex-col items-center justify-center">
                  <div className="px-3 py-1 rounded bg-[#2a303c] text-white text-[9px] font-bold tracking-wider uppercase mb-2.5">
                    MAIN FESTIVAL STAGE
                  </div>
                  <svg viewBox="0 0 220 115" className="w-full max-w-[210px] h-28">
                    {/* VIP Golden Circle */}
                    <path
                      d="M 52 18 Q 110 8, 168 18 L 176 36 Q 110 26, 44 36 Z"
                      fill="#fbbf24"
                      opacity="0.75"
                    />
                    <text
                      x="110"
                      y="27"
                      textAnchor="middle"
                      className="text-[7px] font-bold fill-[#78350f]"
                    >
                      VIP GOLDEN CIRCLE (400)
                    </text>

                    {/* Orchestra Bowl */}
                    <path
                      d="M 36 44 Q 110 33, 184 44 L 194 68 Q 110 56, 26 68 Z"
                      fill="#a78bfa"
                      opacity="0.75"
                    />
                    <text
                      x="110"
                      y="55"
                      textAnchor="middle"
                      className="text-[7px] font-bold fill-[#4c1d95]"
                    >
                      ORCHESTRA BOWL (1,600)
                    </text>

                    {/* Lawn GA */}
                    <path
                      d="M 20 76 Q 110 64, 200 76 L 210 104 Q 110 92, 10 104 Z"
                      fill="#34d399"
                      opacity="0.75"
                    />
                    <text
                      x="110"
                      y="89"
                      textAnchor="middle"
                      className="text-[7px] font-bold fill-[#064e3b]"
                    >
                      LAWN GA (3,000)
                    </text>
                  </svg>
                </div>

                {/* Metadata Specs */}
                <div className="space-y-2.5 text-xs pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6e5b58]">Bound Manifest Chart:</span>
                    <span className="font-mono font-bold text-[11px] text-[#201a19]">
                      AUDITORIUM-V3-HYBRID.svg
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6e5b58]">Active Lockout Buffer:</span>
                    <span className="font-bold text-[#7d4842] tabular-nums">
                      10 Mins per session
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#6e5b58]">Emergency Exits &amp; ADA:</span>
                    <span className="font-semibold text-[#3b2b29] tabular-nums">
                      12 Paths Validated
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('seating')}
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#f4e3e0] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-bold border border-[#e0c8c4] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Launch Interactive Seat Editor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Catalog: Upcoming Scheduled Events */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-extrabold text-[#201a19]">
              Upcoming Scheduled Events
            </h2>
            <p className="text-xs text-[#6e5b58] mt-0.5">
              Active catalog across Mumbai, Bengaluru, and Navi Mumbai venues
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#6e5b58]">View density:</span>
            <div className="inline-flex items-center bg-[#f3e1de] p-0.5 rounded-lg border border-[#e0c8c4]">
              <button
                onClick={() => setViewDensity('grid')}
                className={`p-1.5 rounded-md cursor-pointer ${
                  viewDensity === 'grid'
                    ? 'bg-[#e5c2bc] text-[#380c08]'
                    : 'text-[#6e5b58] hover:text-[#201a19]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewDensity('list')}
                className={`p-1.5 rounded-md cursor-pointer ${
                  viewDensity === 'list'
                    ? 'bg-[#e5c2bc] text-[#380c08]'
                    : 'text-[#6e5b58] hover:text-[#201a19]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={
            viewDensity === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'
              : 'grid grid-cols-1 gap-3'
          }
        >
          {scheduledEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xs hover:border-[#d3b2ad] transition-colors"
            >
              <div>
                {/* Card Header Image */}
                <div className="relative h-36 bg-[#1e1b2e] overflow-hidden">
                  <ImageWithFallback
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Top Left Status Pill */}
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-xs ${ev.statusStyle}`}
                  >
                    {ev.statusBadge}
                  </span>

                  {/* Bottom Tags on Image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/90 text-[#201a19] text-[10px] font-bold">
                      {ev.venueTag}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/90 text-[#7d4842] text-[10px] font-bold tabular-nums">
                      {ev.soldTag}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-[#201a19] leading-snug">
                    {ev.title}
                  </h3>

                  <div className="space-y-1.5 mt-2.5 text-xs text-[#5b4845]">
                    <div className="flex items-center gap-1.5 tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-[#7d4842]" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 tabular-nums">
                      <Users className="w-3.5 h-3.5 text-[#7d4842]" />
                      <span>{ev.capacityText}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[#e6d0cc] rounded-full overflow-hidden mt-3.5 mb-2">
                    <div
                      className={`h-full rounded-full ${ev.barColor}`}
                      style={{ width: `${ev.pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] tabular-nums">
                    <span className="font-bold text-[#201a19]">{ev.grossLabel}</span>
                    <span className={`font-semibold ${ev.rightNoteColor}`}>{ev.rightNote}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 border-t border-[#efe0dd] flex items-center justify-between text-[11px] text-[#5b4845]">
                <span className="font-semibold truncate max-w-[110px]">{ev.org}</span>
                <div className="flex items-center gap-2 text-[#6e5b58]">
                  <button
                    onClick={() => showToast(`Editing ${ev.title}`)}
                    title="Edit Event"
                    className="hover:text-[#201a19] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => showToast(`Duplicated ${ev.title} template`)}
                    title="Duplicate"
                    className="hover:text-[#201a19] cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('seating')}
                    title="Seating & Analytics"
                    className="hover:text-[#201a19] cursor-pointer"
                  >
                    {ev.category === 'Drafts' ? (
                      <Upload className="w-3.5 h-3.5" />
                    ) : (
                      <BarChart2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => onNavigate('checkout')}
                    title="Box Office Checkout"
                    className="hover:text-[#201a19] cursor-pointer"
                  >
                    {ev.category === 'Drafts' ? (
                      <Trash2 className="w-3.5 h-3.5" />
                    ) : (
                      <MoreVertical className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
