
import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconHome } from './icons/IconHome';
import { IconBox } from './icons/IconBox';
import { IconTruck } from './icons/IconTruck';
import { IconUsers } from './icons/IconUsers';
import { IconSwitchHorizontal } from './icons/IconSwitchHorizontal';
import { IconChartBar } from './icons/IconChartBar';
import { IconCog } from './icons/IconCog';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: IconHome },
  { name: 'الأصناف', href: '/items', icon: IconBox },
  { name: 'الموردين', href: '/suppliers', icon: IconTruck },
  { name: 'العملاء', href: '/customers', icon: IconUsers },
  { name: 'الحركات المخزنية', href: '/transactions', icon: IconSwitchHorizontal },
  { name: 'التقارير', href: '/reports', icon: IconChartBar },
  { name: 'الإعدادات', href: '/settings', icon: IconCog },
];

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white h-screen fixed">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <IconBox className="h-8 w-8 text-blue-400" />
        <h1 className="text-2xl font-bold ml-3">نظام المخزون</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
