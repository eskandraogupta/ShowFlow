import React, { useState, useMemo } from 'react';
import {
  Download,
  Plus,
  Banknote,
  Ticket,
  Calendar,
  Armchair,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  SlidersHorizontal,
  Filter,
  Columns3,
  Search,
  CloudDownload,
  ChevronLeft,
  ChevronRight,
  Building2,
  Star,
  Users,
  Drama,
  CreditCard,
  Landmark,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (screen: string) => void;
  onOpenCreateEvent: () => void;
}

type TimeRange = 'Today' | '7D' | '30D' | 'Q3 2026' | 'YTD';
type VelocityCategory = 'All Events' | 'Concerts' | 'Conferences' | 'Theater';

interface OrderItem {
  id: string;
  initials: string;
  avatarBg: string;
  name: string;
  email: string;
  eventTarget: string;
  tier: string;
  tierColor: string;
  amount: string;
  isNegative?: boolean;
  paymentRail: string;
  paymentIcon: 'upi' | 'card' | 'bank';
  fulfillment: 'Completed' | 'Pending NEFT' | 'Refunded';
}

const ORDERS_DATA: OrderItem[] = [
  {
    id: '#VV-IN98421',
    initials: 'AS',
    avatarBg: 'bg-[#e9dad7] text-[#534341]',
    name: 'Aarav Sharma',
    email: 'aarav.s@sharma.in',
    eventTarget: 'Sunburn Arena Mumbai',
    tier: '2x VIP Box',
    tierColor: 'bg-[#faece8] text-[#8b4d45]',
    amount: '₹15,000',
    paymentRail: 'UPI / GPay',
    paymentIcon: 'upi',
    fulfillment: 'Completed',
  },
  {
    id: '#VV-IN98420',
    initials: 'RD',
    avatarBg: 'bg-[#e9dad7] text-[#534341]',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@fintech.co.in',
    eventTarget: 'India Tech Summit Bengaluru',
    tier: '4x Gen. Adm',
    tierColor: 'bg-[#f4e7e5] text-[#5d403d]',
    amount: '₹9,996',
    paymentRail: 'RuPay / HDFC',
    paymentIcon: 'card',
    fulfillment: 'Completed',
  },
  {
    id: '#VV-IN98419',
    initials: 'VM',
    avatarBg: 'bg-[#e9dad7] text-[#534341]',
    name: 'Vikram Malhotra',
    email: 'malhotra.v@enterprises.in',
    eventTarget: 'Global Leadership Delhi',
    tier: 'Table A-4 (8 Seats)',
    tierColor: 'bg-[#f9edd8] text-[#855c1b]',
    amount: '₹64,000',
    paymentRail: 'NEFT / RTGS',
    paymentIcon: 'bank',
    fulfillment: 'Pending NEFT',
  },
  {
    id: '#VV-IN98418',
    initials: 'PP',
    avatarBg: 'bg-[#e9dad7] text-[#534341]',
    name: 'Priya Patel',
    email: 'priya.patel@gujaratmail.com',
    eventTarget: 'Stand-Up Live: Zakir Hyd',
    tier: '2x Orch Row C',
    tierColor: 'bg-[#f4e7e5] text-[#5d403d]',
    amount: '₹3,000',
    paymentRail: 'Paytm UPI',
    paymentIcon: 'upi',
    fulfillment: 'Completed',
  },
  {
    id: '#VV-IN98417',
    initials: 'AI',
    avatarBg: 'bg-[#f4d8d6] text-[#8b3a35]',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@chennaidesign.in',
    eventTarget: 'India Tech Summit Bengaluru',
    tier: '1x VIP Pass',
    tierColor: 'bg-[#f4e7e5] text-[#5d403d]',
    amount: '-₹4,999',
    isNegative: true,
    paymentRail: 'UPI Refund',
    paymentIcon: 'upi',
    fulfillment: 'Refunded',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenCreateEvent,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [velocityCat, setVelocityCat] = useState<VelocityCategory>('All Events');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Sold Out Alert' | 'On Sale' | 'Selling Fast'>('ALL');
  const [activePage, setActivePage] = useState(1);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const triggerExport = (label: string) => {
    setExportNotice(label);
    setTimeout(() => setExportNotice(null), 2500);
  };

  const filteredOrders = useMemo(() => {
    if (!orderSearch.trim()) return ORDERS_DATA;
    const q = orderSearch.toLowerCase();
    return ORDERS_DATA.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.eventTarget.toLowerCase().includes(q) ||
        o.tier.toLowerCase().includes(q)
    );
  }, [orderSearch]);

  const upcomingMonitor = [
    {
      badge: 'Sold Out Alert',
      badgeStyle: 'bg-[#f36b7f] text-white',
      date: 'Nov 14-16, 2026',
      title: 'Sunburn Arena F...',
      venue: 'D.Y. Patil Stadium, Navi Mumbai',
      soldText: '5,200 / 5,500',
      pctText: '94.5% Sold',
      pct: 94.5,
      primaryBtn: true,
    },
    {
      badge: 'On Sale',
      badgeStyle: 'bg-transparent text-[#6f5b58]',
      date: 'Dec 5, 2026',
      title: 'India Tech Expo 2...',
      venue: 'Jio World Convention Centre, Mumbai',
      soldText: '3,120 / 4,000',
      pctText: '78.0% Sold',
      pct: 78.0,
      primaryBtn: false,
    },
    {
      badge: 'Selling Fast',
      badgeStyle: 'bg-[#faecd2] text-[#9b6a1d]',
      date: 'Dec 18, 2026',
      title: 'Stand-Up Live: Z...',
      venue: 'Jawaharlal Nehru Stadium, Delhi-NCR',
      soldText: '1,450 / 1,500',
      pctText: '96.6% Sold',
      pct: 96.6,
      primaryBtn: false,
    },
    {
      badge: 'On Sale',
      badgeStyle: 'bg-transparent text-[#6f5b58]',
      date: 'Jan 12-14, 2027',
      title: 'Global Business ...',
      venue: 'HITEX Exhibition Centre, Hyderabad',
      soldText: '820 / 1,200',
      pctText: '68.3% Sold',
      pct: 68.3,
      primaryBtn: false,
    },
  ].filter((item) => statusFilter === 'ALL' || item.badge === statusFilter);

  return (
    <div className="vv-dashboard space-y-6 pb-10">
      {exportNotice && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#201a19] text-[#fbeeec] px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border border-[#8b4d45]/40">
          <CloudDownload className="w-4 h-4 text-[#ffb4a9]" />
          <span>{exportNotice} generated and downloaded</span>
        </div>
      )}

      {/* Top Welcome Banner Card */}
      <div className="vv-dashboard-intro bg-[#f9ecea] border border-[#ebd9d6] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d9ef72]" />
            <span>SHOWFLOW · LIVE OPERATIONS</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight flex items-center gap-2">
            The room is filling.
          </h1>
          <p className="text-sm mt-1.5">
            Your events, revenue, and seat inventory at a glance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center lg:flex-col lg:items-end gap-2.5">
          {/* Time Range Tabs */}
          <div className="inline-flex items-center bg-[#f2dfdc] p-1 rounded-lg border border-[#e5ceca]">
            {(['Today', '7D', '30D', 'Q3 2026', 'YTD'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  timeRange === range
                    ? 'bg-[#b86b62] text-white shadow-xs'
                    : 'text-[#5b4845] hover:text-[#201a19]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => triggerExport(`Operational Summary (${timeRange}).pdf`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-semibold border border-[#e0c8c4] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Summary</span>
            </button>
            <button
              onClick={onOpenCreateEvent}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7d4842] hover:bg-[#693a35] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 KPI Cards Row */}
      <div className="vv-dashboard-kpis grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* KPI 1: TOTAL GROSS REVENUE */}
        <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#8b4d45] rounded-r" />
          <div className="flex items-start justify-between pl-2">
            <span className="text-[11px] font-bold tracking-wider text-[#63514f] uppercase leading-tight">
              TOTAL GROSS
              <br />
              REVENUE
            </span>
            <Banknote className="w-4 h-4 text-[#63514f]" />
          </div>
          <div className="pl-2 my-3">
            <div className="font-display text-3xl font-extrabold text-[#201a19] tabular-nums leading-tight">
              {timeRange === 'Today' ? '₹68.4 L' : timeRange === '7D' ? '₹2.15 Cr' : '₹7.42 Cr'}
            </div>
            <p className="text-xs text-[#6e5b58] mt-1">Gross volume (incl. 18% GST)</p>
          </div>
          <div className="pl-2 flex items-center justify-between pt-2 border-t border-[#efe0dd]">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3a2a28]">
              <TrendingUp className="w-3.5 h-3.5 text-[#7d4842]" />
              <span className="tabular-nums">+18.4%</span>
            </span>
            <svg className="w-20 h-5" viewBox="0 0 80 20" fill="none">
              <path
                d="M2 16 L22 14 L40 16 L62 9 L78 5"
                stroke="#8b4d45"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* KPI 2: TICKETS SOLD */}
        <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#8b4d45] rounded-r" />
          <div className="flex items-start justify-between pl-2">
            <span className="text-[11px] font-bold tracking-wider text-[#63514f] uppercase">
              TICKETS SOLD
            </span>
            <Ticket className="w-4 h-4 text-[#63514f]" />
          </div>
          <div className="pl-2 my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-extrabold text-[#201a19] tabular-nums">
                14,820
              </span>
              <span className="text-sm text-[#7a6663] font-medium">/</span>
            </div>
            <div className="text-xs font-medium text-[#6e5b58] tabular-nums mt-0.5">18.5k</div>
            <div className="w-full h-1.5 bg-[#ead8d5] rounded-full overflow-hidden mt-2.5">
              <div className="h-full bg-[#7d4842] rounded-full" style={{ width: '80.1%' }} />
            </div>
          </div>
          <div className="pl-2 flex items-center justify-between pt-2 border-t border-[#efe0dd] text-[11px]">
            <span className="inline-flex items-center gap-1 font-semibold text-[#3a2a28] tabular-nums">
              <TrendingUp className="w-3.5 h-3.5 text-[#7d4842]" />
              +12.6%
            </span>
            <span className="font-semibold text-[#5a4744] tabular-nums">80.1% Total Fill</span>
          </div>
        </div>

        {/* KPI 3: ACTIVE EVENTS */}
        <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#9b6a1d] rounded-r" />
          <div className="flex items-start justify-between pl-2">
            <span className="text-[11px] font-bold tracking-wider text-[#63514f] uppercase">
              ACTIVE EVENTS
            </span>
            <Calendar className="w-4 h-4 text-[#63514f]" />
          </div>
          <div className="pl-2 my-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-[#201a19] tabular-nums">
                12
              </span>
              <span className="text-lg font-semibold text-[#955f20]">On Sale</span>
            </div>
            <p className="text-xs text-[#6e5b58] mt-1">4 selling out rapidly (&gt;90%)</p>
          </div>
          <div className="pl-2 flex items-center justify-between pt-2 border-t border-[#efe0dd] text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#f8ead0] text-[#8a5a14] font-semibold">
              High Velocity
            </span>
            <span className="font-semibold text-[#5a4744] tabular-nums">Next: 3d</span>
          </div>
        </div>

        {/* KPI 4: INVENTORY BUFFER */}
        <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#6f5b58] rounded-r" />
          <div className="flex items-start justify-between pl-2">
            <span className="text-[11px] font-bold tracking-wider text-[#63514f] uppercase leading-tight">
              INVENTORY
              <br />
              BUFFER
            </span>
            <Armchair className="w-4 h-4 text-[#63514f]" />
          </div>
          <div className="pl-2 my-3">
            <div className="font-display text-3xl font-extrabold text-[#201a19] tabular-nums">
              3,680
            </div>
            <p className="text-xs text-[#6e5b58] mt-1">Across Mumbai, Delhi &amp; BLR</p>
          </div>
          <div className="pl-2 flex items-center justify-between pt-2 border-t border-[#efe0dd] text-[11px] font-semibold text-[#5a4744]">
            <span className="tabular-nums">19.9% Open seats</span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Building2 className="w-3.5 h-3.5" />5 Venues
            </span>
          </div>
        </div>

        {/* KPI 5: CHECKOUT CONVERSION */}
        <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#7d4842] rounded-r" />
          <div className="flex items-start justify-between pl-2">
            <span className="text-[11px] font-bold tracking-wider text-[#63514f] uppercase leading-tight">
              CHECKOUT
              <br />
              CONVERSION
            </span>
            <RefreshCw className="w-4 h-4 text-[#63514f]" />
          </div>
          <div className="pl-2 my-3">
            <div className="font-display text-3xl font-extrabold text-[#201a19] tabular-nums">
              4.82%
            </div>
            <p className="text-xs text-[#6e5b58] mt-1">Traffic to confirmed ticket</p>
          </div>
          <div className="pl-2 flex items-center justify-between pt-2 border-t border-[#efe0dd] text-[11px] font-semibold text-[#5a4744]">
            <span className="inline-flex items-center gap-0.5 text-[#3a2a28] tabular-nums">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#7d4842]" />
              +0.6% WoW
            </span>
            <span className="tabular-nums">Cart Abandon: 14%</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Revenue & Ticket Velocity (2/3) + Category Revenue (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2/3: Revenue & Ticket Velocity */}
        <div className="lg:col-span-2 bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-lg font-bold text-[#201a19] leading-snug">
                  Revenue &amp; Ticket Velocity
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#f2dad6] text-[#7c3f37] text-[11px] font-semibold">
                  Realtime
                </span>
              </div>
              <p className="text-xs text-[#6e5b58] mt-1">
                Dual-axis momentum tracking weekly gross proceeds vs volume sold
              </p>
            </div>

            <div className="inline-flex items-center bg-[#f2dfdc] p-1 rounded-lg border border-[#e5ceca] self-start">
              {(['All Events', 'Concerts', 'Conferences', 'Theater'] as VelocityCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setVelocityCat(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      velocityCat === cat
                        ? 'bg-[#f8eae8] text-[#7c3f37] shadow-2xs'
                        : 'text-[#5b4845] hover:text-[#201a19]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="bg-white/80 border border-[#eee0dd] rounded-xl p-4 relative">
            {/* Callout Tooltip Box at Week 10 */}
            <div className="hidden sm:flex items-center gap-5 bg-[#f7e7e4]/95 border border-[#e2c9c5] rounded-lg px-3.5 py-2 shadow-xs absolute top-3 right-14 z-10">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e5b58]">
                  WEEK 10 (PEAK)
                </div>
                <div className="text-xs font-extrabold text-[#7d4842] tabular-nums mt-0.5">
                  ₹82,40,000
                </div>
              </div>
              <div className="h-6 w-px bg-[#dfcac6]" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6e5b58]">
                  PASSES ISSUED
                </div>
                <div className="text-xs font-bold text-[#201a19] tabular-nums mt-0.5">
                  1,820 tkts
                </div>
              </div>
            </div>

            <svg viewBox="0 0 660 210" className="w-full h-52 overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#df573c" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#df573c" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[35, 75, 115, 155, 185].map((y) => (
                <line
                  key={y}
                  x1="15"
                  y1={y}
                  x2="645"
                  y2={y}
                  stroke="#ece2e0"
                  strokeWidth="1"
                />
              ))}

              {/* Area Fill */}
              <path
                d="M 20 165 Q 80 158, 135 152 T 250 142 T 365 130 T 480 95 T 545 65 L 640 52 L 640 185 L 20 185 Z"
                fill="url(#areaGrad)"
              />

              {/* Secondary Dashed Line (Tickets Distributed) */}
              <path
                d="M 20 175 Q 90 170, 150 163 T 280 152 T 410 135 T 545 92 L 640 78"
                fill="none"
                stroke="#72877c"
                strokeWidth="2"
                strokeDasharray="5 4"
              />

              {/* Primary Solid Line (Gross Revenue Pace) */}
              <path
                d="M 20 165 Q 80 158, 135 152 T 250 142 T 365 130 T 480 95 T 545 65 L 640 52"
                fill="none"
                stroke="#df573c"
                strokeWidth="2.5"
              />

              {/* Peak Vertical Marker at W10 (x=545) */}
              <line
                x1="545"
                y1="52"
                x2="545"
                y2="185"
                stroke="#c4b5fd"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx="545"
                cy="65"
                r="4.5"
                fill="#ffffff"
                stroke="#7d4842"
                strokeWidth="2.5"
              />
              <circle
                cx="545"
                cy="92"
                r="4"
                fill="#ffffff"
                stroke="#374151"
                strokeWidth="2"
              />

              {/* X Axis Labels W1..W12 */}
              {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'].map(
                (w, idx) => {
                  const x = 22 + idx * 56;
                  return (
                    <text
                      key={w}
                      x={x}
                      y="202"
                      textAnchor="middle"
                      className="text-[10px] fill-[#7a6865] font-mono"
                    >
                      {w}
                    </text>
                  );
                }
              )}
            </svg>
          </div>

          {/* Chart Legend Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-1 text-xs">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-2 font-semibold text-[#3a2a28]">
                <span className="w-3 h-1 rounded-full bg-[#7d4842]" />
                Gross Revenue Pace (₹ Lakhs)
              </span>
              <span className="inline-flex items-center gap-2 font-semibold text-[#5b4845]">
                <span className="w-3 h-1 rounded-full bg-[#78716c]" />
                Tickets Distributed
              </span>
            </div>
            <span className="text-[11px] text-[#7a6865] font-medium">Updated 2m ago</span>
          </div>
        </div>

        {/* Right 1/3: Category Revenue Donut */}
        <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#201a19]">Category Revenue</h2>
            <span className="w-5 h-5 rounded-full border border-[#7c6865] flex items-center justify-center text-[10px] text-[#63514f]">
              ⊕
            </span>
          </div>

          {/* Donut SVG */}
          <div className="my-5 flex items-center justify-center relative">
            <svg viewBox="0 0 180 180" className="w-44 h-44 -rotate-90">
              {/* Background Ring */}
              <circle
                cx="90"
                cy="90"
                r="66"
                fill="none"
                stroke="#f1dfdc"
                strokeWidth="20"
              />
              {/* Fan Pit Premium 38% */}
              <circle
                cx="90"
                cy="90"
                r="66"
                fill="none"
                stroke="#df573c"
                strokeWidth="20"
                strokeDasharray="157 414"
                strokeDashoffset="0"
              />
              {/* General Adm 32% */}
              <circle
                cx="90"
                cy="90"
                r="66"
                fill="none"
                stroke="#214c40"
                strokeWidth="20"
                strokeDasharray="132 414"
                strokeDashoffset="-157"
              />
              {/* VIP Lounge 22% */}
              <circle
                cx="90"
                cy="90"
                r="66"
                fill="none"
                stroke="#dceB75"
                strokeWidth="20"
                strokeDasharray="91 414"
                strokeDashoffset="-289"
              />
              {/* Early Bird 8% */}
              <circle
                cx="90"
                cy="90"
                r="66"
                fill="none"
                stroke="#f18d59"
                strokeWidth="20"
                strokeDasharray="34 414"
                strokeDashoffset="-380"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-2xl font-extrabold text-[#201a19] tabular-nums">
                ₹7.42Cr
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#6e5b58] mt-0.5">
                TOTAL REALIZED
              </span>
            </div>
          </div>

          {/* 2x2 Category Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#f4e4e1] rounded-xl p-2.5 border border-[#ead5d1]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5b4845]">
                <span className="w-2 h-2 rounded-full bg-[#e09f67]" />
                <span className="truncate">VIP Lounge / Club</span>
              </div>
              <div className="text-xs font-extrabold text-[#201a19] tabular-nums mt-1">
                ₹2,68,40,000
              </div>
              <div className="text-[11px] text-[#7a6663] tabular-nums">(22%)</div>
            </div>

            <div className="bg-[#f4e4e1] rounded-xl p-2.5 border border-[#ead5d1]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5b4845]">
                <span className="w-2 h-2 rounded-full bg-[#7d4842]" />
                <span className="truncate">Fan Pit Premium</span>
              </div>
              <div className="text-xs font-extrabold text-[#201a19] tabular-nums mt-1">
                ₹2,42,10,000
              </div>
              <div className="text-[11px] text-[#7a6663] tabular-nums">(38%)</div>
            </div>

            <div className="bg-[#f4e4e1] rounded-xl p-2.5 border border-[#ead5d1]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5b4845]">
                <span className="w-2 h-2 rounded-full bg-[#6d5c59]" />
                <span className="truncate">General Adm.</span>
              </div>
              <div className="text-xs font-extrabold text-[#201a19] tabular-nums mt-1">
                ₹1,74,50,000
              </div>
              <div className="text-[11px] text-[#7a6663] tabular-nums">(32%)</div>
            </div>

            <div className="bg-[#f4e4e1] rounded-xl p-2.5 border border-[#ead5d1]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5b4845]">
                <span className="w-2 h-2 rounded-full bg-[#8c6b3f]" />
                <span className="truncate">Early Bird Pass</span>
              </div>
              <div className="text-xs font-extrabold text-[#201a19] tabular-nums mt-1">
                ₹57,95,000
              </div>
              <div className="text-[11px] text-[#7a6663] tabular-nums">(8%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard (2/3) + Live Ticket Feed (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2/3: Ticket Revenue Leaderboard */}
        <div className="lg:col-span-2 bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-bold text-[#201a19]">
                Ticket Revenue Leaderboard
              </h2>
              <p className="text-xs text-[#6e5b58] mt-0.5">
                Progress toward sellout threshold &amp; gross yield by production
              </p>
            </div>
            <span className="text-xs font-bold text-[#5b4845]">Top 5 by Gross</span>
          </div>

          <div className="space-y-4">
            {[
              {
                name: 'Sunburn Arena Mumbai',
                badge: '95.2% Cap',
                badgeWarn: false,
                gross: '₹2,84,50,000',
                tkts: '5.8k tkts',
                pct: 95.2,
              },
              {
                name: 'India Tech Summit Bengaluru',
                badge: '78.0% Cap',
                badgeWarn: false,
                gross: '₹1,78,20,000',
                tkts: '3.2k tkts',
                pct: 78.0,
              },
              {
                name: 'Global Leadership Conclave Delhi',
                badge: '71.5% Cap',
                badgeWarn: false,
                gross: '₹1,18,00,000',
                tkts: '940 tkts',
                pct: 71.5,
              },
              {
                name: 'Stand-Up Live: Zakir & Friends',
                badge: '97.8% Near Sellout',
                badgeWarn: true,
                gross: '₹72,40,000',
                tkts: '1.6k tkts',
                pct: 97.8,
              },
              {
                name: 'Hyderabad Classical Fusion Fest',
                badge: '56.4% Cap',
                badgeWarn: false,
                gross: '₹54,60,000',
                tkts: '1.1k tkts',
                pct: 56.4,
              },
            ].map((row) => (
              <div key={row.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#201a19]">{row.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold tabular-nums ${
                        row.badgeWarn
                          ? 'bg-[#fae3dc] text-[#9e3f35]'
                          : 'bg-[#f1dfdc] text-[#6b5855]'
                      }`}
                    >
                      {row.badge}
                    </span>
                  </div>
                  <div className="tabular-nums font-medium text-[#6e5b58]">
                    <span className="font-bold text-[#7d4842]">{row.gross}</span> / {row.tkts}
                  </div>
                </div>
                <div className="w-full h-2 bg-[#ead8d5] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#7d4842]"
                    style={{ width: `${row.pct * 0.65}%` }}
                  />
                  <div
                    className="h-full bg-[#8c6b3f]"
                    style={{ width: `${row.pct * 0.35}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1/3: Live Ticket Feed */}
        <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7d4842]" />
              <h2 className="font-display text-lg font-bold text-[#201a19]">Live Ticket Feed</h2>
            </div>
            <span className="text-xs font-medium text-[#6e5b58]">Last 15m</span>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: Star,
                name: 'Aarav Sharma',
                detail: '2x VIP Box • Sunburn Mumbai',
                amount: '+ ₹15,000',
                time: '2m ago',
              },
              {
                icon: Users,
                name: 'Rohan Deshmukh',
                detail: '4x Gen Adm • BLR Tech Summit',
                amount: '+ ₹9,996',
                time: '5m ago',
              },
              {
                icon: Building2,
                name: 'Tata Consultancy Delegation',
                detail: 'Table A-4 (8 seats) • Delhi Conclave',
                amount: '+ ₹64,000',
                time: '11m ago',
              },
              {
                icon: Drama,
                name: 'Priya Patel',
                detail: '2x Orch Club • Zakir Live Hyd',
                amount: '+ ₹3,000',
                time: '14m ago',
              },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.name}
                  className="bg-[#f4e4e1] border border-[#ead5d1] rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#ead3cf] text-[#7d4842] flex items-center justify-center shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#201a19] truncate">{item.name}</div>
                      <div className="text-[11px] text-[#6e5b58] truncate">{item.detail}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <div className="text-xs font-bold text-[#3a2a28]">{item.amount}</div>
                    <div className="text-[10px] text-[#7a6865]">{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Production Inventory Monitor */}
      <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-bold text-[#201a19]">
                Upcoming Production Inventory Monitor
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f1dfdc] text-[#5b4845] text-[11px] font-semibold">
                4 Events Monitored
              </span>
            </div>
            <p className="text-xs text-[#6e5b58] mt-0.5">
              Venue seat utilization, sales pacing, and real-time yield controls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setStatusFilter((prev) =>
                  prev === 'ALL'
                    ? 'Sold Out Alert'
                    : prev === 'Sold Out Alert'
                    ? 'Selling Fast'
                    : 'ALL'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-semibold border border-[#e0c8c4] transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Status{statusFilter !== 'ALL' ? `: ${statusFilter}` : ''}</span>
            </button>
            <button
              onClick={() => onNavigate('events')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-semibold border border-[#e0c8c4] transition-colors cursor-pointer"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {upcomingMonitor.map((ev) => (
            <div
              key={ev.title}
              className="bg-[#f5e6e3] border border-[#e7d2ce] rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] mb-2.5">
                  <span className={`px-2 py-0.5 rounded font-bold ${ev.badgeStyle}`}>
                    {ev.badge}
                  </span>
                  <span className="text-[#6e5b58] font-medium tabular-nums">{ev.date}</span>
                </div>
                <h3 className="font-display text-base font-bold text-[#201a19] truncate">
                  {ev.title}
                </h3>
                <div className="flex items-start gap-1.5 text-xs text-[#6e5b58] mt-1.5 min-h-[2.25rem]">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#7d4842]" />
                  <span>{ev.venue}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs tabular-nums mb-1.5">
                  <span className="text-[#6e5b58] font-medium">{ev.soldText}</span>
                  <span className="font-bold text-[#7d4842]">{ev.pctText}</span>
                </div>
                <div className="w-full h-1.5 bg-[#e6d0cc] rounded-full overflow-hidden mb-3.5">
                  <div
                    className="h-full bg-[#7d4842] rounded-full"
                    style={{ width: `${ev.pct}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('seating')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      ev.primaryBtn
                        ? 'bg-[#7d4842] hover:bg-[#693a35] text-white'
                        : 'bg-[#ecdad6] hover:bg-[#e2c9c4] text-[#3b2b29]'
                    }`}
                  >
                    View Seating
                  </button>
                  <button
                    onClick={() => onNavigate('checkout')}
                    title="Open Patron Seat Selection"
                    className="p-2 rounded-lg bg-[#ecdad6] hover:bg-[#e2c9c4] text-[#3b2b29] transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Processed Orders */}
      <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-lg font-bold text-[#201a19]">
              Recent Processed Orders
            </h2>
            <p className="text-xs text-[#6e5b58] mt-0.5">
              Direct checkout audits, merchant settlements, and seating assignment statuses
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#7a6865] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Filter orders..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-white border border-[#e2ccc8] text-xs text-[#201a19] placeholder-[#8c7875] focus:outline-none focus:border-[#8b4d45] w-48 sm:w-56"
              />
            </div>
            <button
              onClick={() => triggerExport('Showflow_Orders_Export.csv')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-semibold border border-[#e0c8c4] transition-colors cursor-pointer"
            >
              <CloudDownload className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ead8d5] text-[10px] font-bold uppercase tracking-wider text-[#6e5b58]">
                <th className="py-3 px-3">ORDER ID</th>
                <th className="py-3 px-3">CUSTOMER / CONTACT</th>
                <th className="py-3 px-3">EVENT TARGET</th>
                <th className="py-3 px-3">INVENTORY TIER</th>
                <th className="py-3 px-3">AMOUNT</th>
                <th className="py-3 px-3">PAYMENT RAIL</th>
                <th className="py-3 px-3">FULFILLMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#efe0dd] text-xs">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#f4e4e1]/60 transition-colors"
                >
                  <td className="py-3.5 px-3 font-mono font-bold text-[#7d4842] tabular-nums">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${order.avatarBg}`}
                      >
                        {order.initials}
                      </div>
                      <div>
                        <div className="font-bold text-[#201a19]">{order.name}</div>
                        <div className="text-[11px] text-[#6e5b58]">{order.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#3b2b29] max-w-[160px]">
                    {order.eventTarget}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${order.tierColor}`}
                    >
                      {order.tier}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 px-3 font-bold tabular-nums ${
                      order.isNegative ? 'text-[#d93848]' : 'text-[#201a19]'
                    }`}
                  >
                    {order.amount}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1.5 text-[#5b4845] font-medium">
                      {order.paymentIcon === 'bank' ? (
                        <Landmark className="w-3.5 h-3.5 text-[#7d4842]" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5 text-[#7d4842]" />
                      )}
                      <span>{order.paymentRail}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    {order.fulfillment === 'Completed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f2e2df] text-[#4b3a38] text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5c4744]" />
                        Completed
                      </span>
                    )}
                    {order.fulfillment === 'Pending NEFT' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#faecd2] text-[#8a5a14] text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9b6a1d]" />
                        Pending NEFT
                      </span>
                    )}
                    {order.fulfillment === 'Refunded' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f46476] text-white text-[11px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        Refunded
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-[#ead8d5] text-xs text-[#6e5b58]">
          <span className="font-medium tabular-nums">
            Showing {filteredOrders.length} of 248 orders logged today
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded hover:bg-[#efe0dd] text-[#6e5b58] cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p)}
                className={`w-6 h-6 rounded text-xs font-bold tabular-nums cursor-pointer ${
                  activePage === p
                    ? 'bg-[#f1dfdc] text-[#201a19]'
                    : 'text-[#6e5b58] hover:bg-[#f4e4e1]'
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-1">...</span>
            <button
              onClick={() => setActivePage(25)}
              className={`w-6 h-6 rounded text-xs font-bold tabular-nums cursor-pointer ${
                activePage === 25
                  ? 'bg-[#f1dfdc] text-[#201a19]'
                  : 'text-[#6e5b58] hover:bg-[#f4e4e1]'
              }`}
            >
              25
            </button>
            <button
              onClick={() => setActivePage((p) => Math.min(25, p + 1))}
              className="p-1.5 rounded hover:bg-[#efe0dd] text-[#6e5b58] cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
