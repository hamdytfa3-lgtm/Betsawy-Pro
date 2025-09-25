import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { NewSupplier, Supplier, EditableSupplier } from '../types';

interface SupplierFormProps {
  onClose: () => void;
  supplierToEdit?: Supplier | null;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onClose, supplierToEdit }) => {
  const { addSupplier, updateSupplier } = useData();
  
  const initialFormState: EditableSupplier = {
    name: '',
    phone: '',
    address: '',
    taxId: '',
  };

  const [formData, setFormData] = useState<EditableSupplier>(initialFormState);

  useEffect(() => {
    if (supplierToEdit) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...editableFields } = supplierToEdit;
      setFormData(editableFields);
    } else {
      setFormData(initialFormState);
    }
  }, [supplierToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('الرجاء ملء الحقول الإلزامية: اسم المورد والهاتف.');
      return;
    }
    
    if (supplierToEdit) {
        updateSupplier({ ...supplierToEdit, ...formData });
    } else {
        addSupplier(formData as NewSupplier);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">اسم المورد*</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">رقم الهاتف*</label>
          <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">العنوان</label>
          <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">الرقم الضريبي</label>
          <input type="text" name="taxId" id="taxId" value={formData.taxId} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          إلغاء
        </button>
        <button type="submit" className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
          {supplierToEdit ? 'حفظ التعديلات' : 'حفظ المورد'}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;