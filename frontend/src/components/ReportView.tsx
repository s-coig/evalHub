import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Report, Recommendation } from '../types/eval';
import { MetricsChart } from './MetricsChart';
import { getExportUrl, getPptxExportUrl } from '../api/client';

interface ReportViewProps {
  report: Report;
  showActions?: boolean;
}

function RecommendationBadge({ recommendation }: { recommendation?: Recommendation }) {
  if (!recommendation) return null;

  const classNames: Record<Recommendation, string> = {
    ship: 'recommendation-ship',
    needs_work: 'recommendation-needs-work',
    block: 'recommendation-block',
  };

  const config: Record<Recommendation, { icon: JSX.Element; label: string }> = {
    ship: {
      label: 'Ready to Ship',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    needs_work: {
      label: 'Needs Work',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    block: {
      label: 'Blocked',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    },
  };

  const { icon, label } = config[recommendation];

  return (
    <span className={classNames[recommendation]}>
      <span className="mr-2">{icon}</span>
      {label}
    </span>
  );
}

function MarkdownContent({ content, className = '' }: { content: string; className?: string }) {
  return (
    <div className={`prose-report ${className}`}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p>{children}</p>,
          strong: ({ children }) => <strong>{children}</strong>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function SectionCard({ title, icon, children, accentColor = 'primary' }: {
  title: string;
  icon: JSX.Element;
  children: React.ReactNode;
  accentColor?: 'primary' | 'success' | 'warning' | 'purple' | 'slate';
}) {
  const colors = {
    primary: 'from-brand-600 to-brand-700',
    success: 'from-emerald-600 to-emerald-700',
    warning: 'from-amber-500 to-amber-600',
    purple: 'from-violet-600 to-violet-700',
    slate: 'from-neutral-700 to-neutral-800',
  };

  return (
    <div className="report-section">
      <div className={`bg-gradient-to-r ${colors[accentColor]} px-6 py-4`}>
        <h2 className="text-base font-semibold text-white flex items-center">
          <span className="mr-2.5 opacity-90">{icon}</span>
          {title}
        </h2>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}

export function ReportView({ report, showActions = true }: ReportViewProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/public/${report.shareable_token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedDate = new Date(report.generated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="card overflow-hidden">
        <div className="gradient-dark p-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{report.project_name}</h1>
                  <p className="text-neutral-300">{report.run_name}</p>
                </div>
              </div>
              <p className="text-sm text-neutral-400">
                Generated {generatedDate}
              </p>
            </div>
            <RecommendationBadge recommendation={report.recommendation} />
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <SectionCard
        title="Executive Summary"
        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>}
        accentColor="primary"
      >
        <MarkdownContent content={report.summary} />
      </SectionCard>

      {/* Key Findings */}
      {report.key_findings && report.key_findings.length > 0 && (
        <SectionCard
          title="Key Findings"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>}
          accentColor="success"
        >
          <div className="space-y-5">
            {report.key_findings.map((finding, i) => (
              <div key={i} className="finding-item">
                <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold mr-4">
                  {i + 1}
                </span>
                <MarkdownContent content={finding} className="flex-1 pt-0.5" />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Metrics */}
      {report.metrics && Object.keys(report.metrics).length > 0 && (
        <SectionCard
          title="Metrics Overview"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>}
          accentColor="purple"
        >
          <MetricsChart metrics={report.metrics} />
        </SectionCard>
      )}

      {/* Risk Assessment */}
      {report.risk_assessment && (
        <SectionCard
          title="Risk Assessment"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>}
          accentColor="warning"
        >
          <MarkdownContent content={report.risk_assessment} />
        </SectionCard>
      )}

      {/* Trade-offs */}
      {report.trade_offs && (
        <SectionCard
          title="Trade-offs Analysis"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>}
          accentColor="purple"
        >
          <MarkdownContent content={report.trade_offs} />
        </SectionCard>
      )}

      {/* Export & Share */}
      {showActions && (
        <div className="card overflow-hidden">
          <div className="section-header">
            <h2 className="section-title">Export & Share</h2>
          </div>
          <div className="p-8">
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href={getExportUrl(report.id)}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Download PDF
              </a>
              <a
                href={getPptxExportUrl(report.id)}
                className="btn-secondary"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Download PowerPoint
              </a>
              <button
                onClick={handleCopyLink}
                className="btn-ghost"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Copy Share Link
                  </>
                )}
              </button>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4 flex items-center border border-neutral-200">
              <span className="text-sm font-medium text-neutral-500 mr-3">Share URL:</span>
              <code className="flex-1 text-sm bg-white px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 truncate font-mono">
                {shareUrl}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
