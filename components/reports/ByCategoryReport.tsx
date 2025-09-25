import React from 'react';
import { useData } from '../../context/DataContext';
import { Item } from '../../types';

const ByCategoryReport: React.FC = () => {
  const { items } = useData();

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'غير مصنف';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="text-lg font-bold text-gray-700 mb-3 p-3 bg-gray-100 rounded-md">{category} ({categoryItems.length} أصناف)</h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm text-right text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">اسم الصنف</th>
                  <th scope="col" className="px-6 py-3">الكود</th>
                  <th scope="col" className="px-6 py-3">الكمية الحالية</th>
                </tr>
              </thead>
              <tbody>
                {categoryItems.map(item => (
                  <tr key={item.id} className="bg-white border-b last:border-b-0 hover:bg-gray-50">
                     <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                     <td className="px-6 py-4">{item.code}</td>
                     <td className="px-6 py-4 font-bold">{item.stock} {item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ByCategoryReport;
