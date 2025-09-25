import { useState } from 'react';
import { Item, Supplier, Customer, Transaction, TransactionType, NewItem, NewSupplier, NewCustomer, NewTransaction } from '../types';

const initialItems: Item[] = [
  { id: '1', name: 'لابتوب ديل G15', code: 'LP-DEL-G15', barcode: '8991234567890', unit: 'قطعة', category: 'إلكترونيات', supplierId: '1', stock: 15, reorderPoint: 5, price: 25500, imageUrl: 'https://picsum.photos/400/300?random=1' },
  { id: '2', name: 'شاشة سامسونج 27 بوصة', code: 'MN-SAM-27', barcode: '8991234567891', unit: 'قطعة', category: 'إلكترونيات', supplierId: '2', stock: 8, reorderPoint: 3, price: 4200, imageUrl: 'https://picsum.photos/400/300?random=2' },
  { id: '3', name: 'طابعة HP ليزر', code: 'PR-HP-LSR', barcode: '8991234567892', unit: 'قطعة', category: 'أجهزة مكتبية', supplierId: '1', stock: 25, reorderPoint: 10, price: 3850, imageUrl: 'https://picsum.photos/400/300?random=3' },
  { id: '4', name: 'ورق تصوير A4', code: 'PP-A4', barcode: '8991234567893', unit: 'رزنة', category: 'مستلزمات مكتبية', supplierId: '3', stock: 150, reorderPoint: 50, price: 85, imageUrl: 'https://picsum.photos/400/300?random=4' },
];

const initialSuppliers: Supplier[] = [
  { id: '1', name: 'شركة الأجهزة الحديثة', phone: '01012345678', address: '123 شارع التكنولوجيا, القاهرة', taxId: '123-456-789' },
  { id: '2', name: 'مجموعة سامسونج مصر', phone: '01198765432', address: '456 ميدان التحرير, القاهرة', taxId: '987-654-321' },
  { id: '3', name: 'الموردون المتحدون', phone: '01234567890', address: '789 شارع النيل, الجيزة', taxId: '456-789-123' },
];

const initialCustomers: Customer[] = [
  { id: '1', name: 'العميل التجاري الأول', phone: '01511122233', address: '1 ش الخليفة المأمون, مصر الجديدة' },
  { id: '2', name: 'شركة النور الهندسية', phone: '01099887766', address: '55 ش عباس العقاد, مدينة نصر' },
];

const initialTransactions: Transaction[] = [
    {id: 't1', itemId: '1', type: TransactionType.PURCHASE, quantity: 10, date: '2023-10-01', relatedPartyId: '1' },
    {id: 't2', itemId: '1', type: TransactionType.SALE, quantity: 2, date: '2023-10-05', relatedPartyId: '1' },
    {id: 't3', itemId: '2', type: TransactionType.PURCHASE, quantity: 5, date: '2023-10-02', relatedPartyId: '2' },
    {id: 't4', itemId: '4', type: TransactionType.SALE, quantity: 20, date: '2023-10-10', relatedPartyId: '2' },
];


export const useMockData = () => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // --- Item Functions ---
  const addItem = (item: NewItem) => {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      imageUrl: `https://picsum.photos/400/300?random=${items.length + 5}`, // Get a new random image
    };
    setItems(prevItems => [newItem, ...prevItems]);
  };
  
  const updateItem = (updatedItem: Item) => {
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // --- Supplier Functions ---
  const addSupplier = (supplier: NewSupplier) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
    };
    setSuppliers(prevSuppliers => [newSupplier, ...prevSuppliers]);
  };

  const updateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prevSuppliers => prevSuppliers.map(supplier => supplier.id === updatedSupplier.id ? updatedSupplier : supplier));
  };

  const deleteSupplier = (supplierId: string) => {
    setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== supplierId));
  };

  // --- Customer Functions ---
  const addCustomer = (customer: NewCustomer) => {
    const newCustomer: Customer = {
        ...customer,
        id: Date.now().toString(),
    };
    setCustomers(prevCustomers => [newCustomer, ...prevCustomers]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
      setCustomers(prevCustomers => prevCustomers.map(customer => customer.id === updatedCustomer.id ? updatedCustomer : customer));
  };

  const deleteCustomer = (customerId: string) => {
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== customerId));
  };

  // --- Transaction Functions ---
  const addTransaction = (transaction: NewTransaction) => {
    const newTransaction: Transaction = {
        ...transaction,
        id: `t${Date.now()}`,
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Update item stock based on transaction type
    setItems(prevItems => prevItems.map(item => {
        if (item.id === transaction.itemId) {
            let newStock = item.stock;
            switch (transaction.type) {
                case TransactionType.PURCHASE:
                case TransactionType.SALE_RETURN:
                    newStock += transaction.quantity;
                    break;
                case TransactionType.SALE:
                case TransactionType.PURCHASE_RETURN:
                    newStock -= transaction.quantity;
                    break;
                // No stock change for internal transfer in this implementation
                case TransactionType.TRANSFER:
                    break;
            }
            return { ...item, stock: Math.max(0, newStock) }; // Ensure stock doesn't go below zero
        }
        return item;
    }));
  };


  return { items, suppliers, customers, transactions, addItem, updateItem, deleteItem, addSupplier, updateSupplier, deleteSupplier, addCustomer, updateCustomer, deleteCustomer, addTransaction };
};