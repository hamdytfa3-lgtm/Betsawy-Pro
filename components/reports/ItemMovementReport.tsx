import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Transaction } from '../../types';

const ItemMovementReport: React.FC = () => {
  const { items, transactions, suppliers, customers } = useData();
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<Transaction[] | null>(null);

  const handleGenerateReport = () => {
    if (!selectedItemId) {
      alert('الرجاء اختيار صنف أولاً.');
      return;
    }

    const filtered = transactions.filter(tx => {
      let match = tx.itemId === selectedItemId;
      if (startDate) {
        match = match && new Date(tx.date) >= new Date(startDate);
      }
      if (endDate) {
        match = match && new Date(tx.date) <= new Date(endDate);
      }
      return match;
    });

    setReportData(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded-md mb-6 bg-gray-50">
        <div className="md:col-span-2">
          <label htmlFor="item" className="block text-sm font-medium text-gray-700">اختر الصنف*</label>
          <select
            id="item"
            value={selectedItemId}
            onChange={e => setSelectedItemId(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- اختر صنف --</option>
            {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">من تاريخ</label>
          <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">إلى تاريخ</label>
          <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={!selectedItemId}
          className="md:col-span-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          عرض التقرير
        </button>
      </div>

      {reportData && (
        reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">التاريخ</th>
                  <th scope="col" className="px-6 py-3">نوع الحركة</th>
                  <th scope="col" className="px-6 py-3">الكمية</th>
                  <th scope="col" className="px-6 py-3">الطرف المرتبط</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(tx => {
                    const party = tx.type.includes('شراء') 
                        ? suppliers.find(s => s.id === tx.relatedPartyId)
                        : customers.find(c => c.id === tx.relatedPartyId);
                    return (
                        <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{tx.date}</td>
                            <td className="px-6 py-4 font-medium">{tx.type}</td>
                            <td className="px-6 py-4 font-bold">{tx.quantity}</td>
                            <td className="px-6 py-4">{party?.name || 'N/A'}</td>
                        </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">لا توجد حركات لهذا الصنف في الفترة المحددة.</p>
        )
      )}
    </div>
  );
};

export default ItemMovementReport;
