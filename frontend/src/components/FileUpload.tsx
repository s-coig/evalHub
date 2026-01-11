import { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function FileUpload({ onFileSelect, isUploading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.json')) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
        isDragging
          ? 'border-brand-400 bg-brand-50/50'
          : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/30'
      } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".json"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer block"
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 spinner mb-4"></div>
            <p className="text-sm font-medium text-neutral-700">Uploading your evaluation...</p>
            <p className="text-xs text-neutral-500 mt-1">This may take a moment</p>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-900">{selectedFile.name}</p>
            <p className="text-xs text-neutral-500 mt-1">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-200 ${
              isDragging ? 'bg-brand-100' : 'bg-neutral-100'
            }`}>
              <svg className={`w-8 h-8 transition-colors duration-200 ${
                isDragging ? 'text-brand-600' : 'text-neutral-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-700">
              <span className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">Click to upload</span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-neutral-500 mt-2">JSON evaluation files only</p>
          </div>
        )}
      </label>

      {/* Visual indicator ring when dragging */}
      {isDragging && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-brand-400 ring-offset-2 pointer-events-none" />
      )}
    </div>
  );
}
