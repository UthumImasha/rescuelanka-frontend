'use client';

import React from 'react';
import { getUrgencyBadgeClass, getUrgencyIcon } from '@/lib/utils/emergency-utils';

interface Props {
  urgency: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function PriorityBadge({ 
  urgency, 
  size = 'md', 
  showIcon = true 
}: Props) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${getUrgencyBadgeClass(
        urgency
      )} ${sizeClasses[size]}`}
    >
      {showIcon && (
        <span className="mr-1">{getUrgencyIcon(urgency)}</span>
      )}
      {urgency}
    </span>
  );
}
