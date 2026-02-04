// ============================================
// DATA PREVIEW COMPONENT
// Preview Uploaded Data Before Processing
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface DataRow {
  [key: string]: string | number;
}

interface DataPreviewProps {
  data?: DataRow[];
  columns?: string[];
  filename?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const mockColumns = ['Date', 'Security ID', 'Position Size', 'Market Value', 'Asset Class'];
const mockData: DataRow[] = [
  { Date: '2026-01-31', 'Security ID': 'AAPL', 'Position Size': 10000, 'Market Value': 1750000, 'Asset Class': 'Equity' },
  { Date: '2026-01-31', 'Security ID': 'GOOGL', 'Position Size': 5000, 'Market Value': 875000, 'Asset Class': 'Equity' },
  { Date: '2026-01-31', 'Security ID': 'UST-10Y', 'Position Size': 50000000, 'Market Value': 49500000, 'Asset Class': 'Fixed Income' },
  { Date: '2026-01-31', 'Security ID': 'EUR/USD', 'Position Size': 25000000, 'Market Value': 26750000, 'Asset Class': 'FX' },
  { Date: '2026-01-31', 'Security ID': 'SPY-PUT-450', 'Position Size': 1000, 'Market Value': 450000, 'Asset Class': 'Derivatives' },
];

export const DataPreview: React.FC<DataPreviewProps> = ({
  data = mockData,
  columns = mockColumns,
  filename = 'positions_2026-01-31.csv',
  onConfirm,
  onCancel,
}) => {
  const [validationComplete] = useState(true);
  const [validationIssues] = useState<string[]>([]);

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      return value >= 1000000
        ? `$${(value / 1e6).toFixed(2)}M`
        : value >= 1000
          ? `$${(value / 1e3).toFixed(0)}K`
          : value.toLocaleString();
    }
    return value;
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>👁️</span> Data Preview
            </CardTitle>
            <CardDescription>{filename} • {data.length} rows × {columns.length} columns</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {validationComplete && validationIssues.length === 0 && (
              <span className="text-steady-green text-sm font-medium">✓ Validated</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Validation Alerts */}
        {validationIssues.length > 0 && (
          <Alert variant="warning">
            <AlertTitle>Validation Warnings</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside text-sm mt-2">
                {validationIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-glass-border">
          <table className="w-full">
            <thead className="bg-charcoal">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-glass-white transition-colors">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-sm text-off-white whitespace-nowrap">
                      {formatValue(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-glass-white rounded-lg text-center">
            <div className="text-xs text-muted uppercase tracking-wider">Total Rows</div>
            <div className="text-lg font-bold text-off-white">{data.length.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-glass-white rounded-lg text-center">
            <div className="text-xs text-muted uppercase tracking-wider">Columns</div>
            <div className="text-lg font-bold text-off-white">{columns.length}</div>
          </div>
          <div className="p-3 bg-glass-white rounded-lg text-center">
            <div className="text-xs text-muted uppercase tracking-wider">Asset Classes</div>
            <div className="text-lg font-bold text-off-white">4</div>
          </div>
          <div className="p-3 bg-glass-white rounded-lg text-center">
            <div className="text-xs text-muted uppercase tracking-wider">Total Value</div>
            <div className="text-lg font-bold text-precision-teal">$79.3M</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-glass-border">
          <Button variant="default" className="flex-1" onClick={onConfirm}>
            Confirm & Process
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreview;
