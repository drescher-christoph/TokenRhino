// components/UI/Field.jsx
export function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-gray-300">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}