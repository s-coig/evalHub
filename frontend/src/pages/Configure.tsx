import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ConfigForm } from '../components/ConfigForm';
import { getEvalRun, getEvalRunData, configureEval, generateReport } from '../api/client';
import type { EvalUploadResponse, EvalData, ContextConfig } from '../types/eval';

function MetricCard({ label, value }: { label: string; value: number }) {
  const isPercentage = value > 0 && value <= 1;
  const displayValue = isPercentage ? `${(value * 100).toFixed(1)}%` : value.toLocaleString();

  return (
    <div className="metric-card">
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
        {label.replace(/_/g, ' ')}
      </p>
      <p className="text-xl font-bold text-neutral-900 mt-1">{displayValue}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 spinner mb-4"></div>
      <p className="text-sm text-neutral-500">Loading evaluation data...</p>
    </div>
  );
}

export function Configure() {
  const { runId } = useParams<{ runId: string }>();
  const navigate = useNavigate();
  const [evalRun, setEvalRun] = useState<EvalUploadResponse | null>(null);
  const [evalData, setEvalData] = useState<EvalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (runId) {
      loadEvalRun();
    }
  }, [runId]);

  const loadEvalRun = async () => {
    try {
      setLoading(true);
      const [run, data] = await Promise.all([
        getEvalRun(runId!),
        getEvalRunData(runId!),
      ]);
      setEvalRun(run);
      setEvalData(data);
    } catch (err) {
      setError('Failed to load evaluation data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (config: ContextConfig) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await configureEval(runId!, { context: config });
      await generateReport(runId!);

      navigate(`/report/${runId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && !evalRun) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-4 border-l-4 border-rose-500 bg-rose-50">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-rose-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-8">
        <Link to="/" className="text-neutral-500 hover:text-neutral-700 transition-colors">Dashboard</Link>
        <svg className="w-4 h-4 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-neutral-900 font-medium">Configure Report</span>
      </nav>

      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="page-title">Configure Report</h1>
            {evalRun && (
              <p className="text-neutral-500 text-sm">
                {evalRun.project_name} &middot; {evalRun.run_name}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="card p-4 border-l-4 border-rose-500 bg-rose-50 mb-6 animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-rose-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Metrics Preview */}
      {evalData && evalData.metrics && (
        <div className="card overflow-hidden mb-6 animate-fade-in">
          <div className="section-header flex items-center justify-between">
            <h2 className="section-title">Uploaded Metrics</h2>
            <span className="badge-primary text-2xs">
              {Object.keys(evalData.metrics).length} metrics
            </span>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Object.entries(evalData.metrics).map(([key, value]) => (
                <MetricCard key={key} label={key} value={value} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <div className="card overflow-hidden">
        <div className="section-header">
          <h2 className="section-title">Business Context</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Provide context to help generate a meaningful executive summary
          </p>
        </div>
        <div className="p-8">
          <ConfigForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            defaultMetrics={evalData?.metrics}
          />
        </div>
      </div>
    </div>
  );
}
