import { useState, useCallback } from 'react';

interface Stop {
  name: string;
  highlight?: boolean;
}

interface DayData {
  day: number;
  date: string;
  city: string;
  emoji: string;
  stops: Stop[];
}

interface TravelTimelineProps {
  title?: string;
  days: DayData[];
}

const CITY_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  '大阪': { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444', dot: '#ef4444' },
  '京都': { bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.3)', text: '#a855f7', dot: '#a855f7' },
  '奈良': { bg: 'rgba(34, 197, 94, 0.08)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e', dot: '#22c55e' },
  '神户→香港': { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6', dot: '#3b82f6' },
};

const DEFAULT_COLOR = { bg: 'rgba(107, 114, 128, 0.08)', border: 'rgba(107, 114, 128, 0.3)', text: '#6b7280', dot: '#6b7280' };

export default function TravelTimeline({ title, days }: TravelTimelineProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const toggleDay = useCallback((day: number) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  }, []);

  const getColor = (city: string) => CITY_COLORS[city] ?? DEFAULT_COLOR;
  const cities = [...new Set(days.map((d) => d.city))];

  return (
    <div className="my-5 sm:my-8">
      {title && (
        <div className="text-[11px] sm:text-caption uppercase tracking-wider text-muted mb-3 sm:mb-4 font-semibold">
          {title}
        </div>
      )}

      {/* City legend */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg sm:rounded-xl">
        {cities.map((city) => {
          const color = getColor(city);
          return (
            <div key={city} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                style={{ background: color.dot }}
              />
              <span className="text-[11px] sm:text-sm text-secondary">{city}</span>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line — position adapts to dot size */}
        <div className="timeline-line absolute top-6 bottom-6 w-px bg-[var(--color-border)] hidden sm:block" />

        <div className="flex flex-col gap-0.5 sm:gap-1">
          {days.map((day) => {
            const color = getColor(day.city);
            const isExpanded = expandedDay === day.day;
            const isHovered = hoveredDay === day.day;

            return (
              <div key={day.day} className="relative">
                {/* Day card */}
                <button
                  onClick={() => toggleDay(day.day)}
                  onMouseEnter={() => setHoveredDay(day.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className="flex items-center gap-3 sm:gap-4 w-full py-3 sm:py-4 pr-2 sm:pr-4 bg-transparent border-none cursor-pointer text-left rounded-lg transition-colors tap-highlight-none"
                  style={{ background: 'transparent' }}
                  aria-expanded={isExpanded}
                >
                  {/* Timeline dot */}
                  <div
                    className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border-2"
                    style={{
                      background: isExpanded || isHovered ? color.dot : 'var(--color-bg)',
                      borderColor: color.dot,
                    }}
                  >
                    {isExpanded || isHovered ? (
                      <span className="text-base sm:text-xl leading-none">{day.emoji}</span>
                    ) : (
                      <span
                        className="text-[11px] sm:text-xs font-bold leading-none"
                        style={{ color: color.dot }}
                      >
                        {day.day}
                      </span>
                    )}
                  </div>

                  {/* Day info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-primary leading-tight">
                        Day {day.day}
                      </span>
                      <span className="text-[11px] sm:text-xs text-muted">
                        {day.date}
                      </span>
                      <span
                        className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border"
                        style={{
                          background: color.bg,
                          borderColor: color.border,
                          color: color.text,
                        }}
                      >
                        {day.city}
                      </span>
                    </div>
                    {/* Preview stops (when collapsed) */}
                    {!isExpanded && (
                      <div className="text-[11px] sm:text-xs text-muted mt-1 leading-snug">
                        {day.stops.map((s) => s.name).join(' → ')}
                      </div>
                    )}
                  </div>

                  {/* Expand arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-200"
                    style={{
                      color: 'var(--color-muted)',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Expanded stops */}
                {isExpanded && (
                  <div
                    className="ml-10 sm:ml-14 mb-2 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all"
                    style={{
                      background: color.bg,
                      borderColor: color.border,
                      animation: 'timelineSlideIn 0.2s ease-out',
                    }}
                  >
                    <div className="flex flex-col gap-2 sm:gap-3">
                      {day.stops.map((stop, idx) => (
                        <div key={idx} className="flex items-center gap-2 sm:gap-3">
                          {/* Stop dot */}
                          <div
                            className="rounded-full border-2 flex-shrink-0"
                            style={{
                              width: stop.highlight ? '10px' : '8px',
                              height: stop.highlight ? '10px' : '8px',
                              background: stop.highlight ? color.dot : 'transparent',
                              borderColor: color.dot,
                            }}
                          />

                          {/* Stop name */}
                          <span className="text-xs sm:text-sm leading-snug" style={{
                            fontWeight: stop.highlight ? 600 : 400,
                            color: stop.highlight ? 'var(--color-primary)' : 'var(--color-secondary)',
                          }}>
                            {stop.name}
                            {stop.highlight && (
                              <span className="ml-1.5 text-[10px] sm:text-xs" style={{ color: color.text }}>
                                ★
                              </span>
                            )}
                          </span>

                          {/* Arrow to next */}
                          {idx < day.stops.length - 1 && (
                            <span className="ml-auto text-[10px] sm:text-xs text-muted flex-shrink-0">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes timelineSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
