import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listEvalRuns } from '../api/client';
import type { EvalRun } from '../types/eval';

function StatusIndicator({ status, hasReport }: { status: string; hasReport: boolean }) {
  if (hasReport) {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-sm text-neutral-600">Complete</span>
      </div>
    );
  }
  if (status === 'configured') {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span className="text-sm text-neutral-600">Ready</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-300"></span>
      </span>
      <span className="text-sm text-neutral-500">Draft</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100 mb-6">
        <svg className="w-10 h-10 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-2">No evaluations yet</h2>
      <p className="text-neutral-500 mb-8 max-w-md mx-auto">
        Upload your first ML evaluation results to generate executive-ready reports with AI-powered insights.
      </p>
      <Link to="/upload" className="btn-primary">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Upload First Evaluation</span>
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
      {/* Skeleton stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6">
            <div className="skeleton h-4 w-24 mb-3"></div>
            <div className="skeleton h-9 w-16"></div>
          </div>
        ))}
      </div>
      {/* Skeleton table */}
      <div className="card">
        <div className="p-6 border-b border-neutral-100">
          <div className="skeleton h-5 w-40"></div>
        </div>
        <div className="divide-y divide-neutral-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <div className="skeleton h-4 w-48"></div>
                <div className="skeleton h-3 w-32"></div>
              </div>
              <div className="skeleton h-8 w-24 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }: { label: string; value: number; icon: React.ReactNode; trend?: { value: string; up: boolean } }) {
  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trend.up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}>
            {trend.up ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {trend.value}
          </span>
        )}
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

export function Dashboard() {
  const [runs, setRuns] = useState<EvalRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    try {
      setLoading(true);
      const data = await listEvalRuns();
      setRuns(data);
    } catch (err) {
      setError('Unable to load evaluations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: runs.length,
    completed: runs.filter(r => r.has_report).length,
    pending: runs.filter(r => !r.has_report).length,
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Track and manage your ML evaluation reports</p>
        </div>
        <Link to="/upload" className="btn-primary self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Evaluation</span>
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {runs.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              label="Total Evaluations"
              value={stats.total}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <StatCard
              label="Reports Generated"
              value={stats.completed}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              trend={stats.total > 0 ? { value: `${Math.round((stats.completed / stats.total) * 100)}%`, up: true } : undefined}
            />
            <StatCard
              label="Pending Review"
              value={stats.pending}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Evaluations table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100">
              <h2 className="text-base font-semibold text-neutral-900">Recent Evaluations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50/50">
                    <th className="table-header">Project</th>
                    <th className="table-header">Run</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Created</th>
                    <th className="table-header text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run, index) => (
                    <tr key={run.id} className="table-row" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="table-cell">
                        <span className="font-medium text-neutral-900">{run.project_name}</span>
                      </td>
                      <td className="table-cell text-neutral-600">{run.run_name}</td>
                      <td className="table-cell">
                        <StatusIndicator status={run.status} hasReport={run.has_report} />
                      </td>
                      <td className="table-cell text-neutral-500">
                        {new Date(run.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="table-cell text-right">
                        <Link
                          to={run.has_report ? `/report/${run.id}` : `/configure/${run.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                        >
                          {run.has_report ? 'View Report' : run.status === 'configured' ? 'Generate' : 'Configure'}
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
