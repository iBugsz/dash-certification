import React from 'react';

interface BaseCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footerLeft: React.ReactNode;
  footerRight: React.ReactNode;
}

export function BaseCard({ header, children, footerLeft, footerRight }: BaseCardProps) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md">
      {/* Cuerpo */}
      <div className="flex-1 p-4 flex flex-col gap-4"> {/* Añadimos gap-4 para separar header de los badges */}
        {header}
        <div>{children}</div> {/* Eliminamos mt-auto y pt-4 */}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 mt-auto"> {/* El mt-auto aquí empuja el footer al final */}
        <div className="text-[11px] text-slate-400">{footerLeft}</div>
        <div className="flex items-center gap-0.5">{footerRight}</div>
      </div>
    </div>
  );
}
// Sub-componente auxiliar (se mantiene aquí para reutilizarlo en cualquier tarjeta)
export function IconButton({ icon: Icon, onClick, title, color = "text-slate-400" }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`cursor-pointer w-7 h-7 flex items-center justify-center rounded-lg ${color} hover:bg-slate-100 dark:hover:bg-slate-800 transition-all`} 
      title={title}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}