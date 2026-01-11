export type EvalStatus = 'uploaded' | 'configured' | 'generated';
export type Recommendation = 'ship' | 'needs_work' | 'block';

export interface EvalRun {
  id: string;
  project_name: string;
  run_name: string;
  eval_type?: string;
  status: EvalStatus;
  created_at: string;
  has_report: boolean;
}

export interface EvalUploadResponse {
  id: string;
  project_name: string;
  run_name: string;
  status: EvalStatus;
  created_at: string;
}

export interface EvalData {
  project_name: string;
  run_name: string;
  metrics: Record<string, number>;
  test_cases_total?: number;
  test_cases_passed?: number;
  baseline_metrics?: Record<string, number>;
}

export interface ContextConfig {
  project_description: string;
  success_criteria: Record<string, number>;
  baseline_comparison?: Record<string, number>;
  stakeholder_concerns?: string[];
  business_impact?: string;
}

export interface EvalConfigRequest {
  context: ContextConfig;
}

export interface Report {
  id: string;
  eval_run_id: string;
  project_name: string;
  run_name: string;
  summary: string;
  recommendation?: Recommendation;
  key_findings?: string[];
  risk_assessment?: string;
  trade_offs?: string;
  generated_at: string;
  shareable_token: string;
  metrics: Record<string, number>;
  config?: ContextConfig;
}
