import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus, Eye } from 'lucide-react';

interface IPRuleData {
	id: number;
	ip_address_or_range: string;
	rule_type: string;
	description: string | null;
	is_active: boolean;
	expires_at: string | null;
	is_expired: boolean;
	created_by: string;
	updated_by: string | null;
	created_at: string;
	updated_at: string;
}

interface IPRulesPageProps {
	rules: {
		data: IPRuleData[];
		current_page: number;
		last_page: number;
		total: number;
	};
	stats: {
		total_rules: number;
		active_rules: number;
		inactive_rules: number;
		whitelisted_ips: number;
		blacklisted_ips: number;
		expired_rules: number;
	};
	filters: {
		rule_type: string;
		status: string;
		search: string;
	};
}

export default function IPRulesPage({
	rules,
	stats,
	filters,
}: IPRulesPageProps) {
	const [search, setSearch] = useState(filters.search);
	const [ruleType, setRuleType] = useState(filters.rule_type);
	const [status, setStatus] = useState(filters.status);

	const handleFilter = () => {
		const params = new URLSearchParams();
		if (search) params.append('search', search);
		if (ruleType !== 'all') params.append('rule_type', ruleType);
		if (status !== 'all') params.append('status', status);
		router.get('/system/security/ip-rules?' + params.toString());
	};

	const handleDelete = (ruleId: number, ip: string) => {
		if (confirm(`Delete IP rule for ${ip}?`)) {
			router.delete(`/system/security/ip-rules/${ruleId}`);
		}
	};

	const getRuleTypeBadgeColor = (ruleType: string) => {
		return ruleType === 'whitelist' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
	};

	return (
		<AppLayout
			breadcrumbs={[
				{ title: 'System', href: '#' },
				{ title: 'Security & Access', href: '#' },
				{ title: 'IP Allowlist/Blocklist', href: '/system/security/ip-rules' },
			]}
		>
			<Head title="IP Allowlist/Blocklist" />

			<div className="space-y-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">IP Allowlist/Blocklist</h1>
						<p className="text-muted-foreground mt-1">
							Manage IP addresses and ranges for access control
						</p>
					</div>
					<Button className="gap-2">
						<Plus className="h-4 w-4" />
						Add IP Rule
					</Button>
				</div>

				{/* Stats */}
				<div className="grid gap-4 md:grid-cols-6">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Total Rules</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.total_rules}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Active</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-green-600">{stats.active_rules}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Inactive</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-gray-600">{stats.inactive_rules}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Whitelisted</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-green-600">{stats.whitelisted_ips}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Blacklisted</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-red-600">{stats.blacklisted_ips}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Expired</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-orange-600">{stats.expired_rules}</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardHeader>
						<CardTitle>Filters</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Search IP</label>
								<Input
									placeholder="IP address or range..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Rule Type</label>
								<Select value={ruleType} onValueChange={setRuleType}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Rules</SelectItem>
										<SelectItem value="whitelist">Whitelist</SelectItem>
										<SelectItem value="blacklist">Blacklist</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Status</label>
								<Select value={status} onValueChange={setStatus}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Statuses</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
										<SelectItem value="expired">Expired</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-end">
								<Button onClick={handleFilter} className="w-full">
									Apply Filters
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Rules List */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">
							IP Rules ({rules.total})
						</h2>
					</div>

					{rules.data.length === 0 ? (
						<Card>
							<CardContent className="py-12 text-center text-muted-foreground">
								No IP rules found matching your filters
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{rules.data.map((rule) => (
								<Card key={rule.id} className="hover:shadow-md transition-shadow">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between">
											<div className="space-y-1 flex-1">
												<div className="flex items-center gap-2">
													<CardTitle className="text-base font-mono">{rule.ip_address_or_range}</CardTitle>
													<Badge className={getRuleTypeBadgeColor(rule.rule_type)}>
														{rule.rule_type === 'whitelist' ? 'Allowed' : 'Blocked'}
													</Badge>
													{!rule.is_active && (
														<Badge variant="secondary">Inactive</Badge>
													)}
													{rule.is_expired && (
														<Badge variant="outline" className="bg-orange-50">
															Expired
														</Badge>
													)}
												</div>
												{rule.description && (
													<CardDescription>{rule.description}</CardDescription>
												)}
											</div>
											<div className="flex gap-2">
												<Button variant="outline" size="sm" className="gap-2">
													<Eye className="h-4 w-4" />
													View
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDelete(rule.id, rule.ip_address_or_range)}
													className="gap-2 text-destructive hover:bg-destructive hover:text-white"
												>
													<Trash2 className="h-4 w-4" />
													Delete
												</Button>
											</div>
										</div>
									</CardHeader>
									<Separator />
									<CardContent className="pt-4">
										<div className="grid gap-4 md:grid-cols-4">
											<div>
												<p className="text-sm text-muted-foreground">Created By</p>
												<p className="text-sm font-medium">{rule.created_by}</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Created</p>
												<p className="text-sm font-medium">{rule.created_at}</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Expires</p>
												<p className="text-sm font-medium">
													{rule.expires_at ? rule.expires_at : 'Never'}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Last Updated</p>
												<p className="text-sm font-medium">{rule.updated_by || 'N/A'}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Pagination */}
					{rules.last_page > 1 && (
						<div className="flex justify-center gap-2">
							{Array.from({ length: rules.last_page }).map((_, i) => {
								const page = i + 1;
								const isActive = page === rules.current_page;
								return (
									<Button
										key={page}
										variant={isActive ? 'default' : 'outline'}
										onClick={() => {
											const params = new URLSearchParams();
											params.append('page', page.toString());
											if (search) params.append('search', search);
											if (ruleType !== 'all') params.append('rule_type', ruleType);
											if (status !== 'all') params.append('status', status);
											router.get('/system/security/ip-rules?' + params.toString());
										}}
									>
										{page}
									</Button>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	);
}
