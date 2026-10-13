import React, { useMemo, useState } from 'react';
import {
  Armchair,
  Calendar,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Lock,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { formatRupees, MarketEvent } from '../data/events';
import { ApiError, createBooking, BookingResponse } from '../data/api';
import { ImageWithFallback } from './ImageWithFallback';
import { ShowflowLogo } from './ShowflowLogo';

interface PatronCheckoutViewProps {
  onNavigate: (screen: string) => void;
  event: MarketEvent;
}

interface Seat {
  id: string;
  code: string;
  section: string;
  row: string;
  seatNum: number;
  tier: 'vip' | 'orchestra' | 'front';
  tierTitle: string;
  price: number;
  cx: number;
  cy: number;
  sold?: boolean;
  accessible?: boolean;
}

const generateGridSeats = (basePrice: number): Seat[] => {
  const seats: Seat[] = [];
  const seatSpacing = 20;
  const leftCenterX = 290;
  const rightCenterX = 510;
  const rowConfigs = [
    { row: 'A', y: 330, leftCount: 9, rightCount: 9, tier: 'front' as const, price: basePrice, title: 'Front Section' },
    { row: 'B', y: 300, leftCount: 9, rightCount: 9, tier: 'front' as const, price: basePrice, title: 'Front Section' },
    { row: 'C', y: 270, leftCount: 9, rightCount: 9, tier: 'front' as const, price: basePrice, title: 'Front Section' },
    { row: 'D', y: 240, leftCount: 8, rightCount: 8, tier: 'orchestra' as const, price: basePrice * 2, title: 'Center Orchestra' },
    { row: 'E', y: 210, leftCount: 8, rightCount: 8, tier: 'orchestra' as const, price: basePrice * 2, title: 'Center Orchestra' },
    { row: 'F', y: 180, leftCount: 7, rightCount: 7, tier: 'orchestra' as const, price: Math.round(basePrice * 1.5), title: 'Center Orchestra' },
    { row: 'G', y: 150, leftCount: 6, rightCount: 6, tier: 'vip' as const, price: basePrice * 3, title: 'VIP Golden Circle' },
    { row: 'H', y: 120, leftCount: 5, rightCount: 5, tier: 'vip' as const, price: basePrice * 3, title: 'VIP Golden Circle' },
  ];

  rowConfigs.forEach((config) => {
    const count = config.leftCount + config.rightCount;
    for (let index = 0; index < count; index++) {
      const isLeft = index < config.leftCount;
      const sideIndex = isLeft ? index : index - config.leftCount;
      const sideCount = isLeft ? config.leftCount : config.rightCount;
      const centerX = isLeft ? leftCenterX : rightCenterX;
      const cx = centerX - ((sideCount - 1) * seatSpacing) / 2 + sideIndex * seatSpacing;
      const seatNum = index + 1;
      const code = `${config.row}${String(seatNum).padStart(2, '0')}`;

      const sold =
        (config.row === 'A' && (index === 0 || index === 1 || index === 16 || index === 17)) ||
        (config.row === 'D' && (index === 3 || index === 4 || index === 11 || index === 12)) ||
        (config.row === 'E' && (index === 6 || index === 7 || index === 8)) ||
        (config.row === 'G' && index >= 4 && index <= 7) ||
        (config.row === 'H' && (index === 4 || index === 5));
      const accessible = config.row === 'F' && (index === 0 || index === 1 || index === count - 2 || index === count - 1);

      seats.push({
        id: code,
        code,
        section: config.tier === 'vip' ? 'Section 102' : config.tier === 'orchestra' ? 'Section 100' : 'Section 104',
        row: config.row,
        seatNum,
        tier: config.tier,
        tierTitle: config.title,
        price: config.price,
        cx,
        cy: config.y + Math.abs(sideIndex - (sideCount - 1) / 2) * 0.75,
        sold,
        accessible,
      });
    }
  });

  return seats;
};

export const PatronCheckoutView: React.FC<PatronCheckoutViewProps> = ({ onNavigate, event }) => {
  const allSeats = useMemo(() => generateGridSeats(event.fromPrice), [event.fromPrice]);
  const [maxPrice, setMaxPrice] = useState<number>(event.fromPrice * 3);
  const [selectedShowtime, setSelectedShowtime] = useState<string>(event.date.split('·').at(-1)?.trim() || '7:00 PM');
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(false);
  const [seatCount, setSeatCount] = useState<number>(2);
  const [seatCountConfirmed, setSeatCountConfirmed] = useState<boolean>(false);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [smsOptIn, setSmsOptIn] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExp, setCardExp] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');
  const [bank, setBank] = useState<string>('');
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string>('');

  const selectedSeats = allSeats.filter((s) => selectedCodes.includes(s.code));
  const rowPrices = Array.from(new Map(allSeats.map((seat) => [seat.row, seat] as const)).values());
  const previewShowtimes = Array.from(new Set([
    selectedShowtime,
    '10:40 AM',
    '11:15 AM',
    '12:50 PM',
    '2:25 PM',
    '4:00 PM',
    '5:00 PM',
    '7:10 PM',
    '8:10 PM',
  ]));
  const ticketTiers = Array.from(new Set(rowPrices.map((seat) => seat.tierTitle))).map((title) => ({
    title,
    price: Math.min(...allSeats.filter((seat) => seat.tierTitle === title).map((seat) => seat.price)),
  }));

  const toggleSeat = (seat: Seat) => {
    const isSelected = selectedCodes.includes(seat.code);
    if (seat.sold || (!isSelected && (seat.price > maxPrice || (accessibleOnly && !seat.accessible)))) return;
    if (selectedCodes.length >= seatCount && !isSelected) {
      setCheckoutError(`You selected ${seatCount} seats. Remove one before adding another.`);
      return;
    }
    setCheckoutError('');
    setSelectedCodes((prev) =>
      prev.includes(seat.code) ? prev.filter((code) => code !== seat.code) : [...prev, seat.code],
    );
  };

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const facilityFee = selectedSeats.length * 49;
  const serviceFee = selectedSeats.length > 0 ? 35 : 0;
  const taxes = Math.round((facilityFee + serviceFee) * 0.18);
  const totalDue = subtotal + facilityFee + serviceFee + taxes;

  if (orderConfirmed) {
    const bookingId = booking?.bookingId ?? '';
    const qrValue = JSON.stringify({ preview: true, bookingId, event: event.title, seats: selectedCodes, total: booking?.total ?? totalDue });
    return (
      <div className="vv-checkout-page min-h-screen bg-[#f6f7f5]">
        <header className="border-b border-[#e8e2df] bg-white px-4 py-3 sm:px-6 print:hidden">
          <div className="mx-auto flex max-w-360 items-center justify-between gap-4">
            <ShowflowLogo size="sm" subtitle="Nights, found" darkText />
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => onNavigate('bookings')} className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-bold text-[#514946] hover:bg-[#f4f1f0]">
                <Ticket className="h-4 w-4" /> <span className="hidden sm:inline">Bookings</span>
              </button>
              <button type="button" onClick={() => onNavigate('discover')} className="rounded-md px-3 py-2 text-sm font-bold text-[#514946] hover:bg-[#f4f1f0]">
                Back to events
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
          <div role="status" className="flex items-center gap-4 rounded-lg border border-[#cde8d6] bg-[#edf8f0] p-4 text-[#256744] sm:p-5">
            <CheckCircle2 className="h-8 w-8 shrink-0" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em]">Reservation saved · No payment processed</p>
              <h1 className="mt-1 font-display text-xl font-extrabold sm:text-2xl">Seats reserved</h1>
            </div>
          </div>

          <section className="grid gap-4 rounded-xl border border-[#e8e2df] bg-white p-5 shadow-sm sm:p-7 md:grid-cols-[minmax(0,1fr)_230px]">
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#d52b3a]">Event</p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-[#211f1e]">{event.title}</h2>
                <p className="mt-1 text-sm text-[#716b68]">{event.venue}</p>
                <p className="mt-1 text-sm font-semibold text-[#514946]">{event.date.split('·')[0].trim()} · {selectedShowtime}</p>
              </div>

              <div className="border-t border-[#eee9e6] pt-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#514946]">Your seats · {selectedSeats.length}</h3>
                <div className="mt-2 divide-y divide-[#eee9e6]">
                  {selectedSeats.map((seat) => (
                    <div key={seat.code} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-sm font-bold text-[#211f1e]">{seat.tierTitle}</p>
                        <p className="mt-0.5 text-xs text-[#716b68]">Row {seat.row} · Seat {seat.seatNum} · {seat.section}</p>
                      </div>
                      <strong className="whitespace-nowrap text-sm tabular-nums text-[#211f1e]">{formatRupees(seat.price)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <dl className="space-y-2 border-t border-[#eee9e6] pt-4 text-xs tabular-nums">
                <div className="flex justify-between gap-4"><dt className="text-[#716b68]">Tickets</dt><dd>{formatRupees(booking?.subtotal ?? subtotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[#716b68]">Fees and taxes</dt><dd>{formatRupees((booking?.facilityFee ?? facilityFee) + (booking?.serviceFee ?? serviceFee) + (booking?.taxes ?? taxes))}</dd></div>
                <div className="flex justify-between gap-4 border-t border-[#eee9e6] pt-3 text-sm font-extrabold"><dt>Total</dt><dd className="text-[#d52b3a]">{formatRupees(booking?.total ?? totalDue)}</dd></div>
              </dl>
            </div>

            <aside className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#e3d6d4] bg-[#faf9f8] p-4 text-center">
              <QRCodeSVG value={qrValue} size={164} level="M" includeMargin />
              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#817976]">Preview reference</p>
              <p className="mt-1 font-mono text-lg font-extrabold tracking-wider text-[#211f1e]">{bookingId}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-[#b92231]">Reservation reference only · Not valid for entry</p>
            </aside>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e8e2df] bg-white p-4 print:hidden">
            <p className="max-w-xl text-xs leading-relaxed text-[#716b68]">Your seats are reserved in this running demo. Payment is not processed and this reference is not a valid ticket.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-[#e8e2df] px-4 py-2.5 text-xs font-bold text-[#514946] hover:bg-[#f4f1f0]">
                <Printer className="h-4 w-4" /> Print summary
              </button>
              <button type="button" onClick={() => onNavigate('discover')} className="rounded-lg bg-[#d52b3a] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#b92231]">
                Back to events
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="vv-checkout-page min-h-screen bg-[#f6f7f5]">
      <header className="border-b border-[#e8e2df] bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-360 items-center justify-between gap-4">
          <ShowflowLogo size="sm" subtitle="Nights, found" darkText />
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onNavigate('bookings')} className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-bold text-[#514946] hover:bg-[#f4f1f0]">
              <Ticket className="h-4 w-4" /> <span className="hidden sm:inline">Bookings</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('discover')}
              className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-bold text-[#514946] hover:bg-[#f4f1f0]"
            >
              <span aria-hidden="true">←</span> Back to events
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 sm:py-8">
      <div className="space-y-5 pb-12">
      {!seatCountConfirmed && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#211f1e]/60 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="seat-count-title"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-[#e8e2df] bg-white shadow-2xl"
          >
            <div className="p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-[#3157e8]">Your night · 01 / 02</p>
                  <h2 id="seat-count-title" className="mt-2 font-display text-3xl font-bold text-[#1b1d29]">Who’s coming along?</h2>
                  <p className="mt-1 text-sm text-[#716b68]">Choose the number of seats for {event.title}.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('discover')}
                  className="shrink-0 rounded-md px-2 py-1.5 text-xs font-bold text-[#716b68] hover:bg-[#f4f1f0]"
                >
                  Back to events
                </button>
              </div>

              <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-10" role="group" aria-label="Number of seats">
                {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
                  <button
                    key={count}
                    type="button"
                    aria-pressed={seatCount === count}
                    onClick={() => setSeatCount(count)}
                    className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-extrabold tabular-nums transition-colors ${seatCount === count ? 'border-[#d52b3a] bg-[#d52b3a] text-white' : 'border-[#e8e2df] bg-white text-[#514946] hover:border-[#d52b3a]'}`}
                  >
                    {count}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-extrabold uppercase text-[#514946]">Ticket tiers · per seat</h3>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {ticketTiers.map((tier) => (
                    <div key={tier.title} className="rounded-lg border border-[#eee9e6] bg-[#faf9f8] p-3">
                      <p className="text-[10px] font-semibold text-[#716b68]">{tier.title}</p>
                      <p className="mt-1 font-display text-base font-extrabold tabular-nums text-[#211f1e]">{formatRupees(tier.price)}<span className="ml-1 text-[10px] font-medium text-[#817976]">onwards</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-[#eee9e6] bg-[#faf9f8] px-5 py-4 sm:px-7">
              <p className="text-xs font-semibold text-[#716b68]">{seatCount} {seatCount === 1 ? 'seat' : 'seats'} selected</p>
              <button
                type="button"
                onClick={() => { setSelectedCodes([]); setCheckoutError(''); setSeatCountConfirmed(true); }}
                className="rounded-lg bg-[#d52b3a] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#b92231]"
              >
                Choose your seats
              </button>
            </div>
          </section>
        </div>
      )}
      {/* Event details and current selection */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-[#6b625f] flex items-center gap-1.5">
            <button onClick={() => onNavigate('discover')} className="hover:underline cursor-pointer">
              Events
            </button>
            <span>&gt;</span>
            <span className="max-w-55 truncate">{event.title}</span>
            <span>&gt;</span>
            <span className="text-[#3157e8] font-bold">Choose your seats</span>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_250px]">
          <section className="vv-checkout-hero relative isolate flex min-h-[210px] items-end overflow-hidden rounded-lg bg-[#1b1d29] sm:min-h-[245px]">
            <ImageWithFallback src={event.image} alt={`${event.category} at ${event.venue}`} className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#171a28]/95 via-[#171a28]/70 to-[#171a28]/10" />
            <div className="max-w-2xl p-5 text-white sm:p-7">
              <p className="text-[10px] font-extrabold uppercase text-[#d9ef72]">The night is yours · {event.city}</p>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{event.title}</h1>
              <p className="mt-1.5 text-sm text-white/80">{event.subtitle}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-white/80">
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#d9ef72]" />{event.date.split('·')[0].trim()} · {selectedShowtime}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#ff967a]" />{event.venue}</span>
              </p>
            </div>
          </section>

          <div className="flex items-center gap-3 rounded-lg border border-[#e8e2df] bg-white px-4 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e8ecff] text-[#3157e8]">
              <Armchair className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase text-[#716b68]">Seats selected</p>
              <p className="font-display text-xl font-bold text-[#1b1d29] tabular-nums">{selectedSeats.length} <span className="text-sm font-semibold text-[#716b68]">/ {seatCount}</span></p>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedCodes([]); setCheckoutError(''); setSeatCountConfirmed(false); }}
              className="text-[10px] font-extrabold text-[#3157e8] hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-lg border border-[#e8e2df] bg-white p-3 sm:p-4" aria-label="Showtime selector">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-extrabold text-[#1b1d29]">Pick a time</h2>
            <p className="mt-1 text-[10px] text-[#716b68]">Local showtime · {event.venue}</p>
          </div>
          <span className="rounded bg-[#fff0f1] px-2 py-1 text-[9px] font-extrabold uppercase text-[#b92231]">Sample times</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Available preview showtimes">
          {previewShowtimes.map((time) => (
            <button
              key={time}
              type="button"
              aria-pressed={selectedShowtime === time}
              onClick={() => setSelectedShowtime(time)}
              className={`min-w-22 rounded-md border px-3 py-2 text-center text-xs font-extrabold tabular-nums transition-colors ${selectedShowtime === time ? 'border-[#d52b3a] bg-[#d52b3a] text-white' : 'border-[#e8e2df] bg-white text-[#514946] hover:border-[#d52b3a]'}`}
            >
              {time}
            </button>
          ))}
        </div>
      </section>

      {/* Main Split: Seat Map Column (Left 2/3) + Order Summary & Checkout Column (Right 1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left 2/3: Interactive Seat Map + Sightline & Amenity Cards */}
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-[#ffffff] border border-[#e8e2df] rounded-3xl p-5 space-y-4">
            {/* Top Controls Box */}
            <div className="bg-[#fff5f5] border border-[#e8e2df] rounded-2xl p-3.5 space-y-3">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#514946] tabular-nums">
                    MAX PRICE: {formatRupees(maxPrice)}
                  </span>
                  <input
                    type="range"
                    min={event.fromPrice}
                    max={event.fromPrice * 3}
                    step={1}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-28 accent-[#d52b3a] cursor-pointer"
                  />
                </div>

                <label className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#fff0f1] text-xs font-semibold text-[#514946] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={accessibleOnly}
                    onChange={(e) => setAccessibleOnly(e.target.checked)}
                    className="rounded accent-[#d52b3a]"
                  />
                  <span>♿ Accessible Only</span>
                </label>
              </div>

            </div>

            {/* Map Legend Row */}
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-[#514946] py-1">
              <span className="inline-flex items-center gap-1.5">
                <Armchair className="h-4 w-4 text-[#879199]" />
                <span>Available</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Armchair className="h-4 w-4 text-[#171717]" />
                <span>Your Selection ({selectedSeats.length})</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#716b68]">
                <Armchair className="h-4 w-4 text-[#d4d9dc]" />
                <span>Sold Out / Reserved</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                <span>Accessible</span>
              </span>
            </div>

            {/* Interactive seat map */}
            <div className="vv-seat-canvas bg-[#fff5f5] rounded-2xl p-4 overflow-x-auto overflow-y-hidden touch-pan-x relative flex items-center justify-center min-h-95">
              <svg
                viewBox="0 0 800 460"
                    className="vv-seat-svg w-full min-w-145 max-w-160 h-auto select-none transition-transform duration-150"
              >
                {/* Stage */}
                <path
                  d="M 285 34 L 515 34 L 495 58 L 305 58 Z"
                  fill="#3157e8"
                  stroke="#1b1d29"
                  strokeWidth="2"
                />
                <text
                  x="400"
                  y="52"
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-white uppercase"
                >
                  STAGE
                </text>
                <text
                  x="400"
                  y="78"
                  textAnchor="middle"
                  className="text-[7px] font-bold fill-[#777b8a] uppercase"
                >
                  FRONT OF HOUSE
                </text>

                <text
                  x="65"
                  y="95"
                  className="text-[7px] font-bold tracking-widest fill-[#746a67] uppercase"
                >
                  VIP GOLDEN CIRCLE
                </text>
                <text
                  x="65"
                  y="185"
                  className="text-[7px] font-bold tracking-widest fill-[#746a67] uppercase"
                >
                  CENTER ORCHESTRA
                </text>
                <text
                  x="65"
                  y="275"
                  className="text-[7px] font-bold tracking-widest fill-[#746a67] uppercase"
                >
                  FRONT SECTION
                </text>

                {rowPrices.map((rowSeat) => {
                  const seatsInRow = allSeats.filter((seat) => seat.row === rowSeat.row);
                  const rowCenter = seatsInRow.reduce((sum, seat) => sum + seat.cy, 0) / seatsInRow.length;
                  const rowRight = Math.max(...seatsInRow.map((seat) => seat.cx));
                  return (
                    <g key={`row-label-${rowSeat.row}`}>
                      <text
                        x="160"
                        y={rowCenter + 3}
                        textAnchor="end"
                        className="text-[9px] font-extrabold fill-[#514946]"
                      >
                        {rowSeat.row}
                      </text>
                      <text
                        x={rowRight + 16}
                        y={rowCenter + 3}
                        textAnchor="start"
                        className="text-[8px] font-extrabold fill-[#211f1e] tabular-nums"
                      >
                        <title>{`Row ${rowSeat.row}: ${formatRupees(rowSeat.price)} per seat`}</title>
                        {formatRupees(rowSeat.price)}
                      </text>
                    </g>
                  );
                })}

                {/* All Curved Seats */}
                {allSeats.map((seat) => {
                  const isSelected = selectedCodes.includes(seat.code);
                  const filteredOut =
                    seat.price > maxPrice || (accessibleOnly && !seat.accessible);
                  const unavailable = seat.sold || (filteredOut && !isSelected);

                  const seatFill = isSelected ? '#ff7859' : seat.sold ? '#dfe1e8' : '#fffefa';
                  const seatStroke = isSelected ? '#1b1d29' : seat.sold ? '#d0d2da' : '#66708e';
                  const seatText = isSelected ? '#1b1d29' : seat.sold ? '#a6a9b3' : '#41485e';

                  return (
                    <g
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      onKeyDown={(event) => {
                        if (!unavailable && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault();
                          toggleSeat(seat);
                        }
                      }}
                      role="button"
                      tabIndex={unavailable ? -1 : 0}
                      aria-label={`${seat.tierTitle}, section ${seat.section}, row ${seat.row}, seat ${seat.seatNum}, ${formatRupees(seat.price)}${seat.accessible ? ', accessible' : ''}${seat.sold ? ', sold' : ''}`}
                      aria-pressed={isSelected}
                      aria-disabled={unavailable}
                      className={
                        unavailable
                          ? 'cursor-not-allowed opacity-65'
                          : 'cursor-pointer hover:opacity-90'
                      }
                      opacity={filteredOut && !isSelected ? 0.25 : 1}
                    >
                      <title>
                        {`${seat.tierTitle} • ${seat.section} Row ${seat.row} Seat ${seat.seatNum} (${formatRupees(seat.price)})`}
                      </title>
                      <rect x={seat.cx - 13} y={seat.cy - 13} width={26} height={26} rx={4} fill="transparent" />
                      <rect
                        x={seat.cx - 9}
                        y={seat.cy - 8}
                        width={18}
                        height={16}
                        rx={8}
                        fill={seatFill}
                        stroke={seatStroke}
                        strokeWidth={isSelected ? 1.5 : 1}
                      />
                      <text
                        x={seat.cx}
                        y={seat.cy + 2.5}
                        textAnchor="middle"
                        className="text-[6px] font-bold tabular-nums"
                        fill={seatText}
                      >
                        {String(seat.seatNum).padStart(2, '0')}
                      </text>
                      {seat.accessible && (
                        <circle cx={seat.cx + 7} cy={seat.cy - 7} r={2.5} fill="#3157e8" stroke="#fffefa" strokeWidth="1" />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Map Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#514946] pt-1">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#d52b3a] shrink-0" />
                  <span>Preview selection only. Seats are not reserved until a booking is completed.</span>
              </div>
              <div className="text-[11px] font-semibold text-[#514946] sm:text-right">
                Section 102 • View from Seat 98% Accurate
              </div>
            </div>
          </div>

        </div>

        {/* Right 1/3: Order Summary & Patron Checkout */}
        <div className="bg-[#ffffff] border border-[#e8e2df] rounded-3xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d52b3a]" />
              <h2 className="font-display text-xl font-bold text-[#1b1d29]">
                Your order
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-[#ffe4e7] text-[#b92231] text-xs font-bold tabular-nums">
              {selectedSeats.length} Items
            </span>
          </div>

          {/* Selected Seat Item Cards */}
          <div className="space-y-2.5">
            {selectedSeats.map((s) => (
              <div
                key={s.code}
                className="bg-[#fff5f5] border border-[#e8e2df] rounded-2xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f7e2b8] text-[#7b5314] font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                    {s.code}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#211f1e]">{s.tierTitle}</div>
                    <div className="text-[11px] text-[#6b625f] tabular-nums">
                      {s.section} • Row {s.row}
                      <br />
                      Seat {s.seatNum}
                    </div>
                  </div>
                </div>
                <div className="font-display text-sm font-extrabold text-[#211f1e] tabular-nums">
                  {formatRupees(s.price)}
                </div>
              </div>
            ))}
            {selectedSeats.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#e8e2df] bg-white p-4 text-xs leading-relaxed text-[#6b625f]">
                Pick seats from the map and your total will appear here.
              </p>
            )}
          </div>

          {/* Financial Breakdown Box */}
          <div className="bg-white border border-[#e8e2df] rounded-2xl p-4 space-y-2 text-xs tabular-nums">
            <div className="flex justify-between text-[#514946]">
              <span>Subtotal ({selectedSeats.length} tickets)</span>
              <span className="font-semibold text-[#211f1e]">{formatRupees(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#514946]">
              <span>Convenience fee ({formatRupees(49)} / ticket)</span>
              <span className="font-semibold text-[#211f1e]">{formatRupees(facilityFee)}</span>
            </div>
            <div className="flex justify-between text-[#514946]">
              <span>Processing &amp; Service Fee</span>
              <span className="font-semibold text-[#211f1e]">{formatRupees(serviceFee)}</span>
            </div>
            <div className="flex justify-between text-[#514946] pb-2 border-b border-[#eee9e6]">
              <span>GST on fees (18%)</span>
              <span className="font-semibold text-[#211f1e]">{formatRupees(taxes)}</span>
            </div>
            <div className="flex items-baseline justify-between pt-1">
                <span className="font-display text-sm font-extrabold text-[#1b1d29]">Total</span>
              <span className="font-display text-xl font-extrabold text-[#514946]">
                {formatRupees(totalDue)}
              </span>
            </div>
          </div>

          {/* Patron Information */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-[#1b1d29]">
                Ticket delivery
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#514946]">
                <Ticket className="w-3 h-3 text-[#d52b3a]" />
                <span>Required</span>
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#514946] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8e2df] text-xs font-medium text-[#211f1e] focus:outline-none focus:border-[#c12635]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#514946] mb-1">
                  Email (E-Tickets)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8e2df] text-xs font-medium text-[#211f1e] focus:outline-none focus:border-[#c12635]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#514946] mb-1">
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8e2df] text-xs font-medium text-[#211f1e] tabular-nums focus:outline-none focus:border-[#c12635]"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-[11px] font-semibold text-[#514946] cursor-pointer select-none pt-0.5">
              <input
                type="checkbox"
                checked={smsOptIn}
                onChange={(e) => setSmsOptIn(e.target.checked)}
                className="mt-0.5 rounded accent-[#d52b3a]"
              />
              <span>Send me event updates by SMS</span>
            </label>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-extrabold text-[#1b1d29]">How would you like to pay?</h3>
              <span className="shrink-0 rounded bg-[#ffe0d6] px-2 py-1 text-[9px] font-extrabold uppercase text-[#9a3e2c]">Demo · no charge</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-[#d52b3a] text-white border-[#d52b3a]'
                    : 'bg-[#f4f1f0] text-[#211f1e] border-[#e8e2df]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'bg-[#d52b3a] text-white border-[#d52b3a]'
                    : 'bg-[#f4f1f0] text-[#211f1e] border-[#e8e2df]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Net banking</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#d52b3a] text-white border-[#d52b3a]'
                    : 'bg-[#f4f1f0] text-[#211f1e] border-[#e8e2df]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="bg-white border border-[#e8e2df] rounded-2xl p-3.5">
                <label className="block text-[11px] font-semibold text-[#514946] mb-1">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@bank"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-xl bg-[#fff5f5] border border-[#e8e2df] text-xs font-medium text-[#211f1e] focus:outline-none"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
            <div className="bg-white border border-[#e8e2df] rounded-2xl p-3.5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#514946] mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="Card number"
                    className="w-full px-3 py-2 rounded-xl bg-[#fff5f5] border border-[#e8e2df] text-xs font-mono font-bold text-[#211f1e] focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#d52b3a]">
                    💳
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#514946] mb-1">
                    Expires
                  </label>
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#fff5f5] border border-[#e8e2df] text-xs font-mono font-bold text-[#211f1e] text-center focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#514946] mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="CVC"
                    className="w-full px-2.5 py-2 rounded-xl bg-[#fff5f5] border border-[#e8e2df] text-xs font-mono font-bold text-[#211f1e] text-center focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-center text-[10px] font-semibold text-[#6b625f]">Gateway preview</div>
              </div>
            </div>
            )}

            {paymentMethod === 'netbanking' && (
              <label className="block bg-white border border-[#e8e2df] rounded-2xl p-3.5 text-[11px] font-semibold text-[#514946]">
                Select your bank
                <select value={bank} onChange={(e) => setBank(e.target.value)} className="mt-1 w-full rounded-xl border border-[#e8e2df] bg-[#fff5f5] px-3 py-2 text-xs text-[#211f1e]">
                  <option value="">Choose a bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </label>
            )}
          </div>

          <button
            onClick={async () => {
              if (selectedSeats.length !== seatCount) {
                setCheckoutError(`Select exactly ${seatCount} ${seatCount === 1 ? 'seat' : 'seats'} to continue.`);
                return;
              }
              if (!fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.replace(/\D/g, '').length < 10) {
                setCheckoutError('Enter your name, a valid email and a 10-digit mobile number.');
                return;
              }
              if (paymentMethod === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
                setCheckoutError('Enter a valid UPI ID to continue.');
                return;
              }
              if (paymentMethod === 'card' && (cardNumber.replace(/\D/g, '').length < 12 || !/^\d{2}\/\d{2}$/.test(cardExp) || cardCvc.replace(/\D/g, '').length < 3)) {
                setCheckoutError('Enter valid card number, expiry and CVC details.');
                return;
              }
              if (paymentMethod === 'netbanking' && !bank) {
                setCheckoutError('Select a bank to continue.');
                return;
              }
              setCheckoutError('');
              setBookingInProgress(true);
              try {
                const reservation = await createBooking({
                  eventId: event.id,
                  seatCodes: selectedCodes,
                  showtime: selectedShowtime,
                  fullName: fullName.trim(),
                  email: email.trim(),
                  phone: phone.trim(),
                  paymentMethod: paymentMethod.toUpperCase() as 'UPI' | 'CARD' | 'NETBANKING',
                });
                setBooking(reservation);
                setOrderConfirmed(true);
              } catch (error) {
                setCheckoutError(error instanceof ApiError
                  ? error.message
                  : 'Could not reserve these seats. Please try again.');
              } finally {
                setBookingInProgress(false);
              }
            }}
            disabled={selectedSeats.length !== seatCount || bookingInProgress}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#d52b3a] hover:bg-[#b92231] disabled:cursor-not-allowed disabled:opacity-45 text-white text-sm font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer tabular-nums"
          >
            <Lock className="w-4 h-4" />
            <span>{bookingInProgress ? 'Saving your seats…' : `Reserve seats · ${formatRupees(totalDue)}`}</span>
          </button>
          {checkoutError && <p role="alert" className="text-xs font-semibold text-[#b42332]">{checkoutError}</p>}

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#514946] text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d52b3a] shrink-0" />
            <span>Reservation only · Payment isn’t processed in this demo</span>
          </div>
        </div>
      </div>
      </div>
      </main>
    </div>
  );
};
