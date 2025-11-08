import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    FileText, 
    Upload, 
    Download, 
    Trash2, 
    Eye,
    File,
    FileCheck,
    AlertCircle
} from 'lucide-react';

interface Document {
    id: number;
    name: string;
    type: string;
    size: string;
    uploaded_at: string;
    uploaded_by: string;
    category: 'contract' | 'id' | 'certificate' | 'medical' | 'other';
}

interface EmployeeDocumentsTabProps {
    employeeId: number;
    documents?: Document[];
}

export function EmployeeDocumentsTab({ documents = [] }: EmployeeDocumentsTabProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = [
        { value: 'all', label: 'All Documents', icon: FileText },
        { value: 'contract', label: 'Contracts', icon: FileCheck },
        { value: 'id', label: 'IDs & Licenses', icon: File },
        { value: 'certificate', label: 'Certificates', icon: FileCheck },
        { value: 'medical', label: 'Medical', icon: FileText },
        { value: 'other', label: 'Other', icon: File },
    ];

    const filteredDocuments = selectedCategory === 'all' 
        ? documents 
        : documents.filter(doc => doc.category === selectedCategory);

    const getCategoryBadgeColor = (category: string) => {
        switch (category) {
            case 'contract': return 'bg-blue-100 text-blue-800';
            case 'id': return 'bg-green-100 text-green-800';
            case 'certificate': return 'bg-purple-100 text-purple-800';
            case 'medical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryLabel = (category: string) => {
        const found = categories.find(c => c.value === category);
        return found ? found.label : 'Other';
    };

    return (
        <div className="space-y-6">
            {/* Header with Upload Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Employee Documents</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage employment documents, certificates, and IDs
                    </p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </div>

            {/* Category Filter */}
            <Card className="p-4">
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Button
                                key={category.value}
                                variant={selectedCategory === category.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedCategory(category.value)}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {category.label}
                            </Button>
                        );
                    })}
                </div>
            </Card>

            {/* Documents List or Empty State */}
            {filteredDocuments.length === 0 ? (
                <Card className="p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                            {selectedCategory === 'all' 
                                ? "No documents have been uploaded for this employee. Upload the first document to get started."
                                : `No ${getCategoryLabel(selectedCategory).toLowerCase()} documents found. Try selecting a different category.`
                            }
                        </p>
                        {selectedCategory === 'all' && (
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload First Document
                            </Button>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredDocuments.map((document) => (
                        <Card key={document.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="rounded-lg bg-muted p-3">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium truncate">{document.name}</h4>
                                            <Badge className={getCategoryBadgeColor(document.category)}>
                                                {getCategoryLabel(document.category)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span>{document.type}</span>
                                            <span>•</span>
                                            <span>{document.size}</span>
                                            <span>•</span>
                                            <span>Uploaded {document.uploaded_at}</span>
                                            <span>•</span>
                                            <span>By {document.uploaded_by}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Coming Soon Notice */}
            <Card className="p-6 bg-amber-50 border-amber-200">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-amber-900 mb-1">
                            Document Management Coming Soon
                        </h4>
                        <p className="text-sm text-amber-800">
                            Full document upload, preview, and management features are currently under development. 
                            This includes support for multiple file types, version control, and secure document storage.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
