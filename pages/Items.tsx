import React, { useState } from 'react';
import Header from '../components/Header';
import { Item } from '../types';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import ItemForm from '../components/ItemForm';

const Items: React.FC = () => {
    const { items, deleteItem } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: Item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleOpenDeleteConfirm = (item: Item) => {
        setItemToDelete(item);
    };

    const handleCloseDeleteConfirm = () => {
        setItemToDelete(null);
    };

    const handleConfirmDelete = () => {
        if(itemToDelete) {
            deleteItem(itemToDelete.id);
            handleCloseDeleteConfirm();
        }
    };

    return (
        <div className="flex-1">
            <Header title="إدارة الأصناف" />
            <main className="p-8 bg-gray-50">
                 <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700">قائمة الأصناف</h2>
                    <button 
                        onClick={handleOpenAddModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        إضافة صنف جديد
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">#</th>
                                <th scope="col" className="px-6 py-3">اسم الصنف</th>
                                <th scope="col" className="px-6 py-3">الكود</th>
                                <th scope="col" className="px-6 py-3">الفئة</th>
                                <th scope="col" className="px-6 py-3">السعر</th>
                                <th scope="col" className="px-6 py-3">الكمية المتاحة</th>
                                <th scope="col" className="px-6 py-3">حد إعادة الطلب</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: Item, index: number) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                                       {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover ml-4" />}
                                       {item.name}
                                    </td>
                                    <td className="px-6 py-4">{item.code}</td>
                                    <td className="px-6 py-4">{item.category}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{item.price.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.stock > item.reorderPoint ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.stock} {item.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{item.reorderPoint}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenEditModal(item)} className="font-medium text-blue-600 hover:underline ml-4">تعديل</button>
                                        <button onClick={() => handleOpenDeleteConfirm(item)} className="font-medium text-red-600 hover:underline">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}>
                    <ItemForm onClose={handleCloseModal} itemToEdit={editingItem} />
                </Modal>
            )}

            {itemToDelete && (
                 <Modal isOpen={!!itemToDelete} onClose={handleCloseDeleteConfirm} title="تأكيد الحذف">
                    <div className="text-center">
                        <p className="text-lg text-gray-700">
                            هل أنت متأكد من رغبتك في حذف الصنف <span className="font-bold">"{itemToDelete.name}"</span>؟
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

export default Items;