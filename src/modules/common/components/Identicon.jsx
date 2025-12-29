

import React, { useMemo } from 'react';


const generateColors = (address) => {
    const hash = address.toLowerCase().slice(2);
    const colors = [];

    for (let i = 0; i < 3; i++) {
        const segment = hash.slice(i * 10, (i + 1) * 10);
        const hue = parseInt(segment.slice(0, 3), 16) % 360;
        const saturation = 60 + (parseInt(segment.slice(3, 5), 16) % 30);
        const lightness = 45 + (parseInt(segment.slice(5, 7), 16) % 20);
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
};


const generatePattern = (address) => {
    const hash = address.toLowerCase().slice(2);
    const pattern = [];


    for (let row = 0; row < 5; row++) {
        const rowPattern = [];
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            const char = hash[index] || '0';
            const value = parseInt(char, 16);
            rowPattern.push(value > 7 ? 1 : 0);
        }
        pattern.push(rowPattern);
    }

    return pattern;
};

const Identicon = ({ address, size = 32, className = '' }) => {
    const { colors, pattern } = useMemo(() => {
        if (!address || address.length < 10) {
            return {
                colors: ['#22c55e', '#06b6d4', '#f97316'],
                pattern: [[1, 0, 1], [0, 1, 0], [1, 0, 1], [0, 1, 0], [1, 0, 1]]
            };
        }
        return {
            colors: generateColors(address),
            pattern: generatePattern(address)
        };
    }, [address]);

    const cellSize = size / 5;
    const bgColor = colors[0];
    const fgColor = colors[1];

    return (
        <div
            className={`rounded-lg overflow-hidden flex-shrink-0 ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: bgColor
            }}
            title={address}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {pattern.map((row, rowIndex) => (
                    row.map((cell, colIndex) => {
                        if (cell === 0) return null;


                        const cells = [];
                        cells.push(
                            <rect
                                key={`${rowIndex}-${colIndex}`}
                                x={colIndex * cellSize}
                                y={rowIndex * cellSize}
                                width={cellSize}
                                height={cellSize}
                                fill={fgColor}
                            />
                        );


                        if (colIndex < 2) {
                            cells.push(
                                <rect
                                    key={`${rowIndex}-${4 - colIndex}`}
                                    x={(4 - colIndex) * cellSize}
                                    y={rowIndex * cellSize}
                                    width={cellSize}
                                    height={cellSize}
                                    fill={fgColor}
                                />
                            );
                        }

                        return cells;
                    })
                ))}
            </svg>
        </div>
    );
};

export default Identicon;
