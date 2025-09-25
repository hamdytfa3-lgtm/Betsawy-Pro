import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Transaction, TransactionType } from '../../types';

const SupplierAccountReport: React.FC = () => {
  const { suppliers, transactions, items } = useData();
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [reportData, setReportData] = useState<Transaction[]>([]);

  useEffect(() => {
    if (selectedSupplierId) {
      const filtered = transactions.filter(tx =>
        tx.relatedPartyId === selectedSupplierId &&
        (tx.type === TransactionType.PURCHASE || tx.type === TransactionType.PURCHASE_RETURN)
      );
      setReportData(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
      setReportData([]);
    }
  }, [selectedSupplierId, transactions]);

  return (
    <div>
      <div className="max-w-md mb-6">
        <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">اختر المورد لعرض كشف الحساب</label>
        <select
          id="supplier"
          value={selectedSupplierId}
          onChange={e => setSelectedSupplierId(e.target.value)}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- اختر مورد --</option>
          {suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
        </select>
      </div>

      {selectedSupplierId && (
        reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">التاريخ</th>
                  <th scope="col" className="px-6 py-3">الصنف</th>
                  <th scope="col" className="px-6 py-3">نوع الحركة</th>
                  <th scope="col" className="px-6 py-3">الكمية</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(tx => {
                    const item = items.find(i => i.id === tx.itemId);
                    return (
                        <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{tx.date}</td>
                            <td className="px-6 py-4 font-medium">{item?.name || 'غير معروف'}</td>
                            <td className="px-6 py-4">{tx.type}</td>
                            <td className="px-6 py-4 font-bold">{tx.quantity}</td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">لا توجد حركات مسجلة لهذا المورد.</p>
        )
      )}
    </div>
  );
};

export default SupplierAccountReport;
