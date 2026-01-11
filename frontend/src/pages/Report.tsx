import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReportView } from '../components/ReportView';
import { getReportByRunId } from '../api/client';
import type { Report as ReportType } from '../types/eval';

export function Report() {
  const { runId } = useParams<{ runId: string }>();
  const [report, setReport] = useState<ReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (runId) {
      loadReport();
    }
  }, [runId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await getReportByRunId(runId!);
      setReport(data);
    } catch (err) {
      setError('Failed to load report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-md inline-block">
          {error || 'Report not found'}
        </div>
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to Dashboard
        </Link>
      </div>
      <ReportView report={report} />
    </div>
  );
}
