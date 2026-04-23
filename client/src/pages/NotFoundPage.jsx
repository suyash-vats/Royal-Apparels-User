import EmptyState from "../components/EmptyState";

export default function NotFoundPage() {
  return (
    <section className="section">
      <EmptyState
        title="That page slipped out of the rack"
        body="Try heading back to the homepage or open the shop to keep browsing."
        actionLabel="Go home"
        actionTo="/"
      />
    </section>
  );
}
