import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { AlertCircle, Lock, Clock, LogIn } from 'lucide-react';

interface Policy {
	id: number;
	policy_key: string;
	policy_value: string;
	policy_type: string;
	description: string;
	category: string;
	is_enabled: boolean;
}

interface PoliciesPageProps {
	policies: {
		password: Policy[];
		'2fa': Policy[];
		session: Policy[];
		login: Policy[];
	};
	stats: {
		total_policies: number;
		password_policies: number;
		session_policies: number;
		login_policies: number;
	};
}

export default function PoliciesPage({ policies, stats }: PoliciesPageProps) {
	const [editingPolicies, setEditingPolicies] = useState<Record<string, string>>({});
	const [toggledPolicies, setToggledPolicies] = useState<Record<string, boolean>>({});

	const handlePolicyChange = (policyKey: string, value: string) => {
		setEditingPolicies(prev => ({
			...prev,
			[policyKey]: value,
		}));
	};

	const handleToggle = (policyKey: string, currentState: boolean) => {
		setToggledPolicies(prev => ({
			...prev,
			[policyKey]: !currentState,
		}));
	};

	const handleSave = () => {
		const policiesToSave = Object.keys(editingPolicies).map(policyKey => {
			const policy = findPolicy(policyKey);
			return {
				policy_key: policyKey,
				policy_value: editingPolicies[policyKey],
				is_enabled: toggledPolicies[policyKey] !== undefined ? toggledPolicies[policyKey] : policy?.is_enabled,
			};
		});

		if (policiesToSave.length === 0) {
			return;
		}

		router.post('/system/security/policies', {
			policies: policiesToSave,
		}, {
			onSuccess: () => {
				setEditingPolicies({});
				setToggledPolicies({});
			},
		});
	};

	const findPolicy = (key: string): Policy | undefined => {
		for (const category of Object.values(policies)) {
			const policy = Array.isArray(category) ? category.find(p => p.policy_key === key) : undefined;
			if (policy) return policy;
		}
		return undefined;
	};

	const renderPolicyInput = (policy: Policy) => {
		const currentValue = editingPolicies[policy.policy_key] !== undefined
			? editingPolicies[policy.policy_key]
			: policy.policy_value;
		const currentToggle = toggledPolicies[policy.policy_key] !== undefined
			? toggledPolicies[policy.policy_key]
			: policy.is_enabled;

		if (policy.policy_type === 'boolean') {
			return (
				<Toggle
					pressed={currentToggle}
					onPressedChange={() => handleToggle(policy.policy_key, currentToggle)}
					className="data-[state=on]:bg-green-300"
				>
					{currentToggle ? 'Enabled' : 'Disabled'}
				</Toggle>
			);
		}

		return (
			<Input
				value={currentValue}
				onChange={(e) => handlePolicyChange(policy.policy_key, e.target.value)}
				type={policy.policy_type === 'integer' ? 'number' : 'text'}
				className="max-w-xs"
			/>
		);
	};

	const categoryConfig = {
		password: {
			icon: Lock,
			title: 'Password Policies',
			description: 'Configure password complexity and expiration rules',
			color: 'text-blue-600',
		},
		'2fa': {
			icon: AlertCircle,
			title: 'Two-Factor Authentication',
			description: 'Configure 2FA enforcement and settings',
			color: 'text-purple-600',
		},
		session: {
			icon: Clock,
			title: 'Session Policies',
			description: 'Configure session timeout and concurrency limits',
			color: 'text-orange-600',
		},
		login: {
			icon: LogIn,
			title: 'Login Policies',
			description: 'Configure login attempt limits and lockouts',
			color: 'text-red-600',
		},
	};

	return (
		<AppLayout breadcrumbs={[
			{ title: 'System', href: '#' },
			{ title: 'Security & Access', href: '#' },
			{ title: 'Security Policies', href: '/system/security/policies' },
		]}>
			<Head title="Security Policies" />

			<div className="space-y-6 p-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight dark:text-foreground">Security Policies</h1>
						<p className="text-muted-foreground mt-1">
							Configure system-wide security policies and compliance settings
						</p>
					</div>
				</div>

				{/* Stats */}
				<div className="grid gap-4 md:grid-cols-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Total Policies</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.total_policies}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Password</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.password_policies}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Session</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.session_policies}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Login</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{stats.login_policies}</div>
						</CardContent>
					</Card>
				</div>

				{/* Policies by Category */}
				<div className="space-y-6">
					{(Object.keys(policies) as Array<keyof typeof policies>).map(category => {
						const categoryPolicies = policies[category];
						const config = categoryConfig[category as keyof typeof categoryConfig];

						if (categoryPolicies.length === 0) return null;

						const Icon = config.icon;

						return (
							<Card key={category}>
								<CardHeader>
									<div className="flex items-center gap-2">
										<Icon className={`h-5 w-5 ${config.color}`} />
										<div>
											<CardTitle>{config.title}</CardTitle>
											<CardDescription>{config.description}</CardDescription>
										</div>
									</div>
								</CardHeader>
								<Separator />
								<CardContent className="pt-6">
									<div className="space-y-4">
										{categoryPolicies.map(policy => (
											<div key={policy.policy_key} className="flex items-center justify-between py-3 border-b last:border-0">
												<div className="flex-1">
													<p className="font-medium">{policy.description}</p>
													<p className="text-sm text-muted-foreground">Key: {policy.policy_key}</p>
												</div>
												<div className="flex items-center gap-4">
													{renderPolicyInput(policy)}
													{(editingPolicies[policy.policy_key] !== undefined ||
														toggledPolicies[policy.policy_key] !== undefined) && (
														<Badge variant="outline" className="bg-yellow-300">
															Modified
														</Badge>
													)}
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2 sticky bottom-6">
					<Button
						onClick={handleSave}
						disabled={Object.keys(editingPolicies).length === 0 && Object.keys(toggledPolicies).length === 0}
						className="gap-2"
					>
						Save Changes
					</Button>
					<Button
						variant="outline"
						onClick={() => {
							setEditingPolicies({});
							setToggledPolicies({});
						}}
					>
						Cancel
					</Button>
				</div>
			</div>
		</AppLayout>
	);
}
