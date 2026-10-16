export interface Uniform { id: string; guestName: string; guestPhone?: string; size?: string; color?: string; quantity: number; status: string; cost: number; }
export interface UniformStats { total: number; ordered: number; delivered: number; distributed: number; withUniform: number; withoutUniform: number; totalCost: number; }
export interface FabricProduct { id: string; sku: string; nameSw: string; nameEn: string; price: number; images: string[]; stock: number; colors: string[]; sizes: string[]; }
export interface OrderItem { id: string; productId: string; productName: string; imageUrl?: string; size?: string; color?: string; unitPrice: number; quantity: number; lineTotal: number; }
export interface Order { id: string; orderNumber: string; status: string; customerName: string; customerPhone: string; total: number; items: OrderItem[]; createdAt: string; }
