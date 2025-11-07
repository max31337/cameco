import { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

type Position = {
  id: number;
  title: string;
  description: string | null;
  department_id: number;
  department_name: string;
  reports_to: number | null;
  reports_to_title: string | null;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
  min_salary: number | null;
  max_salary: number | null;
  is_active: boolean;
  direct_reports_count: number;
  created_at: string;
};

type Department = {
  id: number;
  name: string;
  code: string;
};

type Stats = {
  total: number;
  active: number;
  by_level: Record<string, number>;
  with_reports: number;
};

interface Props {
  positions: {
    data: Position[];
    links: Array<{url: string | null; label: string; active: boolean}>;
    meta: {last_page: number};
  };
  departments: Department[];
  levels: string[];
  stats: Stats;
  filters: {
    department_id?: string;
    level?: string;
    search?: string;
  };
}

const LEVEL_COLORS: Record<string, string> = {
  junior: 'bg-blue-100 text-blue-800',
  mid: 'bg-cyan-100 text-cyan-800',
  senior: 'bg-purple-100 text-purple-800',
  lead: 'bg-indigo-100 text-indigo-800',
  manager: 'bg-orange-100 text-orange-800',
  director: 'bg-red-100 text-red-800',
  executive: 'bg-rose-100 text-rose-800',
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/system/dashboard' },
  { title: 'Organization', href: '/system/organization/overview' },
  { title: 'Positions', href: '#' },
];

export default function Positions({ positions, departments, levels, stats, filters }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState(filters.search || '');
  const [filterDept, setFilterDept] = useState(filters.department_id || '');
  const [filterLevel, setFilterLevel] = useState(filters.level || '');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department_id: '',
    reports_to: '',
    level: 'senior',
    min_salary: '',
    max_salary: '',
  });

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (filterDept) params.department_id = filterDept;
    if (filterLevel) params.level = filterLevel;

    router.get('/system/organization/positions', params);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      router.put(`/system/organization/positions/${editingId}`, formData as Record<string, string>);
    } else {
      router.post('/system/organization/positions', formData as Record<string, string>);
    }
    resetForm();
  };

  const handleEdit = (pos: Position) => {
    setFormData({
      title: pos.title,
      description: pos.description || '',
      department_id: pos.department_id.toString(),
      reports_to: pos.reports_to?.toString() || '',
      level: pos.level,
      min_salary: pos.min_salary?.toString() || '',
      max_salary: pos.max_salary?.toString() || '',
    });
    setEditingId(pos.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this position?')) {
      router.delete(`/system/organization/positions/${id}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      department_id: '',
      reports_to: '',
      level: 'senior',
      min_salary: '',
      max_salary: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getReportingPositions = () => {
    // Filter out already reporting positions to prevent circular references
    return positions.data.filter((p) => p.level !== 'junior');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles and Hierarchy Management" />
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">

        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold dark:text-foreground">Positions & Hierarchy</h1>
                <p className="text-muted-foreground mt-2">Manage job titles, reporting relationships, and organizational structure</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} size="lg">
                <Plus className="mr-2 h-4 w-4" />
                New Position
            </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Positions</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.active}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">With Reports</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.with_reports}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Levels</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-purple-600">{Object.keys(stats.by_level).length}</div>
                </CardContent>
            </Card>
            </div>

            {/* Filters */}
            <Card>
            <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                    placeholder="Search positions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Select value={filterDept} onValueChange={setFilterDept}>
                    <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                    {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                    {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="w-full">
                    Apply Filters
                </Button>
                </div>
            </CardContent>
            </Card>

            {/* Form */}
            {showForm && (
            <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                <CardTitle>{editingId ? 'Edit' : 'New'} Position</CardTitle>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Position Title *</label>
                        <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Senior Backend Engineer"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Level *</label>
                        <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Department *</label>
                        <Select value={formData.department_id} onValueChange={(value) => setFormData({ ...formData, department_id: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            {departments.map((d) => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                                {d.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Reports To</label>
                        <Select value={formData.reports_to} onValueChange={(value) => setFormData({ ...formData, reports_to: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="No direct report" />
                        </SelectTrigger>
                        <SelectContent>
                            {getReportingPositions()
                            .filter((p) => p.id !== editingId)
                            .map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                {p.title} ({p.department_name})
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Min Salary (USD)</label>
                        <Input
                        type="number"
                        value={formData.min_salary}
                        onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                        placeholder="0"
                        min="0"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Max Salary (USD)</label>
                        <Input
                        type="number"
                        value={formData.max_salary}
                        onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                        placeholder="0"
                        min="0"
                        />
                    </div>
                    </div>

                    <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Job description, responsibilities..."
                    />
                    </div>

                    <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingId ? 'Update' : 'Create'} Position
                    </Button>
                    </div>
                </form>
                </CardContent>
            </Card>
            )}

            {/* Positions List */}
            <Card>
            <CardHeader>
                <CardTitle>All Positions ({positions.data.length})</CardTitle>
                <CardDescription>Organizational positions and reporting structure</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                {positions.data.length > 0 ? (
                    positions.data.map((pos) => (
                    <div key={pos.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                        <div className="flex-1 flex items-center gap-3">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <div>
                            <div className="font-medium">{pos.title}</div>
                            <div className="text-sm text-muted-foreground">
                            {pos.department_name}
                            {pos.reports_to_title && ` • Reports to: ${pos.reports_to_title}`}
                            </div>
                        </div>
                        </div>

                        <div className="flex items-center gap-2">
                        <Badge className={LEVEL_COLORS[pos.level]}>
                            {pos.level.charAt(0).toUpperCase() + pos.level.slice(1)}
                        </Badge>
                        <Badge variant={pos.is_active ? 'default' : 'secondary'}>
                            {pos.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {pos.direct_reports_count > 0 && (
                            <Badge variant="outline">{pos.direct_reports_count} Reports</Badge>
                        )}
                        {pos.min_salary && pos.max_salary && (
                            <span className="text-sm text-muted-foreground">
                            {formatCurrency(pos.min_salary)} - {formatCurrency(pos.max_salary)}
                            </span>
                        )}

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(pos)}
                        >
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(pos.id)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No positions found</p>
                    </div>
                )}
                </div>
            </CardContent>
            </Card>

            {/* Pagination */}
            {positions.meta?.last_page > 1 && (
            <div className="flex justify-center gap-2">
                {positions.links && positions.links.map((link) => (
                link.url ? (
                    <Button
                    key={link.label}
                    variant={link.active ? 'default' : 'outline'}
                    onClick={() => link.url && router.get(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span key={link.label} className="px-2 py-1 text-muted-foreground">
                    {link.label}
                    </span>
                )
                ))}
            </div>
            )}
        </div>
    </AppLayout>
    );
}
