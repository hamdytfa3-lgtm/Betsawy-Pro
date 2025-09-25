import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { NewTransaction, TransactionType, Supplier, Customer } from '../types';

interface TransactionFormProps {
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const { items, suppliers, customers, addTransaction } = useData();
  
  const initialFormState: NewTransaction = {
    itemId: items[0]?.id || '',
    type: TransactionType.PURCHASE,
    quantity: 1,
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
    relatedPartyId: suppliers[0]?.id || '',
  };

  const [formData, setFormData] = useState<NewTransaction>(initialFormState);
  const [relatedParties, setRelatedParties] = useState<(Supplier | Customer)[]>(suppliers);

  useEffect(() => {
    let currentParties: (Supplier | Customer)[] = [];
    let defaultPartyId = '';

    switch (formData.type) {
      case TransactionType.PURCHASE:
      case TransactionType.PURCHASE_RETURN:
        currentParties = suppliers;
        defaultPartyId = suppliers[0]?.id || '';
        break;
      case TransactionType.SALE:
      case TransactionType.SALE_RETURN:
        currentParties = customers;
        defaultPartyId = customers[0]?.id || '';
        break;
      case TransactionType.TRANSFER:
        currentParties = [];
        defaultPartyId = ''; // No party for internal transfer
        break;
    }
    setRelatedParties(currentParties);
    // Update relatedPartyId only if the list changed and the current one is invalid
    if (!currentParties.some(p => p.id === formData.relatedPartyId)) {
       setFormData(prev => ({ ...prev, relatedPartyId: defaultPartyId }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.type, suppliers, customers]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId || (relatedParties.length > 0 && !formData.relatedPartyId)) {
        alert('الرجاء التأكد من اختيار صنف وجهة التعامل.');
        return;
    }
    if(formData.quantity <= 0) {
        alert('يجب أن تكون الكمية أكبر من صفر.');
        return;
    }
    
    addTransaction(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="itemId" className="block text-sm font-medium text-gray-700">الصنف*</label>
          <select name="itemId" id="itemId" value={formData.itemId} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
         <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">نوع الحركة*</label>
          <select name="type" id="type" value={formData.type} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {Object.values(TransactionType).map(type => (
                <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">الكمية*</label>
          <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} required min="1" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">التاريخ*</label>
          <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        {relatedParties.length > 0 && (
            <div className="md:col-span-2">
            <label htmlFor="relatedPartyId" className="block text-sm font-medium text-gray-700">الطرف المرتبط*</label>
            <select name="relatedPartyId" id="relatedPartyId" value={formData.relatedPartyId} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                {relatedParties.map(party => (
                <option key={party.id} value={party.id}>{party.name}</option>
                ))}
            </select>
            </div>
        )}
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          إلغاء
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
          حفظ الحركة
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;