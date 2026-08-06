export interface LoginRequest { email: string; password: string }
export interface RegisterRequest { name: string; email: string; password: string; role: string }
export interface AuthenticationResponse { token: string; userId: number; name: string; role: string }
export interface UserResponse { id: number; name: string; email: string; role: string }

export interface PropertyRequest {
  title: string;
  description: string;
  type: string;      // FURNISHED | UNFURNISHED | EMPTY | READY_TO_MOVEIN | UNDER_CONSTRUCTION
  status: string;    // AVAILABLE | SOLD | RENTED
  price: number;
  location: string;
  bedrooms: number;
  area: number;
  bathrooms: number;
}
export interface PropertyResponse {
  id: number;
  title: string;
  type: string;
  status: string;
  price: number;
  location: string;
  agentName: string;
  imageUrls: string[];
  bedrooms: number;
  area: number;
  bathrooms: number;
  description?: string;
}

export interface ClientRequest {
  name: string; email: string; phone: string; budget: number; preferences: string;
}
export interface ClientResponse extends ClientRequest { id: number; agentName: string }

export interface DealRequest {
  propertyId: number; clientId: number; finalPrice: number; status: string;
}
export interface DealResponse {
  id: number; propertyTitle: string; clientName: string;
  agentName: string; finalPrice: number; status: string;
}

export interface BlogRequest {
  title: string; slug: string; content: string; coverImageUrl: string;
}
export interface BlogResponse extends BlogRequest {
  id: number;
  createdAt?: string;
}
