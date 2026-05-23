'use client';

import { useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { auditFormSchema, type AuditFormValues } from '@/lib/validations';
import { PRICING_DATA, isUsageBased } from '@/lib/pricing-data';
import type { ToolId } from '@/types';

const STORAGE_KEY = 'spendlens_audit_form_v1';

const USE_CASES = [
  { value: 'coding', label: '💻 Coding & Dev', desc: 'Software development, debugging, PR reviews' },
  { value: 'writing', label: '✍️ Writing & Docs', desc: 'Content, copywriting, documentation' },
  { value: 'data', label: '📊 Data & Analysis', desc: 'SQL, data science, spreadsheets' },
  { value: 'research', label: '🔍 Research', desc: 'Literature review, summarisation' },
  { value: 'mixed', label: '🎯 Mixed', desc: 'Combination of the above' },
] as const;

export default function AuditForm() {
  const router = useRouter();

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } =
    useForm<AuditFormValues>({
      resolver: zodResolver(auditFormSchema),
      defaultValues: {
        teamSize: 1,
        useCase: 'coding',
        tools: [],
      },
    });

  const { fields, append, remove } = useFieldArray({ control, name: 'tools' });

  // ── Load from localStorage on mount ────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        reset(parsed);
      }
    } catch { /* ignore */ }
  }, [reset]);

  // ── Save to localStorage on every change ────────────────────────────────
  const formValues = watch();
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    } catch { /* ignore */ }
  }, [formValues]);

  // ── Add tool ────────────────────────────────────────────────────────────
  const addTool = useCallback((toolId: ToolId) => {
    const alreadyAdded = fields.some((f) => f.toolId === toolId);
    if (alreadyAdded) return;
    const pricing = PRICING_DATA.find((t) => t.toolId === toolId);
    const defaultPlan = pricing?.tiers[1]?.planId ?? pricing?.tiers[0]?.planId ?? '';
    const defaultPrice = pricing?.tiers[1]?.pricePerSeat ?? 0;
    append({ toolId, plan: defaultPlan, monthlySpend: defaultPrice, seats: 1 });
  }, [fields, append]);

  // ── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (data: AuditFormValues) => {
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Audit failed');
      }

      const fullResult = await response.json();
      sessionStorage.setItem('spendlens_audit_result', JSON.stringify(fullResult));
      router.push('/audit/results');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to generate audit. Please try again.');
    }
  };

  const watchedTools = watch('tools');
  const addedToolIds = fields.map((f) => f.toolId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* ── Step 1: Global context ────────────────────────────────────────── */}
      <div className="form-section">
        <div className="form-section-header">
          <span className="step-badge">1</span>
          <div>
            <h2 className="form-section-title">Tell us about your team</h2>
            <p className="form-section-desc">Helps us give more accurate recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Team size */}
          <div className="field-group">
            <label className="field-label" htmlFor="teamSize">
              Team Size <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="teamSize"
                type="number"
                min={1}
                max={10000}
                className="input-field"
                placeholder="e.g. 12"
                {...register('teamSize', { valueAsNumber: true })}
              />
              <span className="input-suffix">people</span>
            </div>
            {errors.teamSize && <p className="field-error">{errors.teamSize.message}</p>}
          </div>

          {/* Use case */}
          <div className="field-group">
            <label className="field-label">
              Primary Use Case <span className="text-red-400">*</span>
            </label>
            <select
              className="input-field"
              {...register('useCase')}
            >
              {USE_CASES.map((uc) => (
                <option key={uc.value} value={uc.value}>{uc.label}</option>
              ))}
            </select>
            {errors.useCase && <p className="field-error">{errors.useCase.message}</p>}
          </div>
        </div>

        {/* Use case description */}
        {(() => {
          const selectedCase = USE_CASES.find((uc) => uc.value === watch('useCase'));
          return selectedCase ? (
            <p className="text-xs text-gray-500 mt-1 ml-1">{selectedCase.desc}</p>
          ) : null;
        })()}
      </div>

      {/* ── Step 2: Tool picker ───────────────────────────────────────────── */}
      <div className="form-section">
        <div className="form-section-header">
          <span className="step-badge">2</span>
          <div>
            <h2 className="form-section-title">Select your AI tools</h2>
            <p className="form-section-desc">Click to add tools your team uses</p>
          </div>
        </div>

        <div className="tool-picker-grid">
          {PRICING_DATA.map((tool) => {
            const isAdded = addedToolIds.includes(tool.toolId);
            return (
              <button
                key={tool.toolId}
                type="button"
                onClick={() => addTool(tool.toolId)}
                disabled={isAdded}
                className={`tool-picker-btn ${isAdded ? 'tool-picker-btn--added' : ''}`}
                id={`add-tool-${tool.toolId}`}
              >
                <span className="tool-picker-emoji">{tool.logoEmoji}</span>
                <span className="tool-picker-name">{tool.toolName}</span>
                {isAdded ? (
                  <span className="tool-picker-check">✓</span>
                ) : (
                  <span className="tool-picker-plus">+</span>
                )}
              </button>
            );
          })}
        </div>

        {errors.tools && typeof errors.tools.message === 'string' && (
          <p className="field-error mt-2">{errors.tools.message}</p>
        )}
      </div>

      {/* ── Step 3: Tool inputs ───────────────────────────────────────────── */}
      {fields.length > 0 && (
        <div className="form-section">
          <div className="form-section-header">
            <span className="step-badge">3</span>
            <div>
              <h2 className="form-section-title">Enter your spend details</h2>
              <p className="form-section-desc">Be as accurate as possible for better recommendations</p>
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const pricing = PRICING_DATA.find((t) => t.toolId === field.toolId)!;
              const watchedPlan = watchedTools[index]?.plan ?? '';
              const isUsagePlan = isUsageBased(field.toolId, watchedPlan);
              const selectedTier = pricing.tiers.find((t) => t.planId === watchedPlan);

              return (
                <div key={field.id} className="tool-input-card" id={`tool-card-${field.toolId}`}>
                  {/* Card header */}
                  <div className="tool-input-card-header">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pricing.logoEmoji}</span>
                      <div>
                        <h3 className="font-semibold text-white">{pricing.toolName}</h3>
                        {selectedTier?.notes && (
                          <p className="text-xs text-gray-500">{selectedTier.notes}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="remove-btn"
                      aria-label={`Remove ${pricing.toolName}`}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Card body */}
                  <div className="tool-input-card-body">
                    {/* Plan */}
                    <div className="field-group">
                      <label className="field-label" htmlFor={`tools.${index}.plan`}>Plan</label>
                      <select
                        id={`tools.${index}.plan`}
                        className="input-field"
                        {...register(`tools.${index}.plan`)}
                        onChange={(e) => {
                          setValue(`tools.${index}.plan`, e.target.value);
                          const tier = pricing.tiers.find((t) => t.planId === e.target.value);
                          if (tier && tier.pricePerSeat > 0) {
                            const seats = watchedTools[index]?.seats ?? 1;
                            setValue(`tools.${index}.monthlySpend`, tier.pricePerSeat * seats);
                          }
                        }}
                      >
                        {pricing.tiers.map((tier) => (
                          <option key={tier.planId} value={tier.planId}>
                            {tier.planLabel}{tier.pricePerSeat > 0 ? ` — $${tier.pricePerSeat}/seat` : ''}
                          </option>
                        ))}
                      </select>
                      {errors.tools?.[index]?.plan && (
                        <p className="field-error">{errors.tools[index]?.plan?.message}</p>
                      )}
                    </div>

                    {/* Monthly spend */}
                    <div className="field-group">
                      <label className="field-label" htmlFor={`tools.${index}.monthlySpend`}>
                        {isUsagePlan ? 'Monthly Spend' : 'Monthly Total'}
                      </label>
                      <div className="relative">
                        <span className="input-prefix">$</span>
                        <input
                          id={`tools.${index}.monthlySpend`}
                          type="number"
                          min={0}
                          step={0.01}
                          className="input-field input-field--prefixed"
                          placeholder="0.00"
                          {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                        />
                        <span className="input-suffix">/mo</span>
                      </div>
                      {errors.tools?.[index]?.monthlySpend && (
                        <p className="field-error">{errors.tools[index]?.monthlySpend?.message}</p>
                      )}
                    </div>

                    {/* Seats (hide for pure usage-based) */}
                    {!['anthropic-api', 'openai-api'].includes(field.toolId) && !isUsagePlan && (
                      <div className="field-group">
                        <label className="field-label" htmlFor={`tools.${index}.seats`}>
                          Seats / Users
                        </label>
                        <div className="relative">
                          <input
                            id={`tools.${index}.seats`}
                            type="number"
                            min={1}
                            className="input-field"
                            placeholder="1"
                            {...register(`tools.${index}.seats`, {
                              valueAsNumber: true,
                              onChange: (e) => {
                                const seats = parseInt(e.target.value) || 1;
                                const tier = pricing.tiers.find((t) => t.planId === watchedPlan);
                                if (tier && tier.pricePerSeat > 0) {
                                  setValue(`tools.${index}.monthlySpend`, tier.pricePerSeat * seats);
                                }
                              },
                            })}
                          />
                          <span className="input-suffix">seats</span>
                        </div>
                        {selectedTier?.minSeats && (
                          <p className="text-xs text-amber-500 mt-1">
                            ⚠ Min {selectedTier.minSeats} seats required for this plan
                          </p>
                        )}
                        {errors.tools?.[index]?.seats && (
                          <p className="field-error">{errors.tools[index]?.seats?.message}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      {fields.length > 0 && (
        <div className="submit-section">
          <div className="submit-summary">
            <span className="text-gray-400 text-sm">
              Auditing {fields.length} tool{fields.length > 1 ? 's' : ''} for{' '}
              {watch('teamSize')} people
            </span>
            <span className="text-gray-600 text-sm">·</span>
            <span className="text-gray-400 text-sm">
              Est. spend:{' '}
              <span className="text-white font-semibold">
                ${watchedTools.reduce((sum, t) => sum + (t?.monthlySpend || 0), 0).toLocaleString()}/mo
              </span>
            </span>
          </div>
          <button
            id="submit-audit"
            type="submit"
            disabled={isSubmitting}
            className="btn-primary btn-primary--lg w-full"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner" /> Running Audit...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Run My Audit <span>→</span>
              </span>
            )}
          </button>
          <p className="text-center text-xs text-gray-600 mt-2">
            Free · Instant results · No signup required
          </p>
        </div>
      )}
    </form>
  );
}
