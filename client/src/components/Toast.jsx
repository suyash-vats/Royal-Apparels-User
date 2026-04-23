import { useStore } from "../store";

export default function Toast() {
  const { ui } = useStore();

  return (
    <div className={`toast toast--${ui.toast.tone || "neutral"}`}>
      {ui.toast.message}
    </div>
  );
}
