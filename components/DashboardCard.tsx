
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="mr-6">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
