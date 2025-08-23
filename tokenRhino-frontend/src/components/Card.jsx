// components/UI/Card.jsx
export default function Card({ title, children, footer, className = "" }) {
  return (
    <section className={`bg-[#0C0E13] border border-[#23272F] rounded-2xl p-5 shadow-md ${className}`}>
      {title && <h3 className="text-white text-lg font-semibold mb-4">{title}</h3>}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-[#23272F]">{footer}</div>}
    </section>
  );
}