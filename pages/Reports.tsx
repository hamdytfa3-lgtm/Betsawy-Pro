import React, { useState } from 'react';
import Header from '../components/Header';
import { IconChartBar } from '../components/icons/IconChartBar';
import { IconBox } from '../components/icons/IconBox';
import { IconExclamation } from '../components/icons/IconExclamation';
import { IconSwitchHorizontal } from '../components/icons/IconSwitchHorizontal';
import { IconTruck } from '../components/icons/IconTruck';
import { IconUsers } from '../components/icons/IconUsers';
import { IconCalculator } from '../components/icons/IconCalculator';
import ReportWrapper from '../components/reports/ReportWrapper';
import StockCountReport from '../components/reports/StockCountReport';
import ByCategoryReport from '../components/reports/ByCategoryReport';
import ReorderAlertReport from '../components/reports/ReorderAlertReport';
import ItemMovementReport from '../components/reports/ItemMovementReport';
import SupplierAccountReport from '../components/reports/SupplierAccountReport';
import CustomerAccountReport from '../components/reports/CustomerAccountReport';
import CogsReport from '../components/reports/CogsReport';

type ReportKey = 'STOCK_COUNT' | 'BY_CATEGORY' | 'ITEM_MOVEMENT' | 'REORDER_ALERT' | 'SUPPLIER_ACCOUNT' | 'CUSTOMER_ACCOUNT' | 'COGS';

const reportTypes = [
    { key: 'STOCK_COUNT' as ReportKey, title: "جرد المخزن", description: "عرض كامل لكل الأصناف والكميات الحالية في المخزن.", icon: <IconBox className="h-8 w-8 text-blue-500" /> },
    { key: 'BY_CATEGORY' as ReportKey, title: "أرصدة الأصناف حسب الفئة", description: "تقسيم المخزون حسب الفئات المختلفة.", icon: <IconChartBar className="h-8 w-8 text-teal-500" /> },
    { key: 'ITEM_MOVEMENT' as ReportKey, title: "حركة صنف خلال فترة", description: "تتبع كل الحركات الداخلة والخارجة لصنف معين.", icon: <IconSwitchHorizontal className="h-8 w-8 text-indigo-500" /> },
    { key: 'REORDER_ALERT' as ReportKey, title: "تنبيه الأصناف التي وصلت حد إعادة الطلب", description: "قائمة بالأصناف التي تحتاج إلى إعادة طلب بشكل عاجل.", icon: <IconExclamation className="h-8 w-8 text-red-500" /> },
    { key: 'SUPPLIER_ACCOUNT' as ReportKey, title: "حسابات الموردين", description: "كشف حساب لكل مورد والفواتير المرتبطة به.", icon: <IconTruck className="h-8 w-8 text-green-500" /> },
    { key: 'CUSTOMER_ACCOUNT' as ReportKey, title: "حسابات العملاء", description: "كشف حساب لكل عميل وعمليات البيع الخاصة به.", icon: <IconUsers className="h-8 w-8 text-yellow-500" /> },
    { key: 'COGS' as ReportKey, title: "تقرير تكلفة المنصرف", description: "حساب تكلفة البضاعة المباعة خلال فترة زمنية محددة.", icon: <IconCalculator className="h-8 w-8 text-purple-500" /> },
];


const Reports: React.FC = () => {
    const [activeReport, setActiveReport] = useState<ReportKey | null>(null);

    const renderReport = () => {
        if (!activeReport) return null;

        const reportMap: Record<ReportKey, { title: string; component: React.ReactNode }> = {
            'STOCK_COUNT': { title: 'تقرير جرد المخزن', component: <StockCountReport /> },
            'BY_CATEGORY': { title: 'تقرير أرصدة الأصناف حسب الفئة', component: <ByCategoryReport /> },
            'ITEM_MOVEMENT': { title: 'تقرير حركة صنف خلال فترة', component: <ItemMovementReport /> },
            'REORDER_ALERT': { title: 'تقرير الأصناف تحت حد الطلب', component: <ReorderAlertReport /> },
            'SUPPLIER_ACCOUNT': { title: 'تقرير حسابات الموردين', component: <SupplierAccountReport /> },
            'CUSTOMER_ACCOUNT': { title: 'تقرير حسابات العملاء', component: <CustomerAccountReport /> },
            'COGS': { title: 'تقرير تكلفة المنصرف', component: <CogsReport /> },
        };

        const currentReport = reportMap[activeReport];

        return (
            <ReportWrapper title={currentReport.title} onBack={() => setActiveReport(null)}>
                {currentReport.component}
            </ReportWrapper>
        );
    };

    const ReportSelectionMenu = () => (
        <>
            <div className="text-center mb-10">
                <IconChartBar className="mx-auto h-16 w-16 text-gray-400" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">مركز التقارير</h2>
                <p className="mt-2 text-md text-gray-500">
                    اختر أحد التقارير المتاحة لعرض بيانات مفصلة عن عمليات المخزون.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTypes.map((report) => (
                    <div 
                        key={report.key} 
                        onClick={() => setActiveReport(report.key)}
                        className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-start cursor-pointer hover:shadow-lg hover:border-blue-500 border-2 border-transparent transition-all duration-300"
                    >
                        <div className="flex items-center mb-3">
                           {report.icon}
                           <h3 className="text-lg font-bold text-gray-800 mr-4">{report.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm">{report.description}</p>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <div className="flex-1">
            <Header title="التقارير" />
            <main className="p-8 bg-gray-50">
                {activeReport ? renderReport() : <ReportSelectionMenu />}
            </main>
        </div>
    );
};

export default Reports;