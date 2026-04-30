export default function StatusBadge({ status }: { status: string }) {
  const cls = {
    "Submitted": "badge-submitted",
    "In Progress": "badge-progress",
    "Vendor Chosen": "badge-vendor",
    "Completed": "badge-completed",
    "Closed": "badge-closed",
  }[status] || "badge-submitted";
  return <span className={`badge ${cls}`}>{status}</span>;
}
