import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Edit2, Trash2, Plus, Lock } from 'lucide-react';

interface Permission {
	id: number;
	name: string;
	description: string;
}

interface Role {
	id: number;
	name: string;
	description: string;
	permissions_count: number;
	users_count: number;
	created_at: string;
	permissions: Permission[];
}

interface RolesPageProps {
	roles: Role[];
	permissions: Record<string, Permission[]>;
	stats: {
		total_roles: number;
		system_roles: number;
		custom_roles: number;
		total_permissions: number;
	};
}

const isSystemRole = (roleName: string) => ['Superadmin', 'Admin', 'User'].includes(roleName);

export default function RolesPage({ roles, stats }: RolesPageProps) {
	const [search, setSearch] = useState('');

	const filteredRoles = roles.filter(role =>
		role.name.toLowerCase().includes(search.toLowerCase()) ||
		role.description.toLowerCase().includes(search.toLowerCase())
	);

	const handleDelete = (roleId: number) => {
		if (confirm('Are you sure you want to delete this role? Users with this role will be unassigned.')) {
			router.delete(`/system/security/roles/${roleId}`);
		}
	};

	return (
		<AppLayout breadcrumbs={[
			{ title: 'System', href: '#' },
			{ title: 'Security & Access', href: '#' },
			{ title: 'Roles & Permissions', href: '/system/security/roles' },
		]}>
			<Head title="Roles & Permissions" />

			<div className="space-y-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight dark:text-foreground">Roles & Permissions</h1>
						<p className="text-muted-foreground mt-1">
							Manage system roles and their permissions
						</p>
					</div>
					<Link href="/system/security/roles/create">
						<Button className="gap-2">
							<Plus className="h-4 w-4" />
							Create Role
						</Button>
					</Link>
				</div>

				{/* Stats */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Total Roles</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.total_roles}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">System Roles</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.system_roles}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Custom Roles</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.custom_roles}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Permissions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.total_permissions}</div>
						</CardContent>
					</Card>
				</div>

				{/* Search */}
				<Card>
					<CardHeader>
						<CardTitle>Search Roles</CardTitle>
						<CardDescription>Filter by role name or description</CardDescription>
					</CardHeader>
					<CardContent>
						<Input
							placeholder="Search roles..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="max-w-sm"
						/>
					</CardContent>
				</Card>

				{/* Roles List */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">All Roles ({filteredRoles.length})</h2>
					</div>

					{filteredRoles.length === 0 ? (
						<Card>
							<CardContent className="py-12 text-center text-muted-foreground">
								No roles found matching your search
							</CardContent>
						</Card>
					) : (
						filteredRoles.map((role) => (
							<Card key={role.id} className="hover:shadow-md transition-shadow">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<div className="flex items-center gap-2">
												<CardTitle className="text-base">{role.name}</CardTitle>
												{isSystemRole(role.name) ? (
													<Badge variant="outline" className="gap-1">
														<Lock className="h-3 w-3" />
														System
													</Badge>
												) : (
													<Badge variant="secondary">Custom</Badge>
												)}
											</div>
											<CardDescription>
												{role.description || 'No description provided'}
											</CardDescription>
										</div>
										<div className="flex gap-2">
											<Link href={`/system/security/roles/${role.id}/edit`}>
												<Button
													variant="outline"
													size="sm"
													disabled={isSystemRole(role.name)}
													className="gap-2"
												>
													<Edit2 className="h-4 w-4" />
													Edit
												</Button>
											</Link>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleDelete(role.id)}
												disabled={isSystemRole(role.name) || role.users_count > 0}
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
									<div className="grid gap-4 md:grid-cols-3">
										<div>
											<p className="text-sm text-muted-foreground">Permissions</p>
											<p className="text-2xl font-semibold">{role.permissions_count}</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Users Assigned</p>
											<p className="text-2xl font-semibold">{role.users_count}</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Created</p>
											<p className="text-sm">{role.created_at}</p>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			</div>
		</AppLayout>
	);
}
