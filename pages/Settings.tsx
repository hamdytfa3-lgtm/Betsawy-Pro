
import React from 'react';
import Header from '../components/Header';
import { IconCog } from '../components/icons/IconCog';

const Settings: React.FC = () => {
    return (
        <div className="flex-1">
            <Header title="الإعدادات" />
            <main className="p-8 bg-gray-50 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div className="text-center">
                    <IconCog className="mx-auto h-24 w-24 text-gray-400 animate-spin-slow" />
                    <h2 className="mt-6 text-2xl font-bold text-gray-800">صفحة الإعدادات</h2>
                    <p className="mt-2 text-md text-gray-500">
                        هذه المنطقة مخصصة لإدارة المستخدمين والصلاحيات والنسخ الاحتياطي. <br/> سيتم تنفيذها قريباً.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Settings;
