import React, { createContext, useContext, ReactNode } from 'react';
import { Item, Supplier, Customer, Transaction, NewItem, NewSupplier, NewCustomer, NewTransaction } from '../types';
import { useMockData } from '../hooks/useMockData';

// Define the shape of the context data
interface DataContextProps {
  items: Item[];
  suppliers: Supplier[];
  customers: Customer[];
  transactions: Transaction[];
  addItem: (item: NewItem) => void;
  updateItem: (item: Item) => void;
  deleteItem: (itemId: string) => void;
  addSupplier: (supplier: NewSupplier) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (supplierId: string) => void;
  addCustomer: (customer: NewCustomer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  addTransaction: (transaction: NewTransaction) => void;
}

// Create the context
const DataContext = createContext<DataContextProps | undefined>(undefined);

// Create the provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const data = useMockData();
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

// Create a custom hook for easy context consumption
export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};