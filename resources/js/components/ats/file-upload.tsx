import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Upload, X } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  hint?: string;
  accept?: string;
  maxSize?: number; // in bytes
  onFileSelect: (file: File | null) => void;
  value?: string; // file name for display
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * File Upload Component
 * Handles file selection with validation for file type and size
 * Used for resume uploads and other document management
 *
 * @param label - Label for the input (default: 'Select File')
 * @param hint - Helper text (default: 'PDF, DOC, DOCX up to 5MB')
 * @param accept - Accepted file types (default: '.pdf,.doc,.docx')
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @param onFileSelect - Callback when file is selected
 * @param value - Current file name for display
 * @param error - Error message to display
 * @param required - Whether field is required
 * @param disabled - Whether input is disabled
 *
 * @example
 * const [file, setFile] = useState<File | null>(null);
 * <FileUpload
 *   label="Resume"
 *   onFileSelect={setFile}
 *   value={file?.name}
 * />
 */
export function FileUpload({
  label = 'Select File',
  hint = 'PDF, DOC, DOCX up to 5MB',
  accept = '.pdf,.doc,.docx',
  maxSize = 5 * 1024 * 1024, // 5MB
  onFileSelect,
  value,
  error,
  required = false,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = accept.split(',').map((type) => type.trim());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

    if (!validTypes.includes(fileExtension)) {
      setValidationError(`Invalid file type. Allowed types: ${accept}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / 1024 / 1024);
      setValidationError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setValidationError('');
  };

  const displayError = error || validationError;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          aria-label={label}
        />

        {value ? (
          <div className="flex items-center justify-center gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">File selected</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <div className="flex gap-2 rounded-md bg-destructive/10 p-3">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{displayError}</p>
        </div>
      )}
    </div>
  );
}
