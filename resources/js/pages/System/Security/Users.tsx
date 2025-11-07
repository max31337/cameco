import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
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
import { CheckCircle2, AlertCircle, Mail, Eye } from 'lucide-react';

interface User {
	id: number;
	name: string;
	email: string;
	is_active: boolean;
	email_verified_at: string | null;
	created_at: string;
	last_login_at: string | null;
	roles: string[];
	audit_logs_count: number;
}

interface Role {
	id: number;
	name: string;
}

interface UsersPageProps {
	users: {
		data: User[];
		current_page: number;
		last_page: number;
		total: number;
	};
	roles: Role[];
	stats: {
		total_users: number;
		active_users: number;
		inactive_users: number;
		unverified_users: number;
	};
	filters: {
		status: string;
		role: string;
		search: string;
	};
}

export default function UsersPage({
	users,
	roles,
	stats,
	filters,
}: UsersPageProps) {
	const [search, setSearch] = useState(filters.search);
	const [status, setStatus] = useState(filters.status);
	const [role, setRole] = useState(filters.role);

	const handleFilter = () => {
		const params = new URLSearchParams();
		if (search) params.append('search', search);
		if (status !== 'all') params.append('status', status);
		if (role !== 'all') params.append('role', role);
		router.get('/system/users?' + params.toString());
	};

	return (
		<AppLayout
			breadcrumbs={[
				{ title: 'Dashboard', href: '/dashboard' },
				{ title: 'Security & Access', href: '#' },
				{ title: 'User Management', href: '/system/users' },
			]}
		>
			<Head title="User Management" />

			<div className="space-y-6 p-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold tracking-tight dark:text-foreground">User Management</h1>
					<p className="text-muted-foreground mt-1">
						Manage users, their roles, and account status
					</p>
				</div>

				{/* Stats */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Total Users</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.total_users}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Active Users</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-green-600">{stats.active_users}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Inactive Users</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-red-600">{stats.inactive_users}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Unverified</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold text-yellow-600">{stats.unverified_users}</div>
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
								<label className="text-sm font-medium">Search</label>
								<Input
									placeholder="Name or email..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Status</label>
								<Select value={status} onValueChange={setStatus}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Users</SelectItem>
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
										<SelectItem value="pending">Pending Verification</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Role</label>
								<Select value={role} onValueChange={setRole}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Roles</SelectItem>
										{roles.map((r) => (
											<SelectItem key={r.id} value={r.name}>
												{r.name}
											</SelectItem>
										))}
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

				{/* Users List */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">
							Users ({users.total})
						</h2>
					</div>

					{users.data.length === 0 ? (
						<Card>
							<CardContent className="py-12 text-center text-muted-foreground">
								No users found matching your filters
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{users.data.map((user) => (
								<Card key={user.id} className="hover:shadow-md transition-shadow">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between">
											<div className="space-y-1 flex-1">
												<div className="flex items-center gap-2">
													<CardTitle className="text-base">{user.name}</CardTitle>
													{!user.email_verified_at && (
														<Badge variant="outline" className="gap-1">
															<AlertCircle className="h-3 w-3" />
															Unverified
														</Badge>
													)}
													{user.is_active ? (
														<Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
															<CheckCircle2 className="h-3 w-3" />
															Active
														</Badge>
													) : (
														<Badge variant="secondary">Inactive</Badge>
													)}
												</div>
												<CardDescription className="flex items-center gap-2">
													<Mail className="h-4 w-4" />
													{user.email}
												</CardDescription>
											</div>
											<div className="flex gap-2">
												<Link href={`/system/users/${user.id}`}>
													<Button variant="outline" size="sm" className="gap-2">
														<Eye className="h-4 w-4" />
														View
													</Button>
												</Link>
											</div>
										</div>
									</CardHeader>
									<Separator />
									<CardContent className="pt-4">
										<div className="grid gap-4 md:grid-cols-4">
											<div>
												<p className="text-sm text-muted-foreground">Roles</p>
												<div className="flex flex-wrap gap-1 mt-1">
													{user.roles.length === 0 ? (
														<span className="text-xs text-muted-foreground">No roles</span>
													) : (
														user.roles.map((r) => (
															<Badge key={r} variant="outline" className="text-xs">
																{r}
															</Badge>
														))
													)}
												</div>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Joined</p>
												<p className="text-sm font-medium">{user.created_at}</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Last Login</p>
												<p className="text-sm font-medium">
													{user.last_login_at ? user.last_login_at : 'Never'}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">Audit Events</p>
												<p className="text-sm font-medium">{user.audit_logs_count}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Pagination */}
					{users.last_page > 1 && (
						<div className="flex justify-center gap-2">
							{Array.from({ length: users.last_page }).map((_, i) => {
								const page = i + 1;
								const isActive = page === users.current_page;
								return (
									<Button
										key={page}
										variant={isActive ? 'default' : 'outline'}
										onClick={() => {
											const params = new URLSearchParams();
											params.append('page', page.toString());
											if (search) params.append('search', search);
											if (status !== 'all') params.append('status', status);
											if (role !== 'all') params.append('role', role);
											router.get('/system/users?' + params.toString());
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
