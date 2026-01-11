import { useForm, useFieldArray } from 'react-hook-form';
import type { ContextConfig } from '../types/eval';

interface ConfigFormProps {
  onSubmit: (data: ContextConfig) => void;
  isSubmitting: boolean;
  defaultMetrics?: Record<string, number>;
}

interface FormData {
  project_description: string;
  success_criteria: { key: string; value: string }[];
  stakeholder_concerns: { value: string }[];
  business_impact: string;
}

export function ConfigForm({ onSubmit, isSubmitting, defaultMetrics }: ConfigFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      project_description: '',
      success_criteria: defaultMetrics
        ? Object.keys(defaultMetrics).map(key => ({ key, value: String(defaultMetrics[key]) }))
        : [{ key: '', value: '' }],
      stakeholder_concerns: [{ value: '' }],
      business_impact: '',
    },
  });

  const { fields: criteriaFields, append: appendCriteria, remove: removeCriteria } = useFieldArray({
    control,
    name: 'success_criteria',
  });

  const { fields: concernFields, append: appendConcern, remove: removeConcern } = useFieldArray({
    control,
    name: 'stakeholder_concerns',
  });

  const handleFormSubmit = (data: FormData) => {
    const successCriteria: Record<string, number> = {};
    data.success_criteria.forEach(item => {
      if (item.key && item.value) {
        successCriteria[item.key] = parseFloat(item.value);
      }
    });

    const concerns = data.stakeholder_concerns
      .map(c => c.value)
      .filter(Boolean);

    onSubmit({
      project_description: data.project_description,
      success_criteria: successCriteria,
      stakeholder_concerns: concerns.length > 0 ? concerns : undefined,
      business_impact: data.business_impact || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Project Description */}
      <div>
        <label className="label">
          Project Description
          <span className="text-rose-500 ml-1">*</span>
        </label>
        <textarea
          {...register('project_description', { required: 'Project description is required' })}
          rows={4}
          className={`input resize-none ${errors.project_description ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}`}
          placeholder="Describe what this model/system does and its purpose in your organization..."
        />
        {errors.project_description && (
          <p className="mt-2 text-sm text-rose-600 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.project_description.message}
          </p>
        )}
      </div>

      {/* Success Criteria */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="label mb-0">
              Success Criteria
              <span className="text-rose-500 ml-1">*</span>
            </label>
            <p className="text-xs text-neutral-500 mt-0.5">
              Define thresholds that determine if the evaluation passes
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {criteriaFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  {...register(`success_criteria.${index}.key`)}
                  placeholder="Metric name (e.g., accuracy)"
                  className="input"
                />
              </div>
              <div className="w-32">
                <input
                  {...register(`success_criteria.${index}.value`)}
                  placeholder="Threshold"
                  type="number"
                  step="any"
                  className="input"
                />
              </div>
              {criteriaFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCriteria(index)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => appendCriteria({ key: '', value: '' })}
          className="mt-3 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add criterion
        </button>
      </div>

      {/* Stakeholder Concerns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="label mb-0">Stakeholder Concerns</label>
            <p className="text-xs text-neutral-500 mt-0.5">
              What are leadership most worried about?
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {concernFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  {...register(`stakeholder_concerns.${index}.value`)}
                  placeholder="e.g., Cost overruns, User trust, Latency issues"
                  className="input"
                />
              </div>
              {concernFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeConcern(index)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => appendConcern({ value: '' })}
          className="mt-3 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add concern
        </button>
      </div>

      {/* Business Impact */}
      <div>
        <label className="label">Business Impact</label>
        <textarea
          {...register('business_impact')}
          rows={3}
          className="input resize-none"
          placeholder="What business outcomes depend on this model? (e.g., revenue impact, customer satisfaction)"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-neutral-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center py-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 spinner mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generate Report
            </>
          )}
        </button>
        <p className="text-xs text-neutral-500 text-center mt-3">
          This will analyze your evaluation data and generate an executive summary
        </p>
      </div>
    </form>
  );
}
