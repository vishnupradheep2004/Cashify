// Order Service - Handles all MongoDB order operations

export interface OrderData {
  deviceId: string;
  deviceName: string;
  price: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  pincode: string;
  pickupDate: string;
  pickupTime: string;
  paymentMethod: "upi" | "bank";
  upiId?: string;
  bankAccount?: string;
  ifsc?: string;
}

export interface Order extends OrderData {
  _id?: string;
  orderId: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Function URL for MongoDB edge function
const MONGODB_API_URL = `${SUPABASE_URL}/functions/v1/mongodb-api`;

export const orderService = {
  async createOrder(orderData: OrderData): Promise<{ success: boolean; orderId: string; _id?: string; message: string }> {
    try {
      const response = await fetch(`${MONGODB_API_URL}?action=create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async listOrders(): Promise<{ success: boolean; orders: Order[]; total: number }> {
    try {
      const response = await fetch(`${MONGODB_API_URL}?action=list-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list orders: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error listing orders:', error);
      throw error;
    }
  },

  async getOrder(orderId: string): Promise<{ success: boolean; order: Order }> {
    try {
      const response = await fetch(`${MONGODB_API_URL}?action=get-order&orderId=${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  },

  async updateOrder(orderId: string, status: "pending" | "confirmed" | "completed" | "cancelled"): Promise<{ success: boolean; message: string; modifiedCount: number }> {
    try {
      const response = await fetch(`${MONGODB_API_URL}?action=update-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },
};
