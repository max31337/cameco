import { useState } from 'react';
import { Building2, TrendingUp, Users, Clock, AlertCircle, CheckCircle2, Info, FileDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

type DepartmentTemplate = {
  name: string;
  code: string;
  manager_placeholder?: string;
};

type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending';
  country_scoped: boolean;
  action_link: string;
  action_label: string;
};

type Alert = {
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  action?: string;
  action_link?: string;
};

type AuditEvent = {
  id: number;
  action: string;
  description: string;
  user_name: string;
  timestamp: string;
  details: Record<string, unknown>;
};

interface Props {
  company: {
    name: string;
    site_id: number;
    country: string;
    timezone: string;
    currency: string;
    environment: string;
  };
  department_summary: {
    total: number;
    active: number;
    inactive: number;
    with_manager: number;
    total_budget: number;
    templates: DepartmentTemplate[];
  };
  position_summary: {
    total: number;
    active: number;
    by_level: Record<string, number>;
    salary_ranges: { min: number; max: number; avg_min: number; avg_max: number };
    currency: string;
    top_roles: Array<{ title: string; count: number }>;
  };
  onboarding_checklist: OnboardingItem[];
  onboarding_progress: number;
  recent_audit_events: AuditEvent[];
  alerts: Alert[];
  supported_countries: Record<string, string>;
}

export default function Overview({
  company,
  department_summary,
  position_summary,
  onboarding_checklist,
  onboarding_progress,
  recent_audit_events,
  alerts,
  supported_countries,
}: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/system/dashboard' },
    { title: 'Organization', href: '/system/organization/overview' },
  ];

  const [selectedCountry, setSelectedCountry] = useState(company.country);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: company.currency,
    }).format(value);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Organization Overview" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
        {/* Company Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              {company.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {company.environment === 'production' ? '🔴 Production' : '🟡 ' + company.environment} •{' '}
              {company.timezone} • {company.currency}
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(supported_countries).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Onboarding Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Onboarding Status</h3>
            <span className="text-sm font-medium">{onboarding_progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${onboarding_progress}%` }}
            />
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
                <div className="flex gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    {alert.action && (
                      <a href={alert.action_link || '#'} className="text-sm font-semibold text-blue-600 hover:underline mt-2 inline-block">
                        {alert.action} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{department_summary.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {department_summary.active} active • {department_summary.inactive} inactive
              </p>
              {department_summary.total_budget > 0 && (
                <p className="text-xs font-semibold mt-2">{formatCurrency(department_summary.total_budget)}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{position_summary.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {position_summary.active} active positions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Salary Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1">
                <p>Min: {formatCurrency(position_summary.salary_ranges.min)}</p>
                <p>Max: {formatCurrency(position_summary.salary_ranges.max)}</p>
                <p className="font-semibold mt-2">Avg: {formatCurrency(position_summary.salary_ranges.avg_min ?? 0)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Managers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{department_summary.with_manager}</div>
              <p className="text-xs text-muted-foreground mt-1">Departments with assigned managers</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Departments, Positions, Onboarding */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Departments Card */}
          <Card>
            <CardHeader>
              <CardTitle>Department Structure</CardTitle>
              <CardDescription>Company organizational hierarchy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button asChild>
                  <a href="/system/organization/departments">View All</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/system/organization/departments">Add</a>
                </Button>
              </div>

              {department_summary.templates.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Templates for {selectedCountry}</h4>
                  <div className="space-y-2">
                    {department_summary.templates.map((template, idx) => (
                      <div key={idx} className="border rounded p-2 hover:bg-gray-50">
                        <p className="font-semibold text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Positions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Position Hierarchy</CardTitle>
              <CardDescription>Job titles and reporting structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button asChild>
                  <a href="/system/organization/positions">View All</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/system/organization/positions">Add</a>
                </Button>
              </div>

              {position_summary.top_roles.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Top Roles</h4>
                  <div className="space-y-1">
                    {position_summary.top_roles.map((role, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span>{role.title}</span>
                        <Badge variant="secondary">{role.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Checklist */}
        <Card id="onboarding-checklist">
          <CardHeader>
            <CardTitle>Onboarding Checklist</CardTitle>
            <CardDescription>Site setup and configuration tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onboarding_checklist.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50">
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      {item.country_scoped && (
                        <Badge variant="outline" className="text-xs">
                          {selectedCountry}
                        </Badge>
                      )}
                      {item.status === 'completed' && <Badge className="text-xs bg-green-600">Done</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <a
                    href={item.action_link}
                    className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
                  >
                    {item.action_label} →
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest configuration changes and audited actions</CardDescription>
          </CardHeader>
          <CardContent>
            {recent_audit_events.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recent_audit_events.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        by {event.user_name} • {event.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common organization setup tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <Button asChild variant="outline" className="h-auto flex-col py-3">
                <a href="/system/organization/departments">
                  <Building2 className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center">Departments</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col py-3">
                <a href="/system/organization/positions">
                  <TrendingUp className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center">Positions</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col py-3">
                <a href="/system/security/roles">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center">Roles</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-auto flex-col py-3">
                <a href="/system/organization/overview?country=PH">
                  <FileDown className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center">Export</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
