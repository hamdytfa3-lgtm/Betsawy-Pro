export interface Item {
  id: string;
  name: string;
  code: string;
  barcode: string;
  unit: string;
  category: string;
  supplierId: string;
  stock: number;
  reorderPoint: number;
  price: number;
  imageUrl?: string;
}

export type NewItem = Omit<Item, 'id' | 'imageUrl'>;

export type EditableItem = Omit<Item, 'id' | 'imageUrl'>;

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  taxId: string;
}

export type NewSupplier = Omit<Supplier, 'id'>;

export type EditableSupplier = Omit<Supplier, 'id'>;


export interface Customer {
  id:string;
  name: string;
  phone: string;
  address: string;
}

export type NewCustomer = Omit<Customer, 'id'>;

export type EditableCustomer = Omit<Customer, 'id'>;

export enum TransactionType {
  PURCHASE = 'شراء',
  SALE = 'بيع',
  PURCHASE_RETURN = 'مرتجع شراء',
  SALE_RETURN = 'مرتجع بيع',
  TRANSFER = 'تحويل داخلي',
}

export interface Transaction {
  id: string;
  itemId: string;
  type: TransactionType;
  quantity: number;
  date: string;
  relatedPartyId: string; // Supplier or Customer ID or empty for internal
}

export type NewTransaction = Omit<Transaction, 'id'>;