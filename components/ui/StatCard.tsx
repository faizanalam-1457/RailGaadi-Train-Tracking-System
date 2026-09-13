import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('p-5 space-y-2 relative overflow-hidden', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{value}</div>
        {trend && (
          <span
            className={cn(
              'text-[10px] font-bold px-1.5 py-0.5 rounded',
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </Card>
  );
}
