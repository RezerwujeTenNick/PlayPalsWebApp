// components/SectionHeader.tsx
export const SectionHeader = ({ title, onAction, actionLabel, showAction }: any) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    {showAction && (
      <button
        onClick={onAction}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);