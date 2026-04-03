import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className={`form-group${className ? ` ${className}` : ''}`}>
      {label && <label className="form-label">{label}</label>}
      <input className="form-input" {...props} />
    </div>
  );
}
