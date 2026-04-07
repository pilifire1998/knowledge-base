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

  // City legend
  const cities = [...new Set(days.map((d) => d.city))];

  return (
    <div style={{ margin: '2rem 0' }}>
      {title && (
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-muted)',
          marginBottom: '1rem',
        }}>
          {title}
        </div>
      )}

      {/* City legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '1.5rem',
        padding: '12px 16px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
      }}>
        {cities.map((city) => {
          const color = getColor(city);
          return (
            <div key={city} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: color.dot,
              }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>{city}</span>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '19px',
          top: '24px',
          bottom: '24px',
          width: '2px',
          background: 'var(--color-border)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {days.map((day) => {
            const color = getColor(day.city);
            const isExpanded = expandedDay === day.day;
            const isHovered = hoveredDay === day.day;

            return (
              <div key={day.day} style={{ position: 'relative' }}>
                {/* Day card */}
                <button
                  onClick={() => toggleDay(day.day)}
                  onMouseEnter={() => setHoveredDay(day.day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    padding: '12px 16px 12px 0',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRadius: '8px',
                    transition: 'background 0.15s',
                  }}
                  aria-expanded={isExpanded}
                >
                  {/* Timeline dot */}
                  <div style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isExpanded || isHovered ? color.dot : 'var(--color-bg)',
                    border: `2px solid ${color.dot}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    fontSize: '1rem',
                  }}>
                    {isExpanded || isHovered ? (
                      <span style={{ fontSize: '0.95rem' }}>{day.emoji}</span>
                    ) : (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: color.dot,
                      }}>
                        {day.day}
                      </span>
                    )}
                  </div>

                  {/* Day info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                      }}>
                        Day {day.day}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-muted)',
                      }}>
                        {day.date}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: color.bg,
                        border: `1px solid ${color.border}`,
                        color: color.text,
                      }}>
                        {day.city}
                      </span>
                    </div>
                    {/* Preview stops (when collapsed) */}
                    {!isExpanded && (
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-muted)',
                        marginTop: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {day.stops.map((s) => s.name).join(' → ')}
                      </div>
                    )}
                  </div>

                  {/* Expand arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      color: 'var(--color-muted)',
                      flexShrink: 0,
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Expanded stops */}
                {isExpanded && (
                  <div style={{
                    marginLeft: '56px',
                    marginBottom: '8px',
                    padding: '12px 16px',
                    background: color.bg,
                    border: `1px solid ${color.border}`,
                    borderRadius: '8px',
                    animation: 'timelineSlideIn 0.2s ease-out',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {day.stops.map((stop, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}>
                          {/* Stop connector */}
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                          }}>
                            <div style={{
                              width: stop.highlight ? '10px' : '7px',
                              height: stop.highlight ? '10px' : '7px',
                              borderRadius: '50%',
                              background: stop.highlight ? color.dot : 'transparent',
                              border: `2px solid ${color.dot}`,
                              flexShrink: 0,
                            }} />
                          </div>

                          {/* Stop name */}
                          <span style={{
                            fontSize: '0.85rem',
                            fontWeight: stop.highlight ? 600 : 400,
                            color: stop.highlight ? 'var(--color-primary)' : 'var(--color-secondary)',
                          }}>
                            {stop.name}
                            {stop.highlight && (
                              <span style={{
                                marginLeft: '6px',
                                fontSize: '0.7rem',
                                color: color.text,
                              }}>
                                ★
                              </span>
                            )}
                          </span>

                          {/* Connector line to next */}
                          {idx < day.stops.length - 1 && (
                            <span style={{
                              fontSize: '0.7rem',
                              color: 'var(--color-muted)',
                              marginLeft: 'auto',
                            }}>
                              →
                            </span>
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
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
