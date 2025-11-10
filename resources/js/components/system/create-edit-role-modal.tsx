import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { X, ChevronDown } from 'lucide-react';

interface Role {
	id: number;
	name: string;
	description?: string;
	permissions?: number[];
}

interface Permission {
	id: number;
	name: string;
	module: string;
	description?: string;
}

interface Position {
	id: number;
	name: string;
	department: {
		name: string;
	};
}

interface Props {
	show: boolean;
	role?: Role | null;
	permissions: { [key: string]: Permission[] };
	positions: Position[];
	onClose: () => void;
}

export default function CreateEditRoleModal({ show, role, permissions, positions, onClose }: Props) {
	const [step, setStep] = useState<'form' | 'confirming' | 'success'>('form');
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
	const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
	const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
	const [showPositionDropdown, setShowPositionDropdown] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);

	// Initialize form when role changes
	useEffect(() => {
		if (!show) return;

		// Use a callback to batch state updates
		const initializeForm = () => {
			if (role) {
				setName(role.name);
				setDescription(role.description || '');
				setSelectedPermissions(role.permissions || []);
			} else {
				setName('');
				setDescription('');
				setSelectedPermissions([]);
				setSelectedPositions([]);
			}
			setErrors({});
			setStep('form');
		};

		initializeForm();
	}, [show, role]);

	const toggleModule = (module: string) => {
		const newExpanded = new Set(expandedModules);
		if (newExpanded.has(module)) {
			newExpanded.delete(module);
		} else {
			newExpanded.add(module);
		}
		setExpandedModules(newExpanded);
	};

	const togglePermission = (permissionId: number) => {
		setSelectedPermissions((prev) =>
			prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
		);
	};

	const togglePosition = (positionId: number) => {
		setSelectedPositions((prev) =>
			prev.includes(positionId) ? prev.filter((id) => id !== positionId) : [...prev, positionId]
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setStep('confirming');
	};

	const handleConfirm = async () => {
		setLoading(true);

		const data = {
			name,
			description,
			permissions: selectedPermissions,
			positions: selectedPositions,
		};

		if (role) {
			router.post(`/system/security/roles/${role.id}`, data, {
				onSuccess: () => {
					setStep('success');
					setTimeout(() => {
						onClose();
						setStep('form');
					}, 1500);
				},
				onError: (errors) => {
					setErrors(errors);
					setStep('form');
					setLoading(false);
				},
			});
		} else {
			router.post('/system/security/roles', data, {
				onSuccess: () => {
					setStep('success');
					setTimeout(() => {
						onClose();
						setStep('form');
					}, 1500);
				},
				onError: (errors) => {
					setErrors(errors);
					setStep('form');
					setLoading(false);
				},
			});
		}
	};

	if (!show) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
					<h2 className="text-xl font-bold text-gray-900">
						{step === 'success' ? '✓ Success' : role ? 'Edit Role' : 'Create Role'}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition"
						disabled={loading}
					>
						<X size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{step === 'success' ? (
						<div className="text-center py-12">
							<div className="text-4xl mb-4">✓</div>
							<p className="text-gray-600">
								{role ? 'Role updated successfully' : 'Role created successfully'}
							</p>
						</div>
					) : step === 'confirming' ? (
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
								<p className="text-lg font-semibold text-gray-900">{name}</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
								<p className="text-gray-600">{description || '(No description)'}</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Permissions ({selectedPermissions.length})
								</label>
								<div className="bg-gray-50 rounded p-3">
									<div className="space-y-1">
										{Object.entries(permissions).map(([module, perms]) => {
											const selectedInModule = perms.filter((p) =>
												selectedPermissions.includes(p.id)
											);
											if (selectedInModule.length === 0) return null;

											return (
												<div key={module}>
													<div className="font-semibold text-gray-700">{module}</div>
													<ul className="list-disc list-inside text-sm text-gray-600 ml-2">
														{selectedInModule.map((p) => (
															<li key={p.id}>{p.name}</li>
														))}
													</ul>
												</div>
											);
										})}
									</div>
								</div>
							</div>

							{selectedPositions.length > 0 && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Positions ({selectedPositions.length})
									</label>
									<div className="bg-gray-50 rounded p-3">
										<ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
											{positions
												.filter((p) => selectedPositions.includes(p.id))
												.map((p) => (
													<li key={p.id}>
														{p.name} ({p.department.name})
													</li>
												))}
										</ul>
									</div>
								</div>
							)}

							<div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
								<p className="font-semibold mb-1">Confirm Details</p>
								<p>
									{role ? 'Update this role with the above settings?' : 'Create this new role with the above settings?'}
								</p>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Role Name */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g., Department Manager"
									className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
										errors.name ? 'border-red-500' : 'border-gray-300'
									}`}
									required
								/>
								{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Brief description of this role's purpose"
									rows={3}
									className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
										errors.description ? 'border-red-500' : 'border-gray-300'
									}`}
								/>
								{errors.description && (
									<p className="text-red-500 text-sm mt-1">{errors.description}</p>
								)}
							</div>

							{/* Permissions Matrix */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-3">
									Permissions ({selectedPermissions.length})
								</label>
								<div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
									{Object.entries(permissions).map(([module, perms]) => (
										<div key={module}>
											<button
												type="button"
												onClick={() => toggleModule(module)}
												className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition font-semibold text-gray-900"
											>
												<span>{module}</span>
												<ChevronDown
													size={18}
													className={`transition transform ${
														expandedModules.has(module) ? 'rotate-180' : ''
													}`}
												/>
											</button>

											{expandedModules.has(module) && (
												<div className="bg-gray-50 p-4 space-y-3">
													{perms.map((perm) => (
														<label key={perm.id} className="flex items-start gap-3 cursor-pointer">
															<input
																type="checkbox"
																checked={selectedPermissions.includes(perm.id)}
																onChange={() => togglePermission(perm.id)}
																className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
															/>
															<div className="flex-1">
																<p className="text-sm font-medium text-gray-900">{perm.name}</p>
																{perm.description && (
																	<p className="text-xs text-gray-600">{perm.description}</p>
																)}
															</div>
														</label>
													))}
												</div>
											)}
										</div>
									))}
								</div>
								{errors.permissions && (
									<p className="text-red-500 text-sm mt-1">{errors.permissions}</p>
								)}
							</div>

							{/* Position Mapping */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Default Positions (Optional)
								</label>
								<div className="relative">
									<button
										type="button"
										onClick={() => setShowPositionDropdown(!showPositionDropdown)}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition"
									>
										<span>
											{selectedPositions.length === 0
												? 'Select positions...'
												: `${selectedPositions.length} position(s) selected`}
										</span>
										<ChevronDown
											size={18}
											className={`transition transform ${showPositionDropdown ? 'rotate-180' : ''}`}
										/>
									</button>

									{showPositionDropdown && (
										<div className="absolute top-full left-0 right-0 mt-2 border border-gray-300 rounded-lg bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
											{positions.map((pos) => (
												<label
													key={pos.id}
													className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
												>
													<input
														type="checkbox"
														checked={selectedPositions.includes(pos.id)}
														onChange={() => togglePosition(pos.id)}
														className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
													/>
													<div>
														<p className="text-sm font-medium text-gray-900">{pos.name}</p>
														<p className="text-xs text-gray-600">{pos.department.name}</p>
													</div>
												</label>
											))}
										</div>
									)}
								</div>
							</div>
						</form>
					)}
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-3 justify-end">
					{step === 'success' ? (
						<button
							onClick={onClose}
							className="px-6 py-2 text-gray-700 hover:text-gray-900 transition"
						>
							Done
						</button>
					) : step === 'confirming' ? (
						<>
							<button
								onClick={() => setStep('form')}
								className="px-6 py-2 text-gray-700 hover:text-gray-900 transition border border-gray-300 rounded-lg"
								disabled={loading}
							>
								Back
							</button>
							<button
								onClick={handleConfirm}
								disabled={loading}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? 'Processing...' : role ? 'Update Role' : 'Create Role'}
							</button>
						</>
					) : (
						<>
							<button
								onClick={onClose}
								className="px-6 py-2 text-gray-700 hover:text-gray-900 transition"
							>
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
							>
								{role ? 'Update Role' : 'Create Role'}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
