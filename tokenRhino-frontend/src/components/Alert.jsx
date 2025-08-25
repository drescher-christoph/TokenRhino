// src/components/UI/Alert.jsx
export default function Alert({ kind = "info", children }) {
  const styles = {
    info:   "bg-[#0E1A2B] border-[#1f2e43] text-[#B6C9FF]",
    warn:   "bg-[#2A240B] border-[#3A2F0D] text-[#FFB020]",
    error:  "bg-[#3B0B17] border-[#5A0F1F] text-[#FF4E6D]",
    success:"bg-[#0F2E23] border-[#1C4D3B] text-[#00E3A5]",
  }[kind];
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}