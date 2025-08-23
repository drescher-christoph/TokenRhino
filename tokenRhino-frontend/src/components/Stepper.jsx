import React from "react";

/**
 * props:
 * - steps: string[]                // ["Token", "Presale", "Review"]
 * - current: number                // 0-basiert: 0,1,2...
 * - onStepClick?: (i:number)=>void // optional: klickbar machen
 */
export default function Stepper({ steps = [], current = 0, onStepClick }) {
  return (
    <div className="w-full">
      {/* Top: Labels + Dots/Numbers */}
      <ol className="relative flex items-center justify-between gap-3">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex-1 flex items-center">
              {/* Linke Linie (verbinder) – nicht für erstes Element */}
              {i !== 0 && (
                <div
                  className={`h-1 w-full rounded-full mx-3 ${
                    done ? "bg-[#00E3A5]" : "bg-[#23272F]"
                  }`}
                />
              )}

              {/* Dot/Number */}
              <button
                type="button"
                onClick={onStepClick ? () => onStepClick(i) : undefined}
                className={`flex items-center justify-center shrink-0
                  w-9 h-9 rounded-full border transition-colors
                  ${
                    active
                      ? "bg-[#00E3A5] text-black border-[#00E3A5]"
                      : done
                      ? "bg-[#0F2E23] text-[#00E3A5] border-[#00E3A5]"
                      : "bg-[#151821] text-gray-400 border-[#23272F]"
                  }
                  ${onStepClick ? "cursor-pointer hover:opacity-90" : "cursor-default"}
                `}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${label}`}
              >
                {done ? "✓" : i + 1}
              </button>

              {/* Label */}
              <div className="ml-3 mr-1 min-w-[60px]">
                <div
                  className={`text-sm font-medium ${
                    active ? "text-white" : done ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {label}
                </div>
                {active && (
                  <div className="text-xs text-[#9CA3AF]">current</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Bottom: dünner Progress-Balken als dezentem Akzent */}
      <div className="mt-4 h-1.5 w-full bg-[#1A1D24] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00E3A5] transition-all duration-300"
          style={{
            width: `${(Math.max(0, Math.min(current, steps.length - 1)) / (steps.length - 1 || 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}