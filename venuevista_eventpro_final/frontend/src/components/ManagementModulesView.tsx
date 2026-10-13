import React, { useMemo, useState } from 'react';
import {
  Armchair, BarChart3, Building2, Check, CreditCard, Download,
  Edit3, Filter, Gauge, Landmark, MoreHorizontal, Plus, Search, Settings2,
  ShieldCheck, Ticket, Trash2, TrendingUp, Users, Wallet, X, Save
} from 'lucide-react';

type Module = 'venues' | 'customers' | 'analytics' | 'payments' | 'settings';

interface Props { module: Module; onNavigate: (screen: string) => void; onToast?: (message: string) => void; }

const moduleMeta: Record<Module, { title: string; subtitle: string; icon: React.ElementType }> = {
  venues: { title: 'Venue Management', subtitle: 'Manage venue manifests, capacities, seating layouts and operating status.', icon: Landmark },
  customers: { title: 'Customers', subtitle: 'Search patrons, review booking activity and manage customer communication.', icon: Users },
  analytics: { title: 'Analytics', subtitle: 'Monitor sales velocity, occupancy, revenue and event performance.', icon: BarChart3 },
  payments: { title: 'Billing & Payments', subtitle: 'Review collections, upcoming settlements, refunds and transaction activity.', icon: CreditCard },
  settings: { title: 'Settings', subtitle: 'Configure EventPro defaults, notifications, security and integrations.', icon: Settings2 },
};

const venues = [
  { name: 'Jio World Convention Centre', city: 'Mumbai', capacity: '10,500', layouts: 8, status: 'Operational' },
  { name: 'D.Y. Patil Stadium', city: 'Navi Mumbai', capacity: '55,000', layouts: 3, status: 'Operational' },
  { name: 'Metro Amphitheater', city: 'Delhi NCR', capacity: '8,200', layouts: 5, status: 'Maintenance' },
  { name: 'Grand Horizon Arenas', city: 'Bengaluru', capacity: '12,400', layouts: 6, status: 'Operational' },
];
const customers = [
  { name: 'Aarav Sharma', contact: 'aarav.sharma@example.com', orders: 18, spend: '₹1,24,600', last: 'Today' },
  { name: 'Priya Mehta', contact: 'priya.mehta@example.com', orders: 11, spend: '₹76,400', last: 'Yesterday' },
  { name: 'Rohan Kapoor', contact: 'rohan.kapoor@example.com', orders: 7, spend: '₹42,800', last: 'Sep 28' },
  { name: 'Neha Verma', contact: 'neha.verma@example.com', orders: 24, spend: '₹1,86,250', last: 'Sep 27' },
];
const transactions = [
  { id: 'PAY-98241', customer: 'Aarav Sharma', event: 'Summer Beats Festival', amount: '₹8,450', method: 'UPI', status: 'Captured', date: '30 Sep, 09:12' },
  { id: 'PAY-98240', customer: 'Priya Mehta', event: 'Comedy Gala', amount: '₹4,200', method: 'Card', status: 'Captured', date: '30 Sep, 08:48' },
  { id: 'PAY-98239', customer: 'Rohan Kapoor', event: 'Tech Conference', amount: '₹12,800', method: 'Net Banking', status: 'Pending', date: '29 Sep, 22:31' },
  { id: 'PAY-98238', customer: 'Neha Verma', event: 'Business Summit', amount: '₹6,900', method: 'UPI', status: 'Refunded', date: '29 Sep, 19:06' },
];

const Stat = ({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: React.ElementType }) => (
  <div className="bg-white border border-[#ead8d5] rounded-2xl p-4 shadow-[0_2px_10px_rgba(91,55,48,0.04)]">
    <div className="flex items-center justify-between"><span className="text-[11px] font-semibold text-[#756360]">{label}</span><span className="w-8 h-8 rounded-xl bg-[#f8e7e4] text-[#7d4842] flex items-center justify-center"><Icon className="w-4 h-4" /></span></div>
    <div className="font-display text-2xl font-extrabold text-[#201a19] mt-3">{value}</div>
    <div className="text-[10px] text-[#6e5b58] mt-1">{detail}</div>
  </div>
);

export const ManagementModulesView: React.FC<Props> = ({ module, onNavigate, onToast }) => {
  const [query, setQuery] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'All' | 'Captured' | 'Pending' | 'Refunded'>('All');
  const [showModal, setShowModal] = useState(false);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ whatsapp: true, alerts: true, twoFactor: true, autoRefund: false });
  const meta = moduleMeta[module];
  const Icon = meta.icon;
  const notify = (m: string) => onToast?.(m);

  const filteredCustomers = useMemo(() => customers.filter(c => `${c.name} ${c.contact}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const filteredVenues = useMemo(() => venues.filter(v => `${v.name} ${v.city}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const filteredTransactions = useMemo(
    () => transactions.filter((transaction) => {
      const matchesQuery = `${transaction.id} ${transaction.customer} ${transaction.event}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (paymentStatus === 'All' || transaction.status === paymentStatus);
    }),
    [paymentStatus, query],
  );

  return (
    <div className="pb-24 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#756360] mb-1"><Icon className="w-3.5 h-3.5 text-[#7d4842]" /> EventPro / {meta.title}</div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">{meta.title}</h1>
          <p className="text-xs text-[#6e5b58] mt-1 max-w-2xl">{meta.subtitle}</p>
        </div>
        {module !== 'settings' && <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7d4842] text-white text-xs font-bold hover:bg-[#693a35]"><Plus className="w-3.5 h-3.5" />{module === 'venues' ? 'Add Venue' : module === 'customers' ? 'Add Customer' : module === 'payments' ? 'Record Payment' : 'Create Report'}</button>}
      </div>

      {module === 'venues' && <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3"><Stat label="Active venues" value="24" detail="22 operational today" icon={Building2}/><Stat label="Total capacity" value="2.18L" detail="Across active manifests" icon={Users}/><Stat label="Seating layouts" value="86" detail="12 updated this month" icon={Armchair}/><Stat label="Live events" value="37" detail="5 on sale now" icon={Ticket}/></div>
        <div className="bg-white border border-[#ead8d5] rounded-2xl overflow-hidden">
          <Toolbar query={query} setQuery={setQuery} placeholder="Search venues..." />
          <Table headers={['Venue','City','Capacity','Layouts','Status','Actions']}>
            {filteredVenues.map(v => <tr key={v.name} className="border-t border-[#f0e4e1] text-xs"><td className="p-4 font-bold">{v.name}</td><td className="p-4 text-[#6e5b58]">{v.city}</td><td className="p-4 tabular-nums">{v.capacity}</td><td className="p-4">{v.layouts}</td><td className="p-4"><Status text={v.status}/></td><td className="p-4"><RowActions onEdit={() => { notify(`Editing ${v.name}`); }} onDelete={() => notify(`Venue ${v.name} archived`)}/></td></tr>)}
          </Table>
        </div>
      </>}

      {module === 'customers' && <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3"><Stat label="Total customers" value="48,291" detail="+8.4% this quarter" icon={Users}/><Stat label="Active this month" value="12,804" detail="26.5% of customer base" icon={TrendingUp}/><Stat label="Repeat booking rate" value="41.8%" detail="+3.2 pts vs last quarter" icon={Ticket}/><Stat label="Lifetime GMV" value="₹18.7 Cr" detail="All completed orders" icon={Wallet}/></div>
        <div className="bg-white border border-[#ead8d5] rounded-2xl overflow-hidden"><Toolbar query={query} setQuery={setQuery} placeholder="Search name or email..."/><Table headers={['Customer','Orders','Lifetime spend','Last activity','Actions']}>{filteredCustomers.map(c => <tr key={c.contact} className="border-t border-[#f0e4e1] text-xs"><td className="p-4"><div className="font-bold">{c.name}</div><div className="text-[10px] text-[#81706d] mt-0.5">{c.contact}</div></td><td className="p-4 tabular-nums">{c.orders}</td><td className="p-4 font-bold">{c.spend}</td><td className="p-4 text-[#6e5b58]">{c.last}</td><td className="p-4"><RowActions onEdit={() => notify(`Opened ${c.name}'s profile`)} onDelete={() => notify(`Customer ${c.name} archived`)}/></td></tr>)}</Table></div>
      </>}

      {module === 'analytics' && <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3"><Stat label="Gross ticket sales" value="₹7.42 Cr" detail="+18.4% vs previous period" icon={TrendingUp}/><Stat label="Tickets sold" value="82,460" detail="74.2% of available inventory" icon={Ticket}/><Stat label="Avg. order value" value="₹3,284" detail="+6.8% month over month" icon={Wallet}/><Stat label="Occupancy" value="81.6%" detail="Across events on sale" icon={Gauge}/></div>
        <div className="grid lg:grid-cols-3 gap-4"><ChartCard title="Sales velocity" /><ChartCard title="Occupancy by event" /><ChartCard title="Revenue mix" /></div>
        <div className="bg-white border border-[#ead8d5] rounded-2xl p-5"><div className="flex items-center justify-between mb-4"><h3 className="font-display font-extrabold">Performance by event</h3><button onClick={() => notify('Analytics CSV export prepared')} className="text-xs font-bold text-[#7d4842] flex items-center gap-1"><Download className="w-3.5 h-3.5"/> Export</button></div><div className="space-y-3">{['Summer Beats Festival','Tech Conference 2026','Comedy Gala','Business Summit'].map((e,i) => <div key={e} className="grid grid-cols-[1fr_auto] gap-4 items-center"><div><div className="text-xs font-bold">{e}</div><div className="h-2 bg-[#f1e4e1] rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-[#a8655c] rounded-full" style={{width:`${[86,72,64,51][i]}%`}}/></div></div><span className="text-xs font-bold tabular-nums">{[86,72,64,51][i]}%</span></div>)}</div></div>
      </>}

      {module === 'payments' && <>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
          <section className="rounded-xl bg-[#d52b3a] p-5 text-white shadow-[0_10px_28px_rgba(177,30,45,0.16)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/75">Billing overview</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tabular-nums">₹18.42L</h2>
                <p className="mt-1 text-sm text-white/85">Captured today · 1,842 transactions</p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <CreditCard className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
              <div>
                <p className="text-[11px] font-semibold text-white/70">Pending settlement</p>
                <p className="mt-1 text-lg font-extrabold tabular-nums">₹2.18L</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white/70">Refunds this week</p>
                <p className="mt-1 text-lg font-extrabold tabular-nums">₹74.6K</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#e8e2df] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#817976]">Gateway health</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-[#211f1e]">98.7%</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0f1] px-2.5 py-1 text-[10px] font-extrabold text-[#b92231]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d52b3a]" /> Operational
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f2e9e7]">
              <div className="h-full rounded-full bg-[#d52b3a]" style={{ width: '98.7%' }} />
            </div>
            <p className="mt-2 text-xs text-[#716b68]">Payment success rate across all gateways</p>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-[#eee9e6] pt-4">
              {['UPI', 'Cards', 'Net banking'].map((method) => (
                <span key={method} className="rounded-md border border-[#eee5e2] bg-[#faf9f8] px-2.5 py-1.5 text-[11px] font-bold text-[#514946]">{method}</span>
              ))}
            </div>
          </section>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#e8e2df] bg-white">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#eee9e6] px-4 pb-4 pt-5 sm:px-5">
            <div>
              <h2 className="font-display text-lg font-extrabold text-[#211f1e]">Transactions</h2>
              <p className="mt-1 text-xs text-[#817976]">Search payments or filter by settlement status.</p>
            </div>
            <div className="flex flex-wrap gap-1 rounded-lg bg-[#f7f5f4] p-1" role="group" aria-label="Filter transactions by status">
              {(['All', 'Captured', 'Pending', 'Refunded'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={paymentStatus === status}
                  onClick={() => setPaymentStatus(status)}
                  className={`rounded-md px-3 py-1.5 text-[11px] font-bold transition-colors ${paymentStatus === status ? 'bg-[#d52b3a] text-white' : 'text-[#716b68] hover:text-[#211f1e]'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <Toolbar query={query} setQuery={setQuery} placeholder="Search transaction, customer or event..."/>
          <Table headers={['Transaction','Customer','Event','Amount','Method','Status','Time']}>
            {filteredTransactions.map((t)=><tr key={t.id} className="border-t border-[#f0eae8] text-xs"><td className="p-4 font-bold font-mono">{t.id}</td><td className="p-4">{t.customer}</td><td className="p-4 text-[#6e5b58]">{t.event}</td><td className="p-4 font-bold">{t.amount}</td><td className="p-4">{t.method}</td><td className="p-4"><Status text={t.status}/></td><td className="p-4 text-[#6e5b58]">{t.date}</td></tr>)}
            {filteredTransactions.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-sm text-[#716b68]">No transactions match these filters.</td></tr>}
          </Table>
        </div>
      </>}

      {module === 'settings' && <SettingsPanel enabled={enabled} setEnabled={setEnabled} notify={notify}/>} 

      {showModal && <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"><div className="bg-[#fff8f7] border border-[#e0c8c4] rounded-3xl max-w-md w-full p-6 shadow-2xl"><div className="flex items-center justify-between"><h3 className="font-display text-lg font-extrabold">{module === 'venues' ? 'Add venue' : module === 'customers' ? 'Add customer' : module === 'payments' ? 'Record payment' : 'Create analytics report'}</h3><button onClick={()=>setShowModal(false)}><X className="w-4 h-4"/></button></div><form onSubmit={(e)=>{e.preventDefault();setShowModal(false);notify('Saved successfully');}} className="space-y-4 mt-5"><label className="block text-xs font-bold">Name / Reference<input required className="mt-1 w-full rounded-xl border border-[#d8c2be] bg-white p-2.5 text-sm" placeholder="Enter value"/></label><label className="block text-xs font-bold">Notes<textarea className="mt-1 w-full rounded-xl border border-[#d8c2be] bg-white p-2.5 text-sm" rows={3} placeholder="Optional details"/></label><button className="w-full rounded-xl bg-[#7d4842] text-white py-2.5 text-xs font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4"/>Save</button></form></div></div>}
    </div>
  );
};

function Toolbar({query,setQuery,placeholder}:{query:string;setQuery:(v:string)=>void;placeholder:string}) { return <div className="p-4 flex flex-wrap items-center gap-2"><div className="relative flex-1 min-w-[220px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#857370]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder} className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#e5d3cf] bg-[#fffdfc] text-xs outline-none focus:border-[#a8655c]"/></div><button className="px-3 py-2 rounded-xl border border-[#e5d3cf] text-xs font-bold flex items-center gap-1.5" onClick={()=>setQuery('')}><Filter className="w-3.5 h-3.5"/>Clear</button></div> }
function Table({headers,children}:{headers:string[];children:React.ReactNode}) { return <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead><tr className="bg-[#fbf2f0] text-[10px] uppercase tracking-wider text-[#756360]">{headers.map(h=><th key={h} className="p-3.5 font-bold">{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div> }
function Status({text}:{text:string}) { const good=['Operational','Captured','Paid','Enabled'].includes(text); const warn=['Pending','Maintenance'].includes(text); return <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold ${good?'bg-[#e4f2eb] text-[#28644d]':warn?'bg-[#fff1d8] text-[#8a5a17]':'bg-[#f7dfdc] text-[#8a4038]'}`}>{text}</span> }
function RowActions({onEdit,onDelete}:{onEdit:()=>void;onDelete:()=>void}) { return <div className="flex gap-1"><button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-[#f5e5e2] text-[#6e5b58]" title="Edit"><Edit3 className="w-3.5 h-3.5"/></button><button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-[#f5e5e2] text-[#9a4a42]" title="Archive"><Trash2 className="w-3.5 h-3.5"/></button></div> }
function ChartCard({title}:{title:string}) { const vals=[38,55,48,72,64,84,78,91,86,96]; return <div className="bg-white border border-[#ead8d5] rounded-2xl p-4"><div className="flex justify-between items-center"><h3 className="font-display text-sm font-extrabold">{title}</h3><MoreHorizontal className="w-4 h-4 text-[#857370]"/></div><div className="h-36 mt-5 flex items-end gap-1.5">{vals.map((v,i)=><div key={i} className="flex-1 bg-[#d9aaa4] rounded-t-md hover:bg-[#a8655c] transition-colors" style={{height:`${v}%`}}/>)}</div><div className="flex justify-between text-[9px] text-[#8a7773] mt-2"><span>01 Sep</span><span>15 Sep</span><span>30 Sep</span></div></div> }
function SettingsPanel({enabled,setEnabled,notify}:{enabled:Record<string,boolean>;setEnabled:React.Dispatch<React.SetStateAction<Record<string,boolean>>>;notify:(m:string)=>void}) { const toggle=(k:string)=>setEnabled(e=>({...e,[k]:!e[k]})); return <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-4"><div className="bg-white border border-[#ead8d5] rounded-2xl p-5 space-y-5"><div><h3 className="font-display font-extrabold">Platform preferences</h3><p className="text-[11px] text-[#756360] mt-1">Default controls for the EventPro operations team.</p></div>{[['whatsapp','WhatsApp ticket notifications','Send booking confirmations and seat changes.'],['alerts','Operational alerts','Notify admins about inventory and payment exceptions.'],['twoFactor','Two-factor authentication','Require 2FA for admin accounts.'],['autoRefund','Automatic refunds','Automatically process approved cancellation refunds.']].map(([key,title,desc])=><div key={key} className="flex items-center justify-between gap-4 py-3 border-t border-[#f0e4e1]"><div><div className="text-xs font-bold">{title}</div><div className="text-[10px] text-[#81706d] mt-1">{desc}</div></div><button onClick={()=>toggle(key)} className={`w-10 h-6 rounded-full p-1 transition-colors ${enabled[key]?'bg-[#7d4842]':'bg-[#d9ccca]'}`}><span className={`block w-4 h-4 bg-white rounded-full transition-transform ${enabled[key]?'translate-x-4':'translate-x-0'}`}/></button></div>)}</div><div className="bg-white border border-[#ead8d5] rounded-2xl p-5 space-y-4"><h3 className="font-display font-extrabold">Security & integrations</h3>{['Payment gateway: Razorpay','Messaging: WhatsApp Business','Analytics: EventPro Metrics','Audit logs: Enabled'].map(x=><div key={x} className="p-3 rounded-xl bg-[#fbf2f0] text-xs font-semibold flex items-center justify-between"><span>{x}</span><Check className="w-4 h-4 text-[#2d765a]"/></div>)}<button onClick={()=>notify('Settings saved successfully')} className="w-full mt-2 py-2.5 rounded-xl bg-[#7d4842] text-white text-xs font-bold">Save changes</button></div></div> }
