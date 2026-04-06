export const Card = ({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-[var(--card)] p-6 rounded-[24px] shadow-sm border border-[var(--border)] transition-colors ${className}`}
  >
    {title && (
      <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-sm mb-4 uppercase tracking-wider">
        {title}
      </h3>
    )}
    {children}
  </div>
);
