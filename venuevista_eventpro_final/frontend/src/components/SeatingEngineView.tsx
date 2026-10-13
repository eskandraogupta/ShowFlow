import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Eye,
  Bookmark,
  RotateCcw,
  CloudUpload,
  ZoomIn,
  ZoomOut,
  Grid,
  Maximize2,
  Lock,
  Ban,
  ArrowLeftRight,
  Tag,
  Unlock,
  ShieldAlert,
  CheckCircle2,
  Armchair,
  Rows3,
  LayoutGrid,
} from 'lucide-react';

import { eventImages } from '../data/imageAssets';
import { ImageWithFallback } from './ImageWithFallback';

interface SeatingEngineViewProps {
  onNavigate: (screen: string) => void;
}

type SeatState = 'available' | 'selected' | 'reserved' | 'sold' | 'blocked' | 'ada';

interface SeatNode {
  id: string;
  row: string;
  number: number;
  section: string;
  sectionName: string;
  price: number;
  tierLabel: string;
  state: SeatState;
}

const buildInitialVipSeats = (): SeatNode[] => {
  const rows = ['A', 'B', 'C', 'D'];
  const list: SeatNode[] = [];
  rows.forEach((row) => {
    for (let num = 1; num <= 15; num++) {
      const id = `${row}-${num}`;
      let state: SeatState = 'available';
      if (row === 'A' && [2, 3, 4, 11, 12, 14].includes(num)) state = 'sold';
      if (row === 'A' && [7, 8, 9, 10].includes(num)) state = 'reserved';
      if (row === 'B' && [1, 2, 3, 4, 13, 14, 15].includes(num)) state = 'sold';
      if (row === 'B' && [10, 11].includes(num)) state = 'selected';
      if (row === 'C' && [2, 3, 8, 9, 13, 14].includes(num)) state = 'sold';
      if (row === 'C' && [7].includes(num)) state = 'reserved';
      if (row === 'D' && [1, 2, 14, 15].includes(num)) state = 'ada';
      if (row === 'D' && [6, 7, 8, 9].includes(num)) state = 'available';

      list.push({
        id,
        row,
        number: num,
        section: 'Section 101',
        sectionName: 'Orchestra Center Front',
        price: 250,
        tierLabel: 'VIP Gold + Backstage',
        state,
      });
    }
  });
  return list;
};

export const SeatingEngineView: React.FC<SeatingEngineViewProps> = ({ onNavigate }) => {
  const [engineMode, setEngineMode] = useState<'edit' | 'live' | 'hold'>('edit');
  const [selectMode, setSelectMode] = useState<'single' | 'row' | 'section'>('single');
  const [tierFilter, setTierFilter] = useState<string>('Whole venue');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [vipSeats, setVipSeats] = useState<SeatNode[]>(buildInitialVipSeats);
  const [activeSeatId, setActiveSeatId] = useState<string>('B-11');
  const [selectedIds, setSelectedIds] = useState<string[]>(['B-14', 'B-15', 'B-16', 'B-17']);
  const [selectedPricingTier, setSelectedPricingTier] = useState<string>('VIP Front Row (₹250.00)');
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const activeSeat =
    vipSeats.find((s) => s.id === activeSeatId) || {
      id: 'B-16',
      row: 'B',
      number: 16,
      section: 'Section 101',
      sectionName: 'Orchestra Center Front',
      price: 250,
      tierLabel: 'VIP Gold + Backstage',
      state: 'selected' as SeatState,
    };

  const handleSeatClick = (seat: SeatNode) => {
    setActiveSeatId(seat.id);
    if (selectMode === 'row') {
      const rowSeats = vipSeats.filter((s) => s.row === seat.row).map((s) => s.id);
      setSelectedIds(rowSeats.slice(0, 6));
      notify(`Selected Row ${seat.row} (${rowSeats.length} seats)`);
      return;
    }

    setVipSeats((prev) =>
      prev.map((s) =>
        s.id === seat.id
          ? { ...s, state: s.state === 'selected' ? 'available' : 'selected' }
          : s
      )
    );

    const displayTag = `${seat.row}-${seat.number + 5}`;
    setSelectedIds((prev) =>
      prev.includes(displayTag)
        ? prev.length > 1
          ? prev.filter((x) => x !== displayTag)
          : prev
        : [...prev.slice(-3), displayTag]
    );
  };

  const mutateActiveSeatState = (newState: SeatState, label: string) => {
    setVipSeats((prev) =>
      prev.map((s) => (s.id === activeSeatId ? { ...s, state: newState } : s))
    );
    notify(`Seat ${activeSeat.row}-${activeSeat.number + 5} updated to ${label}`);
  };

  const getSeatVisual = (seat: SeatNode) => {
    const isInspected = seat.id === activeSeatId;
    if (isInspected) {
      return 'bg-[#d9ef72] border-2 border-[#202923] shadow-[0_0_0_2px_rgba(49,87,232,0.28)] scale-125 z-10';
    }
    switch (seat.state) {
      case 'available':
        return 'bg-[#3157e8] hover:bg-[#2445c4]';
      case 'selected':
        return 'bg-[#ff7859] border border-[#202923]';
      case 'reserved':
        return 'bg-[#d9ef72]';
      case 'sold':
        return 'bg-[#d9dce5]';
      case 'blocked':
        return 'bg-[#e5e2da] text-[#68675f]';
      case 'ada':
        return 'bg-[#ffb88f] text-[#6a3424] border border-[#ff7859]/60';
    }
  };

  const unitPrice = selectedPricingTier.includes('₹250')
    ? 250
    : selectedPricingTier.includes('₹140')
    ? 140
    : selectedPricingTier.includes('₹95')
    ? 95
    : 60;

  return (
    <div className="vv-seating-workspace space-y-4 pb-10">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#201a19] text-[#fbeeec] px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border border-[#8b4d45]/40">
          <CheckCircle2 className="w-4 h-4 text-[#ffb4a9]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Breadcrumbs & Title */}
      <div className="space-y-1">
        <div className="text-[10px] font-bold tracking-wider uppercase text-[#7a6460] flex items-center gap-1.5">
          <button onClick={() => onNavigate('events')} className="hover:underline cursor-pointer">
            VENUES
          </button>
          <span>&gt;</span>
            <span>GRAND HORIZON ARENA</span>
          <span>&gt;</span>
          <span className="text-[#6f362f] font-extrabold">SUMMER BEATS FESTIVAL 2026</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#201a19] tracking-tight">
            Shape your seating plan
          </h1>
          <span className="px-2.5 py-1 rounded-full bg-[#f5deda] text-[#7c3f37] text-[11px] font-mono font-bold tabular-nums">
            LIVE VENUE PLAN · 2,450 SEATS
          </span>
        </div>
      </div>

      {/* Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center bg-[#f6e8e6] p-1 rounded-xl border border-[#e7d2ce]">
          <button
            onClick={() => setEngineMode('edit')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              engineMode === 'edit'
                ? 'bg-[#73453f] text-white shadow-xs'
                : 'text-[#5b4845] hover:text-[#201a19]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Plan layout</span>
          </button>
          <button
            onClick={() => setEngineMode('live')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              engineMode === 'live'
                ? 'bg-[#73453f] text-white shadow-xs'
                : 'text-[#5b4845] hover:text-[#201a19]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Box office</span>
          </button>
          <button
            onClick={() => setEngineMode('hold')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              engineMode === 'hold'
                ? 'bg-[#73453f] text-white shadow-xs'
                : 'text-[#5b4845] hover:text-[#201a19]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Seat holds</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setVipSeats(buildInitialVipSeats());
              setSelectedIds(['B-14', 'B-15', 'B-16', 'B-17']);
              notify('Reverted seating manifest to last published snapshot');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-bold border border-[#e0c8c4] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert</span>
          </button>
          <button
            onClick={() => notify('Published REV-4.19 Seating Grid to Live Box Office')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6e4640] hover:bg-[#593631] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Publish plan</span>
          </button>
        </div>
      </div>

      {/* Sub-toolbar: Select Mode + Tier Filter */}
      <div className="vv-plan-controls bg-[#f9ecea] border border-[#ebd9d6] rounded-2xl px-4 py-2.5 space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e5b58]">
            PLAN MODE
          </span>
          <button
            onClick={() => setSelectMode('single')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
              selectMode === 'single'
                ? 'bg-[#f2d6d0] text-[#7c3f37]'
                : 'text-[#5b4845] hover:bg-[#f1dfdc]'
            }`}
          >
            <Armchair className="w-3.5 h-3.5" />
            <span>Seat</span>
          </button>
          <button
            onClick={() => setSelectMode('row')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
              selectMode === 'row'
                ? 'bg-[#f2d6d0] text-[#7c3f37]'
                : 'text-[#5b4845] hover:bg-[#f1dfdc]'
            }`}
          >
            <Rows3 className="w-3.5 h-3.5" />
            <span>Row</span>
          </button>
          <button
            onClick={() => setSelectMode('section')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
              selectMode === 'section'
                ? 'bg-[#f2d6d0] text-[#7c3f37]'
                : 'text-[#5b4845] hover:bg-[#f1dfdc]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Section</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-[#efe0dd]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e5b58] mr-1">
            PRICE ZONE
          </span>
          {[
            { label: 'Whole venue', dot: null },
            { label: 'Front · ₹250', dot: 'bg-[#3157e8]' },
            { label: 'Orchestra · ₹140', dot: 'bg-[#ff7859]' },
            { label: 'Mezzanine · ₹95', dot: 'bg-[#d9ef72]' },
            { label: 'Balcony · ₹60', dot: 'bg-[#777b8a]' },
            { label: 'Accessible', dot: '♿' },
          ].map((tf) => (
            <button
              key={tf.label}
              onClick={() => setTierFilter(tf.label)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                tierFilter === tf.label
                  ? 'bg-[#f1dad6] text-[#201a19]'
                  : 'bg-[#f4e4e1] text-[#5b4845] hover:bg-[#ead5d1]'
              }`}
            >
              {tf.dot === '♿' ? (
                <span className="text-[10px]">♿</span>
              ) : (
                tf.dot && <span className={`w-2 h-2 rounded-full ${tf.dot}`} />
              )}
              <span>{tf.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Split: Auditorium Canvas (Left 2/3) + Active Inspector & Bulk Ops (Right 1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        {/* Left 2/3: Auditorium Canvas + 3 Bottom Metrics */}
        <div className="xl:col-span-2 space-y-4">
          <div className="vv-seatmap bg-[#fcf4f2] border border-[#ebd9d6] rounded-3xl p-5 relative overflow-hidden">
            {/* Floating Left Zoom Controls */}
            <div className="absolute top-4 left-4 z-20 bg-[#f6e6e3] border border-[#e4cbc6] rounded-xl p-1 flex flex-col items-center gap-1 shadow-xs">
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="p-1.5 rounded-lg hover:bg-[#ead3cf] text-[#3b2b29] cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                className="p-1.5 rounded-lg hover:bg-[#ead3cf] text-[#3b2b29] cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-[#5b4845] py-0.5 tabular-nums">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setShowGridLines((g) => !g)}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  showGridLines ? 'bg-[#e7c7c1] text-[#6f362f]' : 'hover:bg-[#ead3cf] text-[#3b2b29]'
                }`}
                title="Toggle Coordinate Grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1.5 rounded-lg hover:bg-[#ead3cf] text-[#3b2b29] cursor-pointer"
                title="Reset View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Top-Right Live Occupancy Pill */}
            <div className="flex justify-end mb-2">
              <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full bg-[#f6e6e3] border border-[#e4cbc6] text-xs font-semibold text-[#3b2b29] z-20">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7d4842]" />
                  <span>
                    Live Occupancy: <strong className="tabular-nums">53.4%</strong>
                  </span>
                </span>
                <span className="text-[#c9b1ad]">|</span>
                <span>
                  Gross Value: <strong className="tabular-nums text-[#201a19]">₹2,98,420</strong>
                </span>
              </div>
            </div>

            {/* Curved Stage Front Proscenium Header */}
            <div
              className="mx-auto max-w-xl transition-transform duration-150"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div className="relative overflow-hidden bg-[#17332d] border-b-4 border-[#dceB75] rounded-b-[48px] px-6 py-4 text-center shadow-xs">
                <div className="font-display text-lg font-extrabold tracking-widest uppercase text-white">
                  MAIN STAGE
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#dceB75] mt-0.5">
                  FRONT OF HOUSE · CENTRAL SIGHTLINE
                </div>
              </div>
              <div className="text-center text-[10px] font-bold tracking-wider uppercase text-[#6e5b58] mt-2">
                FLOOR PIT · CLEAR SIGHTLINE TO STAGE
              </div>

              {/* Section 101: VIP GOLD TIER (ROWS A - D) */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider px-4 mb-2.5">
                  <span className="text-[#7b5727] flex items-center gap-1">
                    <span>◆</span> CENTER FLOOR · GOLD (ROWS A–D)
                  </span>
                  <span className="text-[#5b4845] tabular-nums">
                    SECTION 101 · ₹250 / SEAT
                  </span>
                </div>

                {/* Rows A - D Seat Matrix */}
                <div className="space-y-2 flex flex-col items-center">
                  {(['A', 'B', 'C', 'D'] as const).map((rowLetter) => {
                    const rowSeats = vipSeats.filter((s) => s.row === rowLetter);
                    const leftBlock = rowSeats.slice(0, 3);
                    const centerBlock = rowSeats.slice(3, 12);
                    const rightBlock = rowSeats.slice(12, 15);

                    return (
                      <div key={rowLetter} className="flex items-center gap-4">
                        <span className="w-4 text-right text-[10px] font-bold text-[#6e5b58]">
                          {rowLetter}
                        </span>

                        {/* Left Block */}
                        <div className="flex items-center gap-1.5">
                          {leftBlock.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat)}
                              title={`Row ${seat.row} Seat ${seat.number + 5} (₹${seat.price})`}
                              style={{ translate: `0 ${Math.pow(Math.abs(seat.number - 8), 2) * 0.72}px`, rotate: `${(8 - seat.number) * 1.15}deg` }}
                              className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center transition-transform cursor-pointer ${getSeatVisual(
                                seat
                              )}`}
                            >
                              {seat.state === 'ada' ? '♿' : ''}
                            </button>
                          ))}
                        </div>

                        {/* Center Block */}
                        <div className="flex items-center gap-1.5">
                          {centerBlock.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat)}
                              title={`Row ${seat.row} Seat ${seat.number + 5} (₹${seat.price})`}
                              style={{ translate: `0 ${Math.pow(Math.abs(seat.number - 8), 2) * 0.72}px`, rotate: `${(8 - seat.number) * 1.15}deg` }}
                              className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center transition-transform cursor-pointer ${getSeatVisual(
                                seat
                              )}`}
                            />
                          ))}
                        </div>

                        {/* Right Block */}
                        <div className="flex items-center gap-1.5">
                          {rightBlock.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat)}
                              title={`Row ${seat.row} Seat ${seat.number + 5} (₹${seat.price})`}
                              style={{ translate: `0 ${Math.pow(Math.abs(seat.number - 8), 2) * 0.72}px`, rotate: `${(8 - seat.number) * 1.15}deg` }}
                              className={`w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center transition-transform cursor-pointer ${getSeatVisual(
                                seat
                              )}`}
                            >
                              {seat.state === 'ada' ? '♿' : ''}
                            </button>
                          ))}
                        </div>

                        <span className="w-4 text-left text-[10px] font-bold text-[#6e5b58]">
                          {rowLetter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Concourse Cross-walk Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px bg-[#ead8d5] flex-1" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#8c7875]">
                  MAIN LEVEL CONCOURSE CROSS-WALK • ACCESS TUNNELS A/B
                </span>
                <div className="h-px bg-[#ead8d5] flex-1" />
              </div>

              {/* Middle Bowl: Wing Left (102) + Center Orchestra (100) + Wing Right (103) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Wing Left 102 */}
                <div className="vv-seat-zone md:col-span-3 bg-[#f9ecea] border border-[#eedbd7] rounded-xl p-3 flex flex-col items-center">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#5b4845] mb-2">
                    WING LEFT (102)
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          notify(`Selected Wing Left (Section 102) Seat #${idx + 1}`)
                        }
                        className={`w-3.5 h-3.5 rounded-[3px] cursor-pointer ${
                          [0, 1, 5, 9].includes(idx)
                            ? 'bg-[#ddb1b8]'
                            : [12, 13, 14].includes(idx)
                            ? 'bg-[#6f572c]'
                            : 'bg-[#7b5853] hover:bg-[#694641]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Center Orchestra 100 */}
                <div className="vv-seat-zone vv-seat-zone-center md:col-span-6 bg-[#f9ecea] border border-[#eedbd7] rounded-xl p-3 flex flex-col items-center">
                  <div className="flex items-center justify-between w-full text-[9px] font-bold uppercase tracking-wider text-[#5b4845] mb-2 px-1">
                    <span>CENTER ORCHESTRA (SECTION 100)</span>
                    <span className="text-[#201a19] tabular-nums">₹140</span>
                  </div>
                  <div className="space-y-1.5 flex flex-col items-center">
                    {/* Top 2 rows */}
                    {[0, 1].map((r) => (
                      <div key={r} className="flex items-center gap-1.5">
                        {Array.from({ length: 10 }).map((_, c) => (
                          <button
                            key={c}
                            onClick={() =>
                              notify(
                                `Selected Center Orchestra Row ${r + 1} Seat ${c + 1} (₹140)`
                              )
                            }
                            className={`w-3.5 h-3.5 rounded-[3px] cursor-pointer ${
                              (r + c) % 3 === 0 ? 'bg-[#ddb1b8]' : 'bg-[#7b5853] hover:bg-[#694641]'
                            }`}
                          />
                        ))}
                      </div>
                    ))}

                    {/* Row 3 with FOH SOUND MIX RIG inset */}
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-[3px] bg-[#7b5853]" />
                      <span className="w-3.5 h-3.5 rounded-[3px] bg-[#7b5853]" />
                      <span className="px-2.5 py-0.5 rounded bg-[#efe0dd] border border-[#dfcac6] text-[8px] font-bold uppercase tracking-wider text-[#6e5b58]">
                        FOH SOUND MIX RIG
                      </span>
                      <span className="w-3.5 h-3.5 rounded-[3px] bg-[#7b5853]" />
                      <span className="w-3.5 h-3.5 rounded-[3px] bg-[#7b5853]" />
                    </div>

                    {/* Row 4 */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 10 }).map((_, c) => (
                        <button
                          key={c}
                          onClick={() =>
                            notify(`Selected Center Orchestra Row 4 Seat ${c + 1} (₹140)`)
                          }
                          className="w-3.5 h-3.5 rounded-[3px] bg-[#7b5853] hover:bg-[#694641] cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Wing Right 103 */}
                <div className="vv-seat-zone md:col-span-3 bg-[#f9ecea] border border-[#eedbd7] rounded-xl p-3 flex flex-col items-center">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#5b4845] mb-2">
                    WING RIGHT (103)
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          notify(`Selected Wing Right (Section 103) Seat #${idx + 1}`)
                        }
                        className={`w-3.5 h-3.5 rounded-[3px] cursor-pointer ${
                          [2, 3, 7, 11].includes(idx)
                            ? 'bg-[#ddb1b8]'
                            : [12, 13].includes(idx)
                            ? 'bg-[#6f572c]'
                            : 'bg-[#7b5853] hover:bg-[#694641]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Upper Tier: Mezzanine & Balcony Loge */}
              <div className="vv-seat-zone vv-seat-zone-upper mt-4 bg-[#f9ecea] border border-[#eedbd7] rounded-xl p-3">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-[#5b4845] mb-2 px-2">
                  <span>UPPER TIER: MEZZANINE &amp; BALCONY LOGE</span>
                  <span className="text-[#201a19] tabular-nums">₹95 – ₹60</span>
                </div>
                <div className="space-y-1.5 flex flex-col items-center">
                  {[0, 1].map((r) => (
                    <div key={r} className="flex items-center gap-1.5 flex-wrap justify-center">
                      {Array.from({ length: 14 }).map((_, c) => (
                        <button
                          key={c}
                          onClick={() =>
                            notify(`Selected Upper Mezzanine Row ${r + 1} Seat ${c + 1}`)
                          }
                          className={`w-3 h-3 rounded-[2px] cursor-pointer ${
                            c >= 4 && c <= 6
                              ? 'bg-[#ddb1b8]'
                              : 'bg-[#836864] hover:bg-[#694641]'
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Legend Bar inside Map Card */}
            <div className="mt-5 bg-[#f5e5e2] border border-[#e6d0cc] rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-4 font-semibold text-[#3b2b29]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-[3px] bg-[#7b5853]" />
                    <span>Available (1,142)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-[3px] bg-[#eb9c8f] border border-[#7d4842]" />
                    <span>Selected ({selectedIds.length})</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-[3px] bg-[#6f572c]" />
                    <span>Reserved / Hold (120)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-[3px] bg-[#ddb1b8]" />
                    <span>Sold (1,154)</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[#5b4845] font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-[3px] bg-[#ead8d5] text-[8px] flex items-center justify-center font-bold">
                      ×
                    </span>
                    <span>Blocked / Tech (30)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-[3px] bg-[#f6b8c4] text-[#9f1239] text-[8px] flex items-center justify-center font-bold">
                      ♿
                    </span>
                    <span>ADA Accessible (14)</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#6e5b58] uppercase">
                    GRID: X=428 Y=190 • SIGHTLINE: OPTIMAL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Bottom Mini Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#f7e7e4] border border-[#e7d2ce] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  VIP ORCHESTRA
                  <br />
                  PACE
                </div>
                <div className="font-display text-xl font-extrabold text-[#201a19] tabular-nums mt-1">
                  88.5% Sold
                </div>
              </div>
              <svg className="w-20 h-9" viewBox="0 0 80 36" fill="none">
                <path
                  d="M4 30 Q 28 28, 46 18 T 76 6"
                  stroke="#7d4842"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="bg-[#f7e7e4] border border-[#e7d2ce] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  MAIN BOWL INVENTORY
                </div>
                <div className="font-display text-xl font-extrabold text-[#7d4842] tabular-nums mt-1">
                  612 Avail
                </div>
              </div>
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="none" stroke="#ead5d1" strokeWidth="4" />
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  fill="none"
                  stroke="#7d4842"
                  strokeWidth="4"
                  strokeDasharray="68 95"
                />
              </svg>
            </div>

            <div className="bg-[#f7e7e4] border border-[#e7d2ce] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  HELD FOR ARTIST
                  <br />
                  VIP
                </div>
                <div className="font-display text-xl font-extrabold text-[#7b5727] tabular-nums mt-1">
                  42 Holds
                </div>
              </div>
              <button
                onClick={() => notify('Audited 42 Artist & Promoter VIP Holds')}
                className="px-3 py-1.5 rounded-lg bg-[#ecdad6] hover:bg-[#e2c9c4] text-[#3b2b29] text-[11px] font-bold cursor-pointer"
              >
                Audit
                <br />
                Holds
              </button>
            </div>
          </div>
        </div>

        {/* Right 1/3: Active Inspection Target + Bulk Operations */}
        <div className="space-y-4">
          {/* Card 1: Active Inspection Target */}
          <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-3xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e5988b]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                  ACTIVE INSPECTION
                  <br />
                  TARGET
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#e6cfcb] text-[#3b2b29] text-[10px] font-bold">
                Selected
                <br />
                (Admin)
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl font-extrabold text-[#201a19] tabular-nums">
                Seat {activeSeat.row}-{activeSeat.number + 5}
              </h2>
              <p className="text-xs text-[#6e5b58] mt-0.5">
                {activeSeat.section} • {activeSeat.sectionName}
              </p>
            </div>

            {/* Sightline Preview Image */}
            <div className="relative h-36 rounded-2xl overflow-hidden bg-[#161324] border border-[#e2c9c5]">
              <ImageWithFallback
                src={eventImages.concert}
                alt="Stage Sightline Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 text-[#201a19] text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-[#276957]" />
                <span>Sightline: 98% Direct Unobstructed</span>
              </div>
            </div>

            {/* 2x2 Seat Metadata */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <div className="text-[10px] text-[#6e5b58] font-medium">Row &amp; Position</div>
                <div className="font-bold text-[#201a19] tabular-nums mt-0.5">
                  Row {activeSeat.row} • Seat #{activeSeat.number + 5}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#6e5b58] font-medium">Current Face Value</div>
                <div className="font-bold text-[#201a19] tabular-nums mt-0.5">
                  ₹{unitPrice.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#6e5b58] font-medium">Assigned Tier</div>
                <div className="font-bold text-[#7b5727] mt-0.5">{activeSeat.tierLabel}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#6e5b58] font-medium">Internal Asset Ref</div>
                <div className="font-mono font-bold text-[#3b2b29] text-[11px] mt-0.5">
                  TCK-88219-{activeSeat.row}
                  {activeSeat.number + 5}
                </div>
              </div>
            </div>

            {/* Quick Seat Status Mutation */}
            <div className="pt-2 border-t border-[#efe0dd] space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#63514f]">
                QUICK SEAT STATUS MUTATION:
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => mutateActiveSeatState('reserved', 'VIP Hold')}
                  className="py-2 px-3 rounded-lg bg-[#f4e2de] hover:bg-[#ebd1cc] text-[#6e4615] text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Hold for VIP</span>
                </button>
                <button
                  onClick={() => mutateActiveSeatState('blocked', 'Blocked for Crew')}
                  className="py-2 px-3 rounded-lg bg-[#f4e2de] hover:bg-[#ebd1cc] text-[#b92b43] text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Block for Crew</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5b4845] mb-1">
                  Change Pricing Tier
                </label>
                <select
                  value={selectedPricingTier}
                  onChange={(e) => {
                    setSelectedPricingTier(e.target.value);
                    notify(`Updated pricing tier to ${e.target.value}`);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#e0c8c4] text-xs font-semibold text-[#201a19] focus:outline-none focus:border-[#8b4d45]"
                >
                  <option>VIP Front Row (₹250.00)</option>
                  <option>Premium Orchestra (₹140.00)</option>
                  <option>Loge &amp; Mezzanine (₹95.00)</option>
                  <option>Upper Balcony (₹60.00)</option>
                </select>
              </div>

              <button
                onClick={() =>
                  notify(`Cascaded ${selectedPricingTier} to all 15 seats in Row ${activeSeat.row}`)
                }
                className="w-full py-2 px-3 rounded-lg bg-[#f2dad6] hover:bg-[#e8c6c0] text-[#3b2b29] text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Cascade Settings to Entire Row {activeSeat.row}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Bulk Operations */}
          <div className="bg-[#faf0ee] border border-[#ebd9d6] rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#7d4842] font-bold">❖</span>
                <h3 className="font-display text-lg font-extrabold text-[#201a19]">
                  Bulk Operations
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-md bg-[#f2d2ce] text-[#7c3f37] text-[11px] font-bold tabular-nums">
                {selectedIds.length} Seats Active
              </span>
            </div>

            <p className="text-xs text-[#5b4845] leading-relaxed">
              Simultaneous operations applied to active selection:{' '}
              <strong className="text-[#201a19] font-mono">{selectedIds.join(', ')}</strong>
            </p>

            <div className="bg-white border border-[#ebd9d6] rounded-2xl p-3.5">
              <div className="text-[11px] font-medium text-[#6e5b58]">
                Combined Selection Gross
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-display text-3xl font-extrabold text-[#7d4842] tabular-nums">
                  ₹{(selectedIds.length * unitPrice).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xs font-semibold text-[#5b4845] tabular-nums">
                  ₹{unitPrice.toFixed(2)} ea
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  notify(
                    `Batch re-priced ${selectedIds.length} active seats (${selectedIds.join(
                      ', '
                    )}) to ₹${unitPrice.toFixed(2)}`
                  )
                }
                className="w-full py-2.5 px-4 rounded-xl bg-[#7d4842] hover:bg-[#693a35] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Batch Re-Price Selected</span>
              </button>
              <button
                onClick={() =>
                  notify(`Released holds on ${selectedIds.length} selected seats`)
                }
                className="w-full py-2.5 px-4 rounded-xl bg-[#f3e1de] hover:bg-[#ead3cf] text-[#3b2b29] text-xs font-bold inline-flex items-center justify-center gap-2 border border-[#e0c8c4] transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Release Holds on Selection</span>
              </button>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#6e5b58] pt-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#7d4842]" />
              <span>
                Fire Marshall egress clearway enforced (min 48&quot; aisle spacing maintained).
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
