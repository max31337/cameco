import React, { useState } from 'react';
import { SalaryComponent } from '@/types/payroll-pages';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    DollarSign,
} from 'lucide-react';

interface SalaryComponentsTableProps {
    components: SalaryComponent[];
    onEdit: (component: SalaryComponent) => void;
    onDelete: (component: SalaryComponent) => void;
    onView: (component: SalaryComponent) => void;
    isLoading?: boolean;
}

/**
 * Salary Components Table
 * Displays all salary components with their calculation methods, tax treatment, and government contribution flags
 */
export function SalaryComponentsTable({
    components,
    onEdit,
    onDelete,
    onView,
    isLoading = false,
}: SalaryComponentsTableProps) {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const getComponentTypeColor = (type: string): string => {
        const colors: Record<string, string> = {
            earning: 'bg-green-100 text-green-800',
            deduction: 'bg-red-100 text-red-800',
            benefit: 'bg-blue-100 text-blue-800',
            tax: 'bg-orange-100 text-orange-800',
            contribution: 'bg-purple-100 text-purple-800',
            loan: 'bg-yellow-100 text-yellow-800',
            allowance: 'bg-cyan-100 text-cyan-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getCalculationMethodLabel = (method: string): string => {
        const labels: Record<string, string> = {
            fixed_amount: 'Fixed Amount',
            percentage_of_basic: '% of Basic',
            percentage_of_gross: '% of Gross',
            per_hour: 'Per Hour',
            per_day: 'Per Day',
            per_unit: 'Per Unit',
            percentage_of_component: '% of Component',
        };
        return labels[method] || method;
    };

    const getCategoryColor = (category: string): string => {
        const colors: Record<string, string> = {
            regular: 'bg-slate-100 text-slate-800',
            overtime: 'bg-amber-100 text-amber-800',
            holiday: 'bg-rose-100 text-rose-800',
            leave: 'bg-violet-100 text-violet-800',
            allowance: 'bg-teal-100 text-teal-800',
            deduction: 'bg-red-100 text-red-800',
            tax: 'bg-orange-100 text-orange-800',
            contribution: 'bg-indigo-100 text-indigo-800',
            loan: 'bg-yellow-100 text-yellow-800',
            adjustment: 'bg-pink-100 text-pink-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    if (components.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <DollarSign className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">No salary components found</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="border-b bg-gray-50">
                        <TableHead className="w-[15%] font-semibold">Name / Code</TableHead>
                        <TableHead className="w-[12%] font-semibold">Type</TableHead>
                        <TableHead className="w-[12%] font-semibold">Category</TableHead>
                        <TableHead className="w-[15%] font-semibold">Calculation Method</TableHead>
                        <TableHead className="w-[13%] text-center font-semibold">Tax Treatment</TableHead>
                        <TableHead className="w-[13%] text-center font-semibold">Gov Flags</TableHead>
                        <TableHead className="w-[10%] text-center font-semibold">Status</TableHead>
                        <TableHead className="w-[8%] text-center font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {components.map((component) => (
                        <TableRow
                            key={component.id}
                            className={`border-b transition-colors ${
                                hoveredId === component.id ? 'bg-gray-50' : ''
                            } ${!component.is_active ? 'opacity-60' : ''}`}
                            onMouseEnter={() => setHoveredId(component.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Name / Code Column */}
                            <TableCell className="py-3">
                                <div>
                                    <p className="font-medium text-gray-900">{component.name}</p>
                                    <p className="text-xs text-gray-500">{component.code}</p>
                                </div>
                            </TableCell>

                            {/* Type Column */}
                            <TableCell className="py-3">
                                <Badge className={getComponentTypeColor(component.component_type)}>
                                    {component.component_type}
                                </Badge>
                            </TableCell>

                            {/* Category Column */}
                            <TableCell className="py-3">
                                <Badge className={getCategoryColor(component.category)}>
                                    {component.category}
                                </Badge>
                            </TableCell>

                            {/* Calculation Method Column */}
                            <TableCell className="py-3">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">
                                        {getCalculationMethodLabel(component.calculation_method)}
                                    </p>
                                    {component.default_amount !== undefined &&
                                        component.default_amount > 0 && (
                                            <p className="text-xs text-gray-500">
                                                ₱{component.default_amount.toLocaleString()}
                                            </p>
                                        )}
                                    {component.default_percentage !== undefined &&
                                        component.default_percentage > 0 && (
                                            <p className="text-xs text-gray-500">
                                                {component.default_percentage}%
                                            </p>
                                        )}
                                    {component.ot_multiplier && (
                                        <p className="text-xs text-gray-500">
                                            Multiplier: {component.ot_multiplier}x
                                        </p>
                                    )}
                                </div>
                            </TableCell>

                            {/* Tax Treatment Column */}
                            <TableCell className="py-3">
                                <div className="flex flex-col items-center gap-1">
                                    {component.is_taxable && (
                                        <Badge variant="outline" className="bg-orange-50">
                                            Taxable
                                        </Badge>
                                    )}
                                    {component.is_deminimis && (
                                        <Badge variant="outline" className="bg-green-50">
                                            De Minimis
                                        </Badge>
                                    )}
                                    {component.is_13th_month && (
                                        <Badge variant="outline" className="bg-purple-50">
                                            13th Month
                                        </Badge>
                                    )}
                                    {component.is_other_benefits && (
                                        <Badge variant="outline" className="bg-blue-50">
                                            OBP
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>

                            {/* Government Contribution Flags Column */}
                            <TableCell className="py-3">
                                <div className="flex flex-wrap justify-center gap-1">
                                    {component.affects_sss && (
                                        <span
                                            className="inline-block rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                                            title="Affects SSS"
                                        >
                                            SSS
                                        </span>
                                    )}
                                    {component.affects_philhealth && (
                                        <span
                                            className="inline-block rounded bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-800"
                                            title="Affects PhilHealth"
                                        >
                                            PH
                                        </span>
                                    )}
                                    {component.affects_pagibig && (
                                        <span
                                            className="inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"
                                            title="Affects Pag-IBIG"
                                        >
                                            IBIG
                                        </span>
                                    )}
                                    {component.affects_gross_compensation && (
                                        <span
                                            className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                                            title="Affects Gross Compensation"
                                        >
                                            Gross
                                        </span>
                                    )}
                                </div>
                            </TableCell>

                            {/* Status Column */}
                            <TableCell className="py-3 text-center">
                                <Badge
                                    variant={component.is_active ? 'default' : 'secondary'}
                                    className={
                                        component.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }
                                >
                                    {component.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                {component.is_system_component && (
                                    <p className="mt-1 text-xs text-gray-500">System</p>
                                )}
                            </TableCell>

                            {/* Actions Column */}
                            <TableCell className="py-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                            disabled={isLoading}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => onView(component)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(component)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        {!component.is_system_component && (
                                            <DropdownMenuItem
                                                onClick={() => onDelete(component)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
