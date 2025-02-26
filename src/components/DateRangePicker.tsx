"use client"

import React from 'react';

interface DateRangePickerProps {
  startDate?: string;
  endDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  startDate = "Sep 02", 
  endDate = "Sep 09" 
}) => {
  return (
    <div className="date-picker">
      <span className="font-inter">{startDate} - {endDate}</span>
    </div>
  );
};

export default DateRangePicker; 