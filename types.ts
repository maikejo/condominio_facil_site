export interface User {
  id: string;
  name: string;
  role: 'admin' | 'resident';
  avatar?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  important: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  description: string;
  capacity: number;
  imageUrl: string;
  price?: number;
}

export interface Reservation {
  id: string;
  amenityId: string;
  userId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'completed';
  date: string;
  location: string;
}

export type PageRoute = 'landing' | 'dashboard' | 'notices' | 'reservations' | 'maintenance' | 'settings';