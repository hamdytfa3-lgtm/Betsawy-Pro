import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { NewItem, Item, EditableItem } from '../types';

interface ItemFormProps {
  onClose: () => void;
  itemToEdit?: Item | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ onClose, itemToEdit }) => {
  const { suppliers, addItem, updateItem } = useData();
  
  const initialFormState: EditableItem = {
    name: '',
    code: '',
    barcode: '',
    unit: 'قطعة',
    category: '',
    supplierId: suppliers[0]?.id || '',
    stock: 0,
    reorderPoint: 0,
    price: 0,
  };

  const [formData, setFormData] = useState<EditableItem>(initialFormState);

  useEffect(() => {
    if (itemToEdit) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, imageUrl, ...editableFields } = itemToEdit;
      setFormData(editableFields);
    } else {
      setFormData(initialFormState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemToEdit, suppliers]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['stock', 'reorderPoint', 'price'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.category || !formData.supplierId) {
      alert('الرجاء ملء الحقول الإلزامية: الاسم، الكود، الفئة، والمورد.');
      return;
    }
    
    if (itemToEdit) {
        updateItem({ ...itemToEdit, ...formData });
    } else {
        addItem(formData as NewItem);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">اسم الصنف*</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">كود الصنف*</label>
          <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">باركود</label>
          <input type="text" name="barcode" id="barcode" value={formData.barcode} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">الفئة*</label>
          <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">المورد*</label>
          <select name="supplierId" id="supplierId" value={formData.supplierId} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
        </div>
         <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">وحدة القياس</label>
          <input type="text" name="unit" id="unit" value={formData.unit} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700">المخزون الحالي</label>
          <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} min="0" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">حد إعادة الطلب</label>
          <input type="number" name="reorderPoint" id="reorderPoint" value={formData.reorderPoint} onChange={handleChange} min="0" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">السعر</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          إلغاء
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
          {itemToEdit ? 'حفظ التعديلات' : 'حفظ الصنف'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;