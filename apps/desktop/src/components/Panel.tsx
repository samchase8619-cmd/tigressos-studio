import type { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <div className={`panel${className ? ` ${className}` : ''}`}>
      {title && <div className="panel-title">{title}</div>}
      {children}
    </div>
  );
}
