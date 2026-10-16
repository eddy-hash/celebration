export type OrderStatus = 'pending' | 'awaiting_payment' | 'paid' | 'cancelled' | 'fulfilled';
export interface OrderItem { id: string; productId: string; productName: string; imageUrl?: string; size?: string; color?: string; unitPrice: number; quantity: number; lineTotal: number; }
export interface Order { id: string; orderNumber: string; status: OrderStatus; customerName: string; customerPhone: string; total: number; currency: string; items: OrderItem[]; createdAt: string; }
