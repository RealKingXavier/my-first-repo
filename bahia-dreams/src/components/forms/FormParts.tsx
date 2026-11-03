"use client";

import type { ReactNode } from "react";

export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ml-2 font-normal normal-case tracking-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  return [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
}

export function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  columns = 2,
  optional,
}: {
  name: string;
  legend: string;
  options: Record<T, string>;
  value: T | undefined;
  onChange: (v: T) => void;
  error?: string;
  columns?: 1 | 2 | 4;
  optional?: boolean;
}) {
  const cols = columns === 4 ? "sm:grid-cols-4" : columns === 2 ? "sm:grid-cols-2" : "";
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined} aria-invalid={error ? true : undefined}>
      <legend className="field-label">
        {legend}
        {optional && <span className="ml-2 font-normal normal-case tracking-normal text-muted">(optional)</span>}
      </legend>
      <div className={`grid gap-3 ${cols}`}>
        {(Object.entries(options) as [T, string][]).map(([v, l]) => (
          <label key={v} className="choice">
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
            <span>{l}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

// Off-screen field that people never see but naive bots fill in.
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
