const API_BASE_URL = 'http://localhost:8080/api/v1';

// API Client Configuration
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Type Definitions
export interface Beer {
  id?: number;
  version?: number;
  beerName: string;
  beerStyle: string;
  upc: string;
  quantityOnHand: number;
  price: number;
  createdDate?: string;
  updatedDate?: string;
}

export interface Customer {
  id?: number;
  version?: number;
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface BeerOrderLine {
  id?: number;
  version?: number;
  beerId: number;
  beer?: Beer;
  orderQuantity: number;
  quantityAllocated?: number;
  status?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface BeerOrder {
  id?: number;
  version?: number;
  customerRef: string;
  paymentAmount?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdDate?: string;
  updatedDate?: string;
  beerOrderLines?: BeerOrderLine[];
}

export interface CreateBeerOrderCommand {
  customerRef: string;
  orderLines: Array<{
    beerId: number;
    orderQuantity: number;
  }>;
}

export interface BeerOrderShipment {
  id?: number;
  version?: number;
  shipmentDate: string;
  carrier: string;
  trackingNumber: string;
  beerOrderId: number;
  createdDate?: string;
  updatedDate?: string;
}

// API Service Functions
export const beerService = {
  getAll: () => apiClient.get<Beer[]>('/beers'),
  getById: (id: number) => apiClient.get<Beer>(`/beers/${id}`),
  create: (beer: Omit<Beer, 'id' | 'version' | 'createdDate' | 'updatedDate'>) => 
    apiClient.post<Beer>('/beers', beer),
  update: (id: number, beer: Omit<Beer, 'id' | 'createdDate' | 'updatedDate'>) => 
    apiClient.put<Beer>(`/beers/${id}`, beer),
  delete: (id: number) => apiClient.delete(`/beers/${id}`),
};

export const customerService = {
  getAll: () => apiClient.get<Customer[]>('/customers'),
  getById: (id: number) => apiClient.get<Customer>(`/customers/${id}`),
  create: (customer: Omit<Customer, 'id' | 'version' | 'createdDate' | 'updatedDate'>) => 
    apiClient.post<Customer>('/customers', customer),
  update: (id: number, customer: Omit<Customer, 'id' | 'createdDate' | 'updatedDate'>) => 
    apiClient.put<Customer>(`/customers/${id}`, customer),
  delete: (id: number) => apiClient.delete(`/customers/${id}`),
};

export const beerOrderService = {
  getAll: (customerRef?: string) => {
    const endpoint = customerRef ? `/beer-orders?customerRef=${customerRef}` : '/beer-orders';
    return apiClient.get<BeerOrder[]>(endpoint);
  },
  getById: (id: number) => apiClient.get<BeerOrder>(`/beer-orders/${id}`),
  create: (order: CreateBeerOrderCommand) => apiClient.post<BeerOrder>('/beer-orders', order),
  updateStatus: (id: number, status: BeerOrder['status']) => 
    apiClient.put<BeerOrder>(`/beer-orders/${id}/status`, { status }),
  delete: (id: number) => apiClient.delete(`/beer-orders/${id}`),
};

export const shipmentService = {
  getAll: (beerOrderId?: number) => {
    const endpoint = beerOrderId ? `/beer-order-shipments?beerOrderId=${beerOrderId}` : '/beer-order-shipments';
    return apiClient.get<BeerOrderShipment[]>(endpoint);
  },
  getById: (id: number) => apiClient.get<BeerOrderShipment>(`/beer-order-shipments/${id}`),
  create: (shipment: Omit<BeerOrderShipment, 'id' | 'version' | 'createdDate' | 'updatedDate'>) => 
    apiClient.post<BeerOrderShipment>('/beer-order-shipments', shipment),
  update: (id: number, shipment: Omit<BeerOrderShipment, 'id' | 'version' | 'beerOrderId' | 'createdDate' | 'updatedDate'>) => 
    apiClient.put<BeerOrderShipment>(`/beer-order-shipments/${id}`, shipment),
  delete: (id: number) => apiClient.delete(`/beer-order-shipments/${id}`),
};