import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, Clock3, LoaderCircle, MapPin, Ticket, XCircle } from 'lucide-react';

import { ApiError, BookingResponse, cancelBooking, fetchBookings } from '../data/api';
import { formatRupees, MARKET_EVENTS } from '../data/events';
import { eventImages } from '../data/imageAssets';
import { ImageWithFallback } from './ImageWithFallback';
import { ShowflowLogo } from './ShowflowLogo';

interface BookingsViewProps {
  onNavigate: (screen: string) => void;
}

export const BookingsView = ({ onNavigate }: BookingsViewProps) => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      setBookings(await fetchBookings());
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : 'Could not load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const handleCancel = async (booking: BookingResponse) => {
    if (booking.status === 'CANCELLED' || busyBookingId) return;
    if (!window.confirm(`Cancel booking ${booking.bookingId}? Its seats will become available again.`)) return;

    setBusyBookingId(booking.bookingId);
    setLoadError('');
    try {
      const cancelled = await cancelBooking(booking.bookingId);
      setBookings((current) => current.map((entry) => entry.bookingId === cancelled.bookingId ? cancelled : entry));
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : 'Could not cancel this booking. Please try again.');
    } finally {
      setBusyBookingId(null);
    }
  };

  const activeBookings = bookings.filter((booking) => booking.status === 'RESERVED');
  const featuredEvent = MARKET_EVENTS[0];

  return (
    <div className="vv-bookings-page min-h-screen bg-[#f6f7f5] text-[#211f1e]">
      <header className="border-b border-[#e8e2df] bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button type="button" onClick={() => onNavigate('discover')} aria-label="Showflow home" className="text-left">
            <ShowflowLogo size="md" subtitle="Nights, found" darkText />
          </button>
          <button type="button" onClick={() => onNavigate('discover')} className="inline-flex items-center gap-2 rounded-lg bg-[#3157e8] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#2445c4]">
            <Ticket className="h-4 w-4" /> Explore shows
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-7 px-4 py-8 sm:px-6 sm:py-10">
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase text-[#3157e8]">Your little black book</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-[#1b1d29] sm:text-4xl">Tickets &amp; plans</h1>
              <p className="mt-1 text-sm text-[#666b78]">Everything you have coming up, all in one place.</p>
            </div>
            <span className="rounded-lg border border-[#d8d9df] bg-white px-3 py-2 text-xs font-bold text-[#505567]">{activeBookings.length} upcoming {activeBookings.length === 1 ? 'plan' : 'plans'}</span>
          </div>

          {loadError && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-[#efc3c4] bg-[#fff4f4] p-3 text-sm font-semibold text-[#a32936]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{loadError}</span>
            </div>
          )}

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 rounded-2xl border border-[#e8e2df] bg-white text-sm font-semibold text-[#716b68]">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading booked tickets…
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="vv-bookings-empty grid overflow-hidden rounded-lg border border-[#d8d9df] bg-white lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col items-start justify-center p-6 sm:p-10">
                <span className="inline-flex items-center gap-2 rounded bg-[#e8ecff] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#3157e8]">A blank calendar is full of possibility</span>
                <h2 className="mt-5 max-w-md font-display text-3xl font-bold leading-tight text-[#1b1d29] sm:text-4xl">The seats are waiting.</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#666b78]">Your saved shows and ticket details will live here. Find something worth going out for.</p>
                <button type="button" onClick={() => onNavigate('discover')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#3157e8] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#2445c4]">
                  Find your next show <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="vv-bookings-feature relative isolate flex min-h-[300px] items-end overflow-hidden bg-[#1b1d29] p-6 text-white sm:min-h-[380px] sm:p-8">
                <ImageWithFallback src={eventImages.liveNight} alt="Crowd at a live music festival" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#171a28]/95 via-[#171a28]/24 to-transparent" />
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-[#d9ef72]">Coming up in Mumbai</p>
                  <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{featuredEvent.title}</h3>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-white/80">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-[#d9ef72]" />{featuredEvent.dateLabel}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#ff967a]" />{featuredEvent.venue}</span>
                  </p>
                  <p className="mt-3 text-sm font-bold">From {formatRupees(featuredEvent.fromPrice)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeBookings.map((booking) => {
                const busy = busyBookingId === booking.bookingId;
                return (
                  <article key={booking.bookingId} className="overflow-hidden rounded-2xl border border-[#e8e2df] bg-white shadow-sm">
                    <div className="h-1 bg-[#d52b3a]" />
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-display text-lg font-extrabold text-[#211f1e]">{booking.eventTitle}</h2>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#edf8f0] px-2.5 py-1 text-[10px] font-extrabold text-[#256744]">
                            <CheckCircle2 className="h-3 w-3" /> Booked
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-xs font-bold tracking-wide text-[#716b68]">Order {booking.bookingId}</p>
                        <div className="mt-4 grid gap-x-8 gap-y-3 text-sm text-[#514946] sm:grid-cols-2 lg:grid-cols-3">
                          <Info label="Showtime" value={booking.showtime} icon={<Clock3 className="h-3.5 w-3.5" />} />
                          <Info label="Seats" value={booking.seatCodes.join(', ')} icon={<Ticket className="h-3.5 w-3.5" />} />
                          <Info label="Total" value={formatRupees(booking.total)} />
                        </div>
                      </div>
                      <button type="button" onClick={() => void handleCancel(booking)} disabled={Boolean(busyBookingId)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d52b3a] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b92231] disabled:cursor-wait disabled:opacity-60">
                        {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        {busy ? 'Cancelling…' : 'Cancel order'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

function Info({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return <div className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-wide text-[#8b7773]">{label}</span><span className="mt-1 flex items-center gap-1.5 break-all font-semibold text-[#514946]">{icon}{value}</span></div>;
}
