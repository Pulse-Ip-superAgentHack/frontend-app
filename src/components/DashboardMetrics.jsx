import React from 'react';

const DashboardMetrics = () => {
  return (
    <div className="dashboard-metrics-container">
      <div className="Temperature">
        <span>Temperature</span>
        <span className="dashboard-number">98.57°</span>
      </div>

      <div className="Oxygen">
        <span>Oxygen</span>
        <span className="dashboard-number">97.5%</span>
      </div>

      <div className="Pulse">
        <span>Pulse</span>
        <span className="dashboard-number">89</span> bpm
      </div>
    </div>
  );
};

export default DashboardMetrics; 