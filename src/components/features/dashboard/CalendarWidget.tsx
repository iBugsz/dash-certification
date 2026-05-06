"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameYear,
  isSameDay,
} from "date-fns";
import {
  MoreVertical,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function CalendarWidget() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [view, setView] = React.useState<"month" | "week">("month");
  const [weekBase, setWeekBase] = React.useState<Date>(new Date());

  const handleSelectDate = (d: Date | undefined) => {
    setDate(d);
    if (d) setWeekBase(d);
  };

  const currentWeek = {
    start: startOfWeek(weekBase, { weekStartsOn: 1 }),
    end: endOfWeek(weekBase, { weekStartsOn: 1 }),
  };

  const weekLabel = (() => {
    const s = currentWeek.start;
    const e = currentWeek.end;
    const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    if (isSameMonth(s, e))
      return cap(
        s.toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
      );
    if (isSameYear(s, e))
      return `${cap(s.toLocaleDateString("es-ES", { month: "long" }))} - ${cap(e.toLocaleDateString("es-ES", { month: "long", year: "numeric" }))}`;
    return `${cap(s.toLocaleDateString("es-ES", { month: "short", year: "numeric" }))} - ${cap(e.toLocaleDateString("es-ES", { month: "short", year: "numeric" }))}`;
  })();

  const events = [
    {
      id: 1,
      title: "Main Weekly Meeting",
      time: "9:00 am - 10:30 am",
      color: "#8633FF",
    },
    {
      id: 2,
      title: "Vehicle Cert Review",
      time: "2:00 pm - 3:30 pm",
      color: "#3b82f6",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111113] border-[length:var(--border-width)] border-[var(--border)] rounded-[24px] p-6 shadow-sm flex flex-col font-poppins h-fit transition-all duration-300 w-full max-w-[400px] mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-[#8633FF] flex items-center gap-2">
          <div className="p-2 bg-violet-100 dark:bg-violet-500/10 rounded-lg">
            <CalendarIcon size={16} className="text-[#8633FF]" />
          </div>
          Calendario
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex cursor-pointer items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400">
              <MoreVertical size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl min-w-[160px] "
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setView("month")}
            >
              Vista Mensual{" "}
              {view === "month" && (
                <Check size={14} className="ml-auto text-[#8633FF]" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setView("week")}
            >
              Vista Semanal{" "}
              {view === "week" && (
                <Check size={14} className="ml-auto text-[#8633FF]" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full relative">
        {view === "week" ? (
          <div>
            {/* NAVEGACIÓN SEMANAL */}
            <div className="relative flex justify-center items-center h-10 mb-2 w-full">
              <button
                onClick={() => setWeekBase(subWeeks(weekBase, 1))}
                className="absolute cursor-pointer left-0 h-7 w-7 flex items-center justify-center opacity-60 hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {weekLabel}
              </span>
              <button
                onClick={() => setWeekBase(addWeeks(weekBase, 1))}
                className="absolute cursor-pointer right-0 h-7 w-7 flex items-center justify-center opacity-60 hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* DÍAS SEMANA */}
            <div className="flex justify-center gap-1">
              {["lu", "ma", "mi", "ju", "vi", "sá", "do"].map((d) => (
                <div
                  key={d}
                  className="text-slate-400 w-10 font-medium text-[12px] capitalize text-center"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* GRILLA SEMANAL */}
            <div className="flex justify-center gap-1 mt-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const day = new Date(currentWeek.start);
                day.setDate(currentWeek.start.getDate() + i);
                const isSelected = date && isSameDay(day, date);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectDate(new Date(day))}
                    className={cn(
                      "cal-day",
                      isToday && !isSelected && "cal-day--today",
                      isSelected && "cal-day--selected",
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
            locale={es}
            weekStartsOn={1}
            className="p-0 w-full bg-transparent"
            classNames={{
              months: "w-full",
              month: "w-full space-y-4",
              caption:
                "relative flex justify-center items-center h-10 mb-2 w-full",
              caption_label:
                "text-sm font-bold text-slate-900 dark:text-white capitalize",
              nav: "absolute w-full flex justify-between items-center z-10",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100",
              nav_button_previous: "absolute left-0",
              nav_button_next: "absolute right-0",
              table: "w-full border-collapse",
              head_row: "flex justify-center gap-1",
              head_cell:
                "text-slate-400 w-10 font-medium text-[12px] capitalize text-center",
              row: "flex justify-center gap-1 mt-2",
              cell: "h-10 w-10 p-0 relative flex items-center justify-center",
              day: "relative flex items-center justify-center p-0",
              day_outside: "opacity-30",
            }}
            components={{
              DayButton: ({ className, day, modifiers, ...props }) => {
                const isSelected = date && isSameDay(day.date, date);
                const isToday = isSameDay(day.date, new Date());
                return (
                  <button
                    {...props}
                    className={cn(
                      "cal-day",
                      isToday && !isSelected && "cal-day--today",
                      isSelected && "cal-day--selected",
                    )}
                  />
                );
              },
            }}
          />
        )}
      </div>

      {/* EVENTOS */}
      <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5 mt-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div
              className="w-1 h-8 rounded-full shrink-0 transition-all"
              style={{ backgroundColor: event.color }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#8633FF] transition-colors">
                {event.title}
              </h4>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={11} />
                <span className="text-[11px] font-medium">{event.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
