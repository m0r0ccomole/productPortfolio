import React from 'react';
import { formatIsoDate } from '../lib/formatDate';

interface FreshnessIndicatorProps {
  label: string; // ui-labels "last-updated"
  lastUpdated?: string;
}

const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({
  label,
  lastUpdated = process.env.LAST_UPDATED as string
}) => {
  const getStatusColor = (dateString: string) => {
    const lastUpdateDate = new Date(dateString);
    const now = new Date();
    const daysDifference = Math.floor((now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference <= 30) {
      return 'bg-green-500'; // Fresh
    } else if (daysDifference <= 60) {
      return 'bg-yellow-500'; // Aging
    } else {
      return 'bg-red-500'; // Stale
    }
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <div className={`w-2 h-2 rounded-full ${getStatusColor(lastUpdated)}`} />
      <span>{label} {formatIsoDate(lastUpdated)}</span>
    </div>
  );
};

export default FreshnessIndicator; 