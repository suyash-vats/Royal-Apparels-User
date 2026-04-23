import { Link } from "react-router-dom";

export default function EmptyState({ title, body, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{body}</p>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="button button--primary">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
