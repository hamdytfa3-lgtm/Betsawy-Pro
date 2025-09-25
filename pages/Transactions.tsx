import React, { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { TransactionType } from '../types';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';

const Transactions: React.FC = () => {
    const { transactions, items, suppliers, customers } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const getTransactionColor = (type: TransactionType) => {
        switch (type) {
            case TransactionType.PURCHASE: return 'bg-green-100 text-green-800';
            case TransactionType.SALE: return 'bg-blue-100 text-blue-800';
            case TransactionType.PURCHASE_RETURN: return 'bg-yellow-100 text-yellow-800';
            case TransactionType.SALE_RETURN: return 'bg-orange-100 text-orange-800';
            case TransactionType.TRANSFER: return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="flex-1">
            <Header title="الحركات المخزنية" />
            <main className="p-8 bg-gray-50">
                 <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700">سجل الحركات</h2>
                    <button 
                        onClick={handleOpenModal}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        إضافة حركة جديدة
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">الصنف</th>
                                <th scope="col" className="px-6 py-3">نوع الحركة</th>
                                <th scope="col" className="px-6 py-3">الكمية</th>
                                <th scope="col" className="px-6 py-3">الطرف المرتبط</th>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => {
                                const item = items.find(i => i.id === tx.itemId);
                                const party = tx.type === TransactionType.PURCHASE || tx.type === TransactionType.PURCHASE_RETURN
                                    ? suppliers.find(s => s.id === tx.relatedPartyId)
                                    : customers.find(c => c.id === tx.relatedPartyId);

                                return (
                                <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{item?.name || 'غير معروف'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTransactionColor(tx.type)}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold">{tx.quantity}</td>
                                    <td className="px-6 py-4">{party?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{tx.date}</td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="إضافة حركة جديدة">
                    <TransactionForm onClose={handleCloseModal} />
                </Modal>
            )}
        </div>
    );
};

export default Transactions;