"use client";

import { Frown, Meh, Smile, SmilePlus, Sparkles } from "lucide-react";

function getIcon(value: number) {
  if (value < 20) return <Frown size={48} className="text-rose-600" />;
  if (value < 40) return <Meh size={48} className="text-amber-600" />;
  if (value < 60) return <Smile size={48} className="text-slate-600" />;
  if (value < 80) return <SmilePlus size={48} className="text-blue-600" />;
  return <Sparkles size={48} className="text-emerald-600" />;
}

function getLabel(value: number) {
  if (value < 30) return "Learning letters and basic reading";
  if (value < 70) return "Can read but slowly with pauses";
  return "Fluent, smooth recitation with tajweed";
}

export function StepFluency({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        How fluent is your Quran reading?
      </h2>
      <p className="mt-2 text-slate-600">Rate your reading fluency.</p>

      <div className="glass mt-10 rounded-2xl p-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center">{getIcon(value)}</div>
          <div className="mt-3 text-2xl font-semibold text-slate-900">{value}%</div>
          <p className="mt-1 text-sm text-slate-600">{getLabel(value)}</p>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-teal-700"
        />
        <div className="mt-3 flex justify-between text-xs text-slate-600">
          <span>Beginner</span>
          <span>Fluent</span>
        </div>
      </div>
    </div>
  );
}
