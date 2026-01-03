import { ReactNode } from "react";
import { cn } from "../../utils/cn";

type CardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
};

export const Card = ({ title, description, children, className, actions }: CardProps) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white p-4 shadow-sm", className)}>
    {(title || actions) && (
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
        {actions}
      </div>
    )}
    {children}
  </div>
);
