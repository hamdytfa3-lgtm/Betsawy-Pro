
import React, { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { Supplier } from '../types';
import Modal from '../components/Modal';
import SupplierForm from '../components/SupplierForm';

const Suppliers: React.FC = () => {
    const { suppliers, deleteSupplier } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

    const handleOpenAddModal = () => {
        setEditingSupplier(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    const handleOpenDeleteConfirm = (supplier: Supplier) => {
        setSupplierToDelete(supplier);
    };

    const handleCloseDeleteConfirm = () => {
        setSupplierToDelete(null);
    };

    const handleConfirmDelete = () => {
        if(supplierToDelete) {
            deleteSupplier(supplierToDelete.id);
            handleCloseDeleteConfirm();
        }
    };

    return (
        <div className="flex-1">
            <Header title="إدارة الموردين" />
            <main className="p-8 bg-gray-50">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700">قائمة الموردين</h2>
                    <button 
                        onClick={handleOpenAddModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        إضافة مورد جديد
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المورد</th>
                                <th scope="col" className="px-6 py-3">الهاتف</th>
                                <th scope="col" className="px-6 py-3">العنوان</th>
                                <th scope="col" className="px-6 py-3">الرقم الضريبي</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(supplier => (
                                <tr key={supplier.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{supplier.name}</td>
                                    <td className="px-6 py-4">{supplier.phone}</td>
                                    <td className="px-6 py-4">{supplier.address}</td>
                                    <td className="px-6 py-4">{supplier.taxId}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenEditModal(supplier)} className="font-medium text-blue-600 hover:underline ml-4">تعديل</button>
                                        <button onClick={() => handleOpenDeleteConfirm(supplier)} className="font-medium text-red-600 hover:underline">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingSupplier ? 'تعديل بيانات المورد' : 'إضافة مورد جديد'}>
                    <SupplierForm onClose={handleCloseModal} supplierToEdit={editingSupplier} />
                </Modal>
            )}

            {supplierToDelete && (
                 <Modal isOpen={!!supplierToDelete} onClose={handleCloseDeleteConfirm} title="تأكيد الحذف">
                    <div className="text-center">
                        <p className="text-lg text-gray-700">
                            هل أنت متأكد من رغبتك في حذف المورد <span className="font-bold">"{supplierToDelete.name}"</span>؟
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

export default Suppliers;