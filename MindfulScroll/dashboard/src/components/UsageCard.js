import React from 'react';

const UsageCard = ({ data, isDarkMode }) => {
  const totalTime = data.reduce((acc, item) => acc + item.durationInSeconds, 0);
  const hours = Math.floor(totalTime / 3600);
  const minutes = Math.floor((totalTime % 3600) / 60);

  return (
    <div className={`p-3 rounded-lg shadow-md transition-colors duration-200 ${
      isDarkMode ? 'bg-dark-card text-dark-text' : 'bg-light-card text-light-text'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">Today's Usage</h2>
        <div className="text-sm font-medium">
          {hours}h {minutes}m
        </div>
      </div>
      <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
        {data.map((item, index) => (
          <div 
            key={index} 
            className={`flex justify-between items-center py-1 px-2 rounded ${
              isDarkMode ? 'hover:bg-dark-bg' : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-sm truncate mr-2">{item.url}</span>
            <span className="text-sm font-medium whitespace-nowrap">
              {Math.round(item.durationInSeconds / 60)}m
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageCard; 