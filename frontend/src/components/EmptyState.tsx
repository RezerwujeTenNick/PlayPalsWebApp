// components/EmptyState.tsx
export const EmptyState = ({ icon, message, submessage }: { icon: string, message: string, submessage: string }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
    <p className="text-3xl mb-2">{icon}</p>
    <p className="font-medium text-slate-600">{message}</p>
    <p className="text-sm">{submessage}</p>
  </div>
);