export function Section({
  icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[var(--card)] p-6 md:p-8 rounded-[24px] border border-[var(--border)] transition-colors">
      <div className="flex items-center gap-3 mb-7">
        <div className={`p-2 rounded-xl ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
