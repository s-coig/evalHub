import axios from 'axios';
import type { EvalRun, EvalUploadResponse, EvalConfigRequest, Report, EvalData } from '../types/eval';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function listEvalRuns(): Promise<EvalRun[]> {
  const response = await api.get<EvalRun[]>('/api/eval-runs');
  return response.data;
}

export async function uploadEval(data: EvalData): Promise<EvalUploadResponse> {
  const response = await api.post<EvalUploadResponse>('/api/eval-runs/upload', data);
  return response.data;
}

export async function uploadEvalFile(file: File): Promise<EvalUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<EvalUploadResponse>('/api/eval-runs/upload-file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function getEvalRun(runId: string): Promise<EvalUploadResponse> {
  const response = await api.get<EvalUploadResponse>(`/api/eval-runs/${runId}`);
  return response.data;
}

export async function getEvalRunData(runId: string): Promise<EvalData> {
  const response = await api.get<EvalData>(`/api/eval-runs/${runId}/data`);
  return response.data;
}

export async function configureEval(runId: string, config: EvalConfigRequest): Promise<void> {
  await api.post(`/api/eval-runs/${runId}/configure`, config);
}

export async function generateReport(runId: string): Promise<Report> {
  const response = await api.post<Report>(`/api/eval-runs/${runId}/generate`);
  return response.data;
}

export async function getReport(reportId: string): Promise<Report> {
  const response = await api.get<Report>(`/api/reports/${reportId}`);
  return response.data;
}

export async function getReportByRunId(runId: string): Promise<Report> {
  const response = await api.get<Report>(`/api/reports/by-run/${runId}`);
  return response.data;
}

export async function getPublicReport(token: string): Promise<Report> {
  const response = await api.get<Report>(`/api/public/reports/${token}`);
  return response.data;
}

export function getExportUrl(reportId: string): string {
  return `${API_URL}/api/reports/${reportId}/export`;
}

export function getPptxExportUrl(reportId: string): string {
  return `${API_URL}/api/reports/${reportId}/export-pptx`;
}
