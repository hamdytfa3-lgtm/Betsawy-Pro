import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { IconBox } from '../components/icons/IconBox';
import { IconTruck } from '../components/icons/IconTruck';
import { IconUsers } from '../components/icons/IconUsers';
import { IconSwitchHorizontal } from '../components/icons/IconSwitchHorizontal';
import { IconExclamation } from '../components/icons/IconExclamation';
import AiAssistant from '../components/AiAssistant';

const Dashboard: React.FC = () => {
    const { items, suppliers, customers, transactions } = useData();
    
    const lowStockItems = items.filter(item => item.stock <= item.reorderPoint);

    const chartData = items.map(item => ({
        name: item.name.length > 15 ? item.name.substring(0, 12) + '...' : item.name,
        'الكمية الحالية': item.stock,
        'حد إعادة الطلب': item.reorderPoint,
    }));

    return (
        <div className="flex-1">
            <Header title="لوحة التحكم" />
            <main className="p-8 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <DashboardCard 
                        title="إجمالي الأصناف" 
                        value={items.length} 
                        icon={<IconBox className="h-8 w-8 text-white" />}
                        color="bg-blue-500"
                    />
                     <DashboardCard 
                        title="نقص في المخزون" 
                        value={lowStockItems.length} 
                        icon={<IconBox className="h-8 w-8 text-white" />}
                        color="bg-red-500"
                    />
                    <DashboardCard 
                        title="إجمالي الموردين" 
                        value={suppliers.length} 
                        icon={<IconTruck className="h-8 w-8 text-white" />}
                        color="bg-green-500"
                    />
                    <DashboardCard 
                        title="إجمالي العملاء" 
                        value={customers.length} 
                        icon={<IconUsers className="h-8 w-8 text-white" />}
                        color="bg-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">مستويات المخزون الحالية</h2>
                         <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip wrapperStyle={{ fontFamily: 'Cairo' }}/>
                                <Legend wrapperStyle={{ fontFamily: 'Cairo' }} />
                                <Bar dataKey="الكمية الحالية" fill="#3b82f6" />
                                <Bar dataKey="حد إعادة الطلب" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                                <IconExclamation className="h-6 w-6 text-yellow-500 ml-3" />
                                تنبيهات إعادة الطلب
                            </h2>
                            <div className="space-y-3 max-h-48 overflow-y-auto pl-2">
                                {lowStockItems.length > 0 ? (
                                    lowStockItems.map(item => (
                                        <div key={item.id} className="flex items-center p-3 bg-yellow-50 rounded-md border-r-4 border-yellow-400">
                                            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover ml-4 flex-shrink-0" />}
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    الكمية الحالية: <span className="font-bold text-red-600">{item.stock}</span> / حد الطلب: {item.reorderPoint}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">لا توجد تنبيهات حالياً. المخزون في حالة جيدة.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4 text-gray-700">آخر الحركات</h2>
                            <div className="space-y-4">
                                {transactions.slice(0, 5).map(tx => {
                                    const item = items.find(i => i.id === tx.itemId);
                                    return (
                                    <div key={tx.id} className="flex items-center p-3 bg-gray-50 rounded-md">
                                        <div className="p-2 bg-blue-100 rounded-full ml-4">
                                        <IconSwitchHorizontal className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{item?.name}</p>
                                            <p className="text-sm text-gray-500">{tx.type} - الكمية: {tx.quantity}</p>
                                        </div>
                                        <div className="mr-auto text-left">
                                            <p className="text-xs text-gray-400">{tx.date}</p>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                
                <AiAssistant />
                
            </main>
        </div>
    );
};

export default Dashboard;