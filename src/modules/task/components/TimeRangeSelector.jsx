/**
 * @file TimeRangeSelector.jsx
 * @description Time range selector for dashboard filtering
 */

import React from 'react';

const TimeRangeSelector = ({ value, onChange }) => {
    const ranges = [
        { key: 'today', label: 'Hôm nay' },
        { key: 'week', label: 'Tuần này' },
        { key: 'month', label: 'Tháng này' },
        { key: 'all', label: 'Tất cả' }
    ];

    return (
        <div className="flex gap-1 p-1 bg-surface rounded-lg border border-border">
            {ranges.map((range) => (
                <button
                    key={range.key}
                    onClick={() => onChange(range.key)}
                    className={`
                        px-3 py-1.5 rounded-md font-mono text-xs transition-all
                        ${value === range.key
                            ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                            : 'text-muted hover:text-secondary hover:bg-surface-hover'
                        }
                    `}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
};

export default TimeRangeSelector;
