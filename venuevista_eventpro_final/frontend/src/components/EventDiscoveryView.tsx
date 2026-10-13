import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  Search,
  Ticket,
  UserRound,
  X,
} from 'lucide-react';
import { MARKET_EVENTS, MarketEvent, formatRupees } from '../data/events';
import { fetchEvents } from '../data/api';
import { ShowflowLogo } from './ShowflowLogo';
import { ImageWithFallback } from './ImageWithFallback';
import { eventImages } from '../data/imageAssets';

interface EventDiscoveryViewProps {
  onSelectEvent: (event: MarketEvent) => void;
  onNavigate: (screen: string) => void;
}

const CATEGORIES = ['Everything', 'Music', 'Comedy', 'Theatre', 'Workshops'] as const;
const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Ahmedabad', 'Chennai', 'Jaipur', 'Kochi'];

export const EventDiscoveryView: React.FC<EventDiscoveryViewProps> = ({
  onSelectEvent,
  onNavigate,
}) => {
  const [city, setCity] = useState('Mumbai');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Everything');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setEventsLoading(true);
    setEventsError(null);
    fetchEvents(controller.signal)
      .then((apiEvents) => {
        if (apiEvents.length === 0) {
          setEvents(MARKET_EVENTS);
          setEventsError('The event API returned no listings. Showing the sample events while you retry.');
          return;
        }
        const liveEvents = apiEvents.map((event) => {
          const localImage = MARKET_EVENTS.find((localEvent) => localEvent.id === event.id)?.image;
          const { tag, ...eventData } = event;
          return {
            ...eventData,
            image: localImage ?? MARKET_EVENTS[0].image,
            ...(tag ? { tag } : {}),
          };
        });
        const liveEventIds = new Set(liveEvents.map((event) => event.id));
        setEvents([...liveEvents, ...MARKET_EVENTS.filter((event) => !liveEventIds.has(event.id))]);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setEvents(MARKET_EVENTS);
          const reason = error instanceof Error ? error.message : 'Unable to load events.';
          setEventsError(`${reason} Showing sample events while the connection is restored.`);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setEventsLoading(false);
      });
    return () => controller.abort();
  }, [reloadKey]);

  const featured = events.find((event) => event.city === city)
    ?? MARKET_EVENTS.find((event) => event.city === city)
    ?? MARKET_EVENTS[0];
  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCity = event.city === city;
      const matchesCategory = category === 'Everything' || event.category === category;
      const matchesSearch =
        !query ||
        `${event.title} ${event.subtitle} ${event.category} ${event.city} ${event.venue}`
          .toLowerCase()
          .includes(query);
      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [category, city, events, search]);

  const toggleFavorite = (eventId: string) => {
    setFavorites((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId],
    );
  };

  const openEvent = (event: MarketEvent) => onSelectEvent(event);

  return (
    <div className="vv-marketplace min-h-screen bg-[#f6f7f5] text-[#18211f]">
      <header className="vv-market-header sticky top-0 z-30 border-b border-[#d6ddd2] bg-[#fbfaf6]">
        <div className="mx-auto flex min-h-[72px] max-w-[1400px] items-center gap-0.5 px-2 sm:gap-6 sm:px-7">
          <button
            type="button"
            onClick={() => {
              setCategory('Everything');
              setSearch('');
            }}
            className="vv-rail-brand flex shrink-0 items-center text-left"
            aria-label="Showflow home"
          >
            <ShowflowLogo size="md" subtitle="Nights, found" darkText />
          </button>

          <label className="vv-rail-search hidden min-w-0 flex-1 items-center gap-3 rounded-lg border border-[#e2e8e4] bg-[#f8faf8] px-3.5 py-2.5 md:flex">
            <Search className="h-4 w-4 shrink-0 text-[#687773]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events, artists, venues"
              aria-label="Search events, artists, venues"
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[#75817d]"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                <X className="h-4 w-4 text-[#687773]" />
              </button>
            )}
          </label>

          <label className="vv-rail-city ml-auto flex shrink-0 items-center gap-2 rounded-lg border border-[#d6ddd2] bg-white px-3 py-2 text-sm font-semibold md:ml-0">
            <MapPin className="h-4 w-4 text-[#e84855]" />
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              aria-label="Choose city"
              className="max-w-[88px] cursor-pointer appearance-none bg-transparent pr-1 outline-none sm:max-w-[112px]"
            >
              {CITIES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-[#687773]" />
          </label>

          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className="vv-rail-action inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2.5 text-sm font-bold text-[#475651] transition-colors hover:bg-[#f5f7f5] hover:text-[#e84855] sm:px-3"
          >
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">Bookings</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            aria-label="Sign in"
            className="vv-rail-signin inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#e84855] px-2.5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#c93645] sm:px-3.5"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline">Sign in</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="vv-rail-organizer hidden text-sm font-semibold text-[#475651] hover:text-[#e84855] lg:block"
          >
            For organisers
          </button>
        </div>
        <div className="border-t border-[#edf0ed] px-4 py-2 md:hidden">
          <label className="mx-auto flex max-w-[1320px] items-center gap-2 rounded-lg bg-[#f5f7f5] px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-[#687773]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events, artists, venues"
              aria-label="Search events, artists, venues"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#75817d]"
            />
          </label>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 pb-20 pt-5 sm:px-7 sm:pt-8">
        {eventsError && (
          <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#f0c8cc] bg-[#fff1f2] px-4 py-3 text-sm text-[#8f2630]">
            <span>Booking service unavailable. Showing local event listings for now.</span>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="font-bold underline underline-offset-2">Retry</button>
          </div>
        )}
        <section className="vv-featured relative isolate flex min-h-[420px] items-end overflow-hidden rounded-lg bg-[#171a28] sm:min-h-[510px]">
          <ImageWithFallback
            src={featured.id === 'summer-beats' ? eventImages.discoveryHero : featured.image}
            alt={`${featured.category} at ${featured.venue}`}
            className="absolute inset-0 z-0 h-full w-full object-cover object-[center_44%]"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#171a28]/95 via-[#171a28]/62 to-[#171a28]/5" />
          <div className="relative z-20 max-w-3xl p-6 text-white sm:p-12">
            <div className="mb-5 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase text-[#d9ef72]">
              <CalendarDays className="h-3.5 w-3.5" /> {city} after dark
            </div>
            <h1 className="max-w-xl font-display text-6xl font-normal leading-[0.94] sm:text-8xl">
              Out <span className="italic text-[#d9ef72]">tonight?</span><br />Make it count.
            </h1>
            <p className="mt-5 max-w-lg font-display text-xl font-semibold text-white sm:text-2xl">
              {featured.title}
            </p>
            <p className="mt-1.5 max-w-lg text-sm text-white/80 sm:text-base">{featured.subtitle}</p>
            <p className="mt-3 max-w-lg text-xs font-semibold text-white/75 sm:text-sm">{featured.dateLabel} <span className="px-1.5 text-[#d9ef72]">/</span> {featured.venue}</p>
            <button
              type="button"
              onClick={() => openEvent(featured)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d9ef72] px-5 py-3 text-sm font-extrabold text-[#202923] transition-colors hover:bg-[#e5f79a]"
            >
              Find your seats · {formatRupees(featured.fromPrice)}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="mt-10" aria-label="Browse events">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase text-[#3157e8]">Curated for your city</p>
              <h2 className="mt-1 font-display text-3xl font-bold">Tonight in {city}</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#586661]">
              <MapPin className="h-3.5 w-3.5" />
              <span>Showing events near you</span>
              <Check className="h-3.5 w-3.5 text-[#258267]" />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Event categories">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={category === item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  category === item
                    ? 'border-[#d9ef72] bg-[#d9ef72] text-[#202923]'
                    : 'border-[#dce4df] bg-white text-[#52605b] hover:border-[#87968f]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {eventsLoading ? (
            <div role="status" className="mt-4 rounded-lg border border-[#e1e7e3] bg-white px-6 py-12 text-center text-sm text-[#687570]">Loading events…</div>
          ) : visibleEvents.length ? (
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleEvents.map((event) => (
                <article key={event.id} className="vv-event-card group min-w-0 overflow-hidden rounded-lg border border-[#e1e7e3] bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e8ecff]">
                    <button
                      type="button"
                      onClick={() => openEvent(event)}
                      aria-label={`View tickets for ${event.title}`}
                      className="h-full w-full"
                    >
                      <ImageWithFallback
                        src={event.image}
                        alt={`${event.category} event at ${event.venue}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </button>
                    {event.tag && (
                      <span className="absolute bottom-3 left-3 rounded bg-[#d9ef72] px-2.5 py-1.5 text-[10px] font-extrabold uppercase text-[#1b1d29]">
                        {event.tag}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(event.id)}
                      aria-label={favorites.includes(event.id) ? `Remove ${event.title} from saved events` : `Save ${event.title}`}
                      aria-pressed={favorites.includes(event.id)}
                      className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors ${favorites.includes(event.id) ? 'text-[#e84855]' : 'text-[#3d4b46] hover:text-[#e84855]'}`}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(event.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-lg font-bold text-[#1b1d29]">{event.title}</h3>
                        <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-relaxed text-[#687570]">{event.subtitle}</p>
                      </div>
                      <span className="shrink-0 rounded bg-[#f3f6f3] px-2 py-1 text-[10px] font-bold text-[#52605b]">★ {event.rating}</span>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-[#52605b]">
                      <p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#e84855]" />{event.dateLabel}</p>
                      <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 text-[#e84855]" /><span className="truncate">{event.venue}</span></p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#edf0ed] pt-3">
                      <p className="text-[10px] text-[#76817c]">Starts at <strong className="block pt-0.5 text-sm text-[#1c2926]">{formatRupees(event.fromPrice)}</strong></p>
                      <button
                        type="button"
                        onClick={() => openEvent(event)}
                        className="vv-ticket-action inline-flex items-center gap-1.5 rounded-md bg-[#ff7859] px-3.5 py-2.5 text-xs font-extrabold text-[#202923] transition-colors hover:bg-[#ff967a]"
                      >
                        <Ticket className="h-3.5 w-3.5" /> Book seats
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-[#cdd7d1] bg-white px-6 py-12 text-center">
              <Search className="mx-auto h-6 w-6 text-[#84918b]" />
              <h3 className="mt-3 font-display text-lg font-extrabold">No events found</h3>
              <p className="mt-1 text-sm text-[#687570]">Try another search, category or city.</p>
              <button
                type="button"
                onClick={() => { setSearch(''); setCategory('Everything'); }}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#d73e4b]"
              >
                Reset your search <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>

        <footer className="mt-14 flex flex-col gap-3 border-t border-[#e0e7e2] pt-5 text-xs text-[#687570] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Showflow · Every city has a soundtrack.</span>
          <button type="button" onClick={() => onNavigate('dashboard')} className="inline-flex items-center gap-1 self-start font-semibold hover:text-[#e84855] sm:self-auto">
            Event organiser? <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </footer>
      </main>
    </div>
  );
};
