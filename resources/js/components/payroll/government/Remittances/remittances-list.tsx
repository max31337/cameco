import React, { useState } from 'react';
import { Download, Eye, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Remittance {
  id: number;
  agency: 'BIR' | 'SSS' | 'PhilHealth' | 'Pag-IBIG';
  month: string;
  remittance_amount: number;
  report_type: string;
  due_date: string;
  payment_date: string | null;
  payment_reference: string | null;
  status: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'late';
  days_until_due: number;
  has_penalty: boolean;
  penalty_amount: number;
  remittance_method: string;
  notes: string;
  employees_covered: number;
}

interface RemittancesListProps {
  remittances: Remittance[];
  onMarkPaid?: (id: number) => void;
  onView?: (id: number) => void;
  onDownload?: (id: number) => void;
}

export function RemittancesList({ remittances, onMarkPaid, onView, onDownload }: RemittancesListProps) {
  const [sortBy, setSortBy] = useState<'due_date' | 'agency' | 'amount'>('due_date');
  const [filterAgency, setFilterAgency] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const formatPeso = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
      case 'late':
        return 'bg-red-100 text-red-800';
      case 'partially_paid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgencyColor = (agency: string) => {
    switch (agency) {
      case 'BIR':
        return 'bg-red-50 border-l-4 border-l-red-500';
      case 'SSS':
        return 'bg-blue-50 border-l-4 border-l-blue-500';
      case 'PhilHealth':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'Pag-IBIG':
        return 'bg-orange-50 border-l-4 border-l-orange-500';
      default:
        return 'bg-gray-50 border-l-4 border-l-gray-500';
    }
  };

  const sortedRemittances = [...remittances].sort((a, b) => {
    switch (sortBy) {
      case 'agency':
        return a.agency.localeCompare(b.agency);
      case 'amount':
        return b.remittance_amount - a.remittance_amount;
      case 'due_date':
      default:
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
  });

  const filteredRemittances = sortedRemittances.filter((r) => {
    const agencyMatch = filterAgency === 'all' || r.agency === filterAgency;
    const statusMatch = filterStatus === 'all' || r.status === filterStatus;
    return agencyMatch && statusMatch;
  });

  const agencies = ['all', ...new Set(remittances.map((r) => r.agency))];
  const statuses = ['all', ...new Set(remittances.map((r) => r.status))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <label className="text-sm font-medium text-gray-700">Agency</label>
            <select
              value={filterAgency}
              onChange={(e) => setFilterAgency(e.target.value)}
              className="mt-1 rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {agencies.map((agency) => (
                <option key={agency} value={agency}>
                  {agency === 'all' ? 'All Agencies' : agency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all'
                    ? 'All Status'
                    : status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'due_date' | 'agency' | 'amount')}
              className="mt-1 rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="due_date">Due Date</option>
              <option value="agency">Agency</option>
              <option value="amount">Amount</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Showing {filteredRemittances.length} of {remittances.length} remittances
        </p>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filteredRemittances.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-gray-50">
                    <TableHead className="font-semibold">Agency</TableHead>
                    <TableHead className="font-semibold">Period</TableHead>
                    <TableHead className="font-semibold">Report Type</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="text-right font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRemittances.map((remittance) => (
                    <TableRow key={remittance.id} className={getAgencyColor(remittance.agency)}>
                      <TableCell className="font-semibold">{remittance.agency}</TableCell>
                      <TableCell className="text-sm">{remittance.month}</TableCell>
                      <TableCell className="text-sm">{remittance.report_type}</TableCell>
                      <TableCell className="text-sm">{formatDate(remittance.due_date)}</TableCell>
                      <TableCell className="text-right font-semibold">{formatPeso(remittance.remittance_amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(remittance.status)}>
                            {remittance.status.charAt(0).toUpperCase() + remittance.status.slice(1).replace(/_/g, ' ')}
                          </Badge>
                          {remittance.has_penalty && (
                            <div title={`Penalty: ${formatPeso(remittance.penalty_amount)}`}>
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView?.(remittance.id)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {remittance.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMarkPaid?.(remittance.id)}
                              title="Mark as Paid"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload?.(remittance.id)}
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-600">No remittances found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="mt-1 text-2xl font-bold">
              {formatPeso(filteredRemittances.reduce((sum, r) => sum + r.remittance_amount, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Employees Covered</p>
            <p className="mt-1 text-2xl font-bold">{filteredRemittances[0]?.employees_covered || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Earliest Due</p>
            <p className="mt-1 text-lg font-bold">
              {filteredRemittances.length > 0 ? formatDate(filteredRemittances[0].due_date) : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600">Total Penalties</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {formatPeso(filteredRemittances.reduce((sum, r) => (r.has_penalty ? sum + r.penalty_amount : sum), 0))}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
