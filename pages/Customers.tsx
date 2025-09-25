import React, { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { Customer } from '../types';
import Modal from '../components/Modal';
import CustomerForm from '../components/CustomerForm';

const Customers: React.FC = () => {
    const { customers, deleteCustomer } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const handleOpenAddModal = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleOpenDeleteConfirm = (customer: Customer) => {
        setCustomerToDelete(customer);
    };

    const handleCloseDeleteConfirm = () => {
        setCustomerToDelete(null);
    };

    const handleConfirmDelete = () => {
        if(customerToDelete) {
            deleteCustomer(customerToDelete.id);
            handleCloseDeleteConfirm();
        }
    };

    return (
        <div className="flex-1">
            <Header title="إدارة العملاء" />
            <main className="p-8 bg-gray-50">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700">قائمة العملاء</h2>
                    <button 
                        onClick={handleOpenAddModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        إضافة عميل جديد
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم العميل</th>
                                <th scope="col" className="px-6 py-3">الهاتف</th>
                                <th scope="col" className="px-6 py-3">العنوان</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{customer.address}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenEditModal(customer)} className="font-medium text-blue-600 hover:underline ml-4">تعديل</button>
                                        <button onClick={() => handleOpenDeleteConfirm(customer)} className="font-medium text-red-600 hover:underline">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}>
                    <CustomerForm onClose={handleCloseModal} customerToEdit={editingCustomer} />
                </Modal>
            )}

            {customerToDelete && (
                 <Modal isOpen={!!customerToDelete} onClose={handleCloseDeleteConfirm} title="تأكيد الحذف">
                    <div className="text-center">
                        <p className="text-lg text-gray-700">
                            هل أنت متأكد من رغبتك في حذف العميل <span className="font-bold">"{customerToDelete.name}"</span>؟
                        </p>
                        <p className="mt-2 text-sm text-red-600">
                            تحذير: لا يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                             <button type="button" onClick={handleCloseDeleteConfirm} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                إلغاء
                            </button>
                            <button type="button" onClick={handleConfirmDelete} className="px-6 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700">
                                حذف
                            </button>
                        </div>
                    </div>
                 </Modal>
            )}
        </div>
    );
};

export default Customers;