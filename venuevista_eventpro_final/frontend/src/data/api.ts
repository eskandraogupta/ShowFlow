import type { MarketEvent } from './events';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

export type ApiEvent = Omit<MarketEvent, 'image' | 'tag'> & {
  tag: string | null;
};

export interface CreateBookingRequest {
  eventId: string;
  seatCodes: string[];
  showtime: string;
  fullName: string;
  email: string;
  phone: string;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING';
}

export interface BookingResponse {
  bookingId: string;
  eventId: string;
  eventTitle: string;
  seatCodes: string[];
  showtime: string;
  fullName: string;
  email: string;
  subtotal: number;
  facilityFee: number;
  serviceFee: number;
  taxes: number;
  total: number;
  status: 'RESERVED' | 'CANCELLED';
  createdAt: string;
}

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError('Unable to reach Showflow. Check that the backend is running and try again.');
  }

  if (!response.ok) {
    let message = response.status === 502 || response.status === 503
      ? 'The booking service is unavailable. From the project root run `npm run dev` to start the frontend and backend together.'
      : `Request failed (${response.status}). Please try again.`;
    try {
      const body = await response.json() as { detail?: string; message?: string };
      message = body.detail || body.message || message;
    } catch {
      // Keep the status based message when the server did not return JSON.
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export function fetchEvents(signal?: AbortSignal): Promise<ApiEvent[]> {
  return request<ApiEvent[]>('/events', { signal });
}

export function createBooking(payload: CreateBookingRequest): Promise<BookingResponse> {
  return request<BookingResponse>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchBookings(): Promise<BookingResponse[]> {
  return request<BookingResponse[]>('/bookings');
}

export function cancelBooking(bookingId: string): Promise<BookingResponse> {
  return request<BookingResponse>(`/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: 'PATCH',
  });
}
