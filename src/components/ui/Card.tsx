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
    className={`bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 ${className}`}
  >
    {title && (
      <h3 className="text-slate-500 font-semibold text-sm mb-4 uppercase tracking-wider">
        {title}
      </h3>
    )}
    {children}
  </div>
);
