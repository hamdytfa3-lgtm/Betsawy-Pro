import React from 'react';
import { useData } from '../../context/DataContext';

const ReorderAlertReport: React.FC = () => {
  const { items } = useData();
  const lowStockItems = items.filter(item => item.stock <= item.reorderPoint);

  if (lowStockItems.length === 0) {
    return <p className="text-center text-gray-500 py-8">لا توجد أصناف وصلت إلى حد إعادة الطلب حالياً.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">اسم الصنف</th>
            <th scope="col" className="px-6 py-3">الكود</th>
            <th scope="col" className="px-6 py-3">الكمية الحالية</th>
            <th scope="col" className="px-6 py-3">حد إعادة الطلب</th>
            <th scope="col" className="px-6 py-3">النقص</th>
          </tr>
        </thead>
        <tbody>
          {lowStockItems.map(item => (
            <tr key={item.id} className="bg-white border-b hover:bg-red-50">
              <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
              <td className="px-6 py-4">{item.code}</td>
              <td className="px-6 py-4">
                <span className="font-bold text-red-600">{item.stock}</span> {item.unit}
              </td>
              <td className="px-6 py-4">{item.reorderPoint}</td>
              <td className="px-6 py-4 font-bold text-red-700">
                {item.reorderPoint - item.stock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReorderAlertReport;
