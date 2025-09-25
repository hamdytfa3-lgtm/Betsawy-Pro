import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { TransactionType } from '../../types';
import DashboardCard from '../DashboardCard';
import { IconCalculator } from '../icons/IconCalculator';

type Period = 'week' | 'month' | 'year';

const CogsReport: React.FC = () => {
    const { transactions, items } = useData();
    const [period, setPeriod] = useState<Period>('month');

    const { filteredTransactions, totalCost } = useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }
        startDate.setHours(0, 0, 0, 0);

        const sales = transactions.filter(tx => tx.type === TransactionType.SALE);

        const filtered = sales.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate >= startDate && txDate <= now;
        });

        let cost = 0;
        const transactionsWithCost = filtered.map(tx => {
            const item = items.find(i => i.id === tx.itemId);
            const itemCost = (item?.price || 0) * tx.quantity;
            cost += itemCost;
            return {
                ...tx,
                item,
                itemCost,
            };
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { filteredTransactions: transactionsWithCost, totalCost: cost };
    }, [period, transactions, items]);
    
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' });
    };
    
    const PeriodButton: React.FC<{
        label: string;
        value: Period;
        current: Period;
        onClick: (value: Period) => void;
    }> = ({ label, value, current, onClick }) => (
        <button
            onClick={() => onClick(value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                current === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6 p-4 border rounded-md bg-gray-50">
                <div className="flex gap-2">
                    <PeriodButton label="الأسبوع الحالي" value="week" current={period} onClick={setPeriod} />
                    <PeriodButton label="الشهر الحالي" value="month" current={period} onClick={setPeriod} />
                    <PeriodButton label="العام الحالي" value="year" current={period} onClick={setPeriod} />
                </div>
            </div>

            <div className="mb-8 max-w-sm mx-auto">
                 <DashboardCard 
                    title="إجمالي تكلفة المنصرف"
                    value={formatCurrency(totalCost)}
                    icon={<IconCalculator className="h-8 w-8 text-white" />}
                    color="bg-purple-500"
                />
            </div>

            {filteredTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                                <th scope="col" className="px-6 py-3">اسم الصنف</th>
                                <th scope="col" className="px-6 py-3">الكمية</th>
                                <th scope="col" className="px-6 py-3">سعر الوحدة</th>
                                <th scope="col" className="px-6 py-3">التكلفة الإجمالية</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{tx.date}</td>
                                    <td className="px-6 py-4 font-medium">{tx.item?.name || 'غير معروف'}</td>
                                    <td className="px-6 py-4">{tx.quantity}</td>
                                    <td className="px-6 py-4">{formatCurrency(tx.item?.price || 0)}</td>
                                    <td className="px-6 py-4 font-bold">{formatCurrency(tx.itemCost)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">لا توجد حركات بيع في الفترة المحددة.</p>
            )}
        </div>
    );
};

export default CogsReport;
