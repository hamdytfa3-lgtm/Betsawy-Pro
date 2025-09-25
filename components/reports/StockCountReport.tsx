import React from 'react';
import { useData } from '../../context/DataContext';

const StockCountReport: React.FC = () => {
  const { items } = useData();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">اسم الصنف</th>
            <th scope="col" className="px-6 py-3">الكود</th>
            <th scope="col" className="px-6 py-3">الفئة</th>
            <th scope="col" className="px-6 py-3">وحدة القياس</th>
            <th scope="col" className="px-6 py-3">الكمية الحالية</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover ml-4" />}
                {item.name}
              </td>
              <td className="px-6 py-4">{item.code}</td>
              <td className="px-6 py-4">{item.category}</td>
              <td className="px-6 py-4">{item.unit}</td>
              <td className="px-6 py-4 font-bold">{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockCountReport;
