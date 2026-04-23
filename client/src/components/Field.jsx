export default function Field({ label, value, onChange, type = "text", readOnly = false }) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
}
