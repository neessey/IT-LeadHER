const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    approved: "bg-green-100 text-green-700",
    contacted: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
  };

  const labels = {
    approved: "✓ Validé",
    contacted: "💬 Contacté",
    pending: "🆕 Nouveau",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status as keyof typeof styles] || styles.pending
      }`}
    >
      {labels[status as keyof typeof labels] || labels.pending}
    </span>
  );
};