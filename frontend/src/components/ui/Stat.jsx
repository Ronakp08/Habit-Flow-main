export function Stat({ label, value }) {
  return (
    <div className="panel stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
