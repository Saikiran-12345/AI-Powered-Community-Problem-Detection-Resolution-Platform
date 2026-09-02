import React, { useMemo, useState } from 'react';
import { complaintService } from '../services/complaintService';

// Grid size configuration
const GRID_COLS = 12;
const GRID_ROWS = 8;

interface CellData {
  x: number;
  y: number;
  count: number;
  criticalCount: number;
  score: number;
  label: string;
}

export const CommunityHeatmap = () => {
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null);

  const grid = useMemo(() => {
    const complaints = complaintService.getAll();
    const cells: CellData[][] = Array(GRID_ROWS).fill(null).map((_, y) => 
      Array(GRID_COLS).fill(null).map((_, x) => ({
        x, y, count: 0, criticalCount: 0, score: 0, label: `Sector ${String.fromCharCode(65 + y)}${x + 1}`
      }))
    );

    // Deterministic mock mapping based on complaint ID length/chars to simulate area distribution
    complaints.forEach(c => {
      // Mock hash to assign an x,y on the grid
      let hash = 0;
      for (let i = 0; i < c.id.length; i++) hash += c.id.charCodeAt(i);
      
      const cx = hash % GRID_COLS;
      const cy = (hash * 3) % GRID_ROWS;
      
      cells[cy][cx].count++;
      if (c.aiAnalysis?.severity === 'CRITICAL' || c.aiAnalysis?.severity === 'HIGH') {
        cells[cy][cx].criticalCount++;
      }
      // Score calculation based on severity weight
      cells[cy][cx].score = (cells[cy][cx].count * 1) + (cells[cy][cx].criticalCount * 3);
    });

    return cells;
  }, []);

  const getCellColor = (score: number) => {
    if (score === 0) return 'bg-gray-50 border-gray-100 hover:bg-green-50';
    if (score < 3) return 'bg-green-100 border-green-200 hover:bg-green-200 text-green-800';
    if (score < 7) return 'bg-yellow-100 border-yellow-200 hover:bg-yellow-200 text-yellow-800';
    if (score < 12) return 'bg-orange-100 border-orange-200 hover:bg-orange-200 text-orange-800';
    return 'bg-red-500 border-red-600 hover:bg-red-600 text-white';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Local Community Risk Heatmap</h2>
        <p className="text-sm text-gray-500 mb-6">Interactive grid representing municipal sectors. Color intensity indicates problem concentration and AI severity scores.</p>
        
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}>
          {grid.flat().map((cell, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedCell(cell)}
              className={`aspect-square rounded-md border flex items-center justify-center cursor-pointer transition-colors ${getCellColor(cell.score)}`}
              title={`${cell.label}: ${cell.count} issues`}
            >
              {cell.count > 0 && <span className="text-[10px] font-bold opacity-80">{cell.count}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-72 bg-gray-50 rounded-xl p-5 border border-gray-200 h-fit">
        {selectedCell ? (
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{selectedCell.label}</h3>
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-500">Total Reported</span>
                <span className="font-bold text-gray-900">{selectedCell.count}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-sm text-gray-500">Critical Alerts</span>
                <span className="font-bold text-red-600">{selectedCell.criticalCount}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-gray-500">Risk Score</span>
                <span className="font-bold text-gray-900">{selectedCell.score} / 100</span>
              </div>
              
              <button className="w-full mt-4 bg-gray-900 text-white rounded-lg py-2 text-sm font-semibold hover:bg-gray-800">
                Dispatch Officer to Area
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-3 py-10">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">?</div>
            <p className="text-sm">Select a sector on the grid to view detailed infrastructure analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
};
