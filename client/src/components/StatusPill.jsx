export default function StatusPill({ value }) {
  return <span className={`status-pill status-pill--${value}`}>{value}</span>;
}
