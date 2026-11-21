import React from 'react';

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

  const formatDate = (dateString: string) => {
    // Parse YYYY-MM-DD as a local date; new Date('YYYY-MM-DD') is UTC midnight,
    // which renders as the previous day in US time zones
    const [y, m, d] = dateString.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    // Use toDateString() instead of toLocaleDateString() to avoid hydration issues
    // toDateString() is consistent between server and client
    const formatted = date.toDateString();
    // Convert "Mon Jan 01 2024" to "January 1, 2024" format
    const parts = formatted.split(' ');
    const months = {
      'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
      'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
      'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
    };
    return `${months[parts[1] as keyof typeof months]} ${parseInt(parts[2])}, ${parts[3]}`;
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <div className={`w-2 h-2 rounded-full ${getStatusColor(lastUpdated)}`} />
      <span>{label} {formatDate(lastUpdated)}</span>
    </div>
  );
};

export default FreshnessIndicator; 