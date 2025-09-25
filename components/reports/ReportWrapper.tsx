import React from 'react';
import { IconArrowRight } from '../icons/IconArrowRight';

interface ReportWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const ReportWrapper: React.FC<ReportWrapperProps> = ({ title, onBack, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          <IconArrowRight className="transform scale-x-[-1]" />
          <span>العودة للتقارير</span>
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ReportWrapper;
