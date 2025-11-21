import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Period {
  id: number;
  name: string;
  total_employees: number;
}

interface Bank {
  id: string;
  name: string;
  code: string;
  supported_formats: string[];
}

interface BankFileGeneratorModalProps {
  isOpen: boolean;
  periods: Period[];
  banks: Bank[];
  onGenerate?: (data: GenerateFileData) => void;
  onCancel?: () => void;
}

interface GenerateFileData {
  period_id: number;
  bank_name: string;
  file_format: string;
}

export function BankFileGeneratorModal({
  isOpen,
  periods,
  banks,
  onGenerate,
  onCancel,
}: BankFileGeneratorModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedBankData = banks.find((b) => b.id === selectedBank);
  const selectedPeriodData = periods.find((p) => p.id === Number(selectedPeriod));

  const supportedFormats = selectedBankData?.supported_formats || [];
  const canGenerate = selectedPeriod && selectedBank && selectedFormat;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    try {
      await onGenerate?.({
        period_id: Number(selectedPeriod),
        bank_name: selectedBank,
        file_format: selectedFormat,
      });

      setSelectedPeriod('');
      setSelectedBank('');
      setSelectedFormat('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Bank Payroll File</DialogTitle>
          <DialogDescription>
            Select a payroll period, bank, and file format to generate a bank payroll file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Period Selection */}
          <div className="space-y-2">
            <Label htmlFor="period">Payroll Period</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger id="period">
                <SelectValue placeholder="Select payroll period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id.toString()}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPeriodData && (
              <p className="text-sm text-gray-600">{selectedPeriodData.total_employees} employees</p>
            )}
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <Label htmlFor="bank">Bank</Label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger id="bank">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name} ({bank.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">File Format</Label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat} disabled={!selectedBank}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select file format" />
              </SelectTrigger>
              <SelectContent>
                {supportedFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview Card */}
          {selectedPeriod && selectedBank && selectedFormat && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Period:</span>
                  <span className="font-medium">{selectedPeriodData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Bank:</span>
                  <span className="font-medium">{selectedBankData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Format:</span>
                  <span className="font-medium">{selectedFormat.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Employees:</span>
                  <span className="font-medium">{selectedPeriodData?.total_employees}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Alert */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-800">
              The file will be generated with all employees from the selected period. You can validate and upload it
              after generation.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={!canGenerate || isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate File'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
