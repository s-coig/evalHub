import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { uploadEvalFile } from '../api/client';

export function Upload() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      const result = await uploadEvalFile(file);
      navigate(`/configure/${result.id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to upload file. Please check the format and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-neutral-500 hover:text-neutral-700 transition-colors">Dashboard</Link>
        <svg className="w-4 h-4 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-neutral-900 font-medium">Upload Evaluation</span>
      </nav>

      {/* Page Header */}
      <div className="mb-10">
        <h1 className="page-title">Upload Evaluation Results</h1>
        <p className="page-subtitle">
          Import your ML evaluation data to generate executive-ready reports powered by AI analysis.
        </p>
      </div>

      {error && (
        <div className="card p-4 border-l-4 border-rose-500 bg-rose-50 mb-6 animate-fade-in">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-rose-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-rose-700">{error}</p>
              <p className="text-sm text-rose-600 mt-1">Make sure your file is a valid JSON with the required fields.</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Card */}
      <div className="card overflow-hidden">
        <div className="p-8 sm:p-10">
          <FileUpload onFileSelect={handleFileSelect} isUploading={isUploading} />
        </div>

        {/* Expected Format Section */}
        <div className="border-t border-neutral-200 bg-neutral-50/50 p-8 sm:p-10">
          <div className="flex items-start space-x-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Expected JSON Format</h3>
              <p className="text-sm text-neutral-500 mt-0.5">Your evaluation file should follow this structure</p>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm text-neutral-300 font-mono leading-relaxed">
{`{
  "project_name": "Customer Support Chatbot",
  "run_name": "2024-01-10-accuracy-eval",
  "metrics": {
    "accuracy": 0.87,
    "precision": 0.85,
    "recall": 0.89,
    "latency_p95_ms": 450,
    "cost_per_1k_requests": 0.023
  },
  "test_cases_total": 500,
  "test_cases_passed": 435,
  "baseline_metrics": {
    "accuracy": 0.82,
    "latency_p95_ms": 520
  }
}`}
            </pre>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Required Fields</p>
                <p className="text-xs text-neutral-500 mt-0.5">project_name, run_name, metrics</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Supported Types</p>
                <p className="text-xs text-neutral-500 mt-0.5">JSON files only (.json)</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Baseline Optional</p>
                <p className="text-xs text-neutral-500 mt-0.5">Include for comparison</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
