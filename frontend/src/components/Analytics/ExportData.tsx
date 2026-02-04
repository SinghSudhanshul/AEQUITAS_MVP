// ============================================
// EXPORT DATA COMPONENT
// CSV/JSON Data Export Functionality
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ExportFormat = 'csv' | 'json' | 'xlsx';
type DataType = 'forecasts' | 'accuracy' | 'positions' | 'all';
type DateRange = '7d' | '30d' | '90d' | 'ytd' | 'all';

interface ExportDataProps {
  onExport?: (format: ExportFormat, dataType: DataType, dateRange: DateRange) => void;
}

export const ExportData: React.FC<ExportDataProps> = ({ onExport }) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [dataType, setDataType] = useState<DataType>('forecasts');
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportComplete(false);

    try {
      // Simulate export
      await new Promise(r => setTimeout(r, 2000));
      onExport?.(format, dataType, dateRange);
      setExportComplete(true);
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions: { value: ExportFormat; label: string; icon: string }[] = [
    { value: 'csv', label: 'CSV', icon: '📄' },
    { value: 'json', label: 'JSON', icon: '{ }' },
    { value: 'xlsx', label: 'Excel', icon: '📊' },
  ];

  const dataTypeOptions: { value: DataType; label: string; description: string }[] = [
    { value: 'forecasts', label: 'Forecasts', description: 'Daily predictions and actuals' },
    { value: 'accuracy', label: 'Accuracy Metrics', description: 'Performance statistics' },
    { value: 'positions', label: 'Position Data', description: 'Uploaded position snapshots' },
    { value: 'all', label: 'Complete Export', description: 'All data combined' },
  ];

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span>📥</span> Export Data
        </CardTitle>
        <CardDescription>
          Download your forecasting data in various formats
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {exportComplete && (
          <Alert variant="success">
            <AlertDescription>
              Export completed! Your {format.toUpperCase()} file is downloading.
            </AlertDescription>
          </Alert>
        )}

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Export Format</label>
          <div className="grid grid-cols-3 gap-2">
            {formatOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormat(option.value)}
                className={`
                  p-3 rounded-lg border text-center transition-all duration-200
                  ${format === option.value
                    ? 'bg-institutional-blue/20 border-institutional-blue text-off-white'
                    : 'bg-glass-white border-glass-border text-muted hover:border-glass-border/60'
                  }
                `}
              >
                <div className="text-xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Data Type Selection */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Data Type</label>
          <div className="space-y-2">
            {dataTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDataType(option.value)}
                className={`
                  w-full p-3 rounded-lg border text-left transition-all duration-200
                  ${dataType === option.value
                    ? 'bg-institutional-blue/20 border-institutional-blue'
                    : 'bg-glass-white border-glass-border hover:border-glass-border/60'
                  }
                `}
              >
                <div className="font-medium text-off-white">{option.label}</div>
                <div className="text-sm text-muted">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Selection */}
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Date Range</label>
          <div className="flex flex-wrap gap-2">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`
                  px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                  ${dateRange === option.value
                    ? 'bg-precision-teal/20 border-precision-teal text-precision-teal'
                    : 'bg-glass-white border-glass-border text-muted hover:text-off-white'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export Summary */}
        <div className="p-4 bg-glass-white rounded-lg border border-glass-border">
          <div className="text-sm text-muted mb-2">Export Summary</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-off-white">{format.toUpperCase()}</div>
              <div className="text-xs text-muted">Format</div>
            </div>
            <div>
              <div className="text-lg font-bold text-off-white capitalize">{dataType}</div>
              <div className="text-xs text-muted">Data Type</div>
            </div>
            <div>
              <div className="text-lg font-bold text-off-white">
                {dateRangeOptions.find(d => d.value === dateRange)?.label}
              </div>
              <div className="text-xs text-muted">Period</div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Preparing Export...
            </>
          ) : (
            <>📥 Export Data</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportData;
