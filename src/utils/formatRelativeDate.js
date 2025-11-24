export function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  // Normalisasi jam
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // const options = { day: "2-digit", month: "short", year: "numeric" };
    return "";
  }

  // 0 hari
  if (diffDays === 0) return "Hari ini";

  // Hari (1 - 7)
  if (diffDays <= 7) {
    return diffDays === 1 ? "1 hari lalu" : `${diffDays} hari lalu`;
  }

  // Minggu (8 - 28 hari) → max 4 minggu
  const weeks = Math.floor(diffDays / 7);
  if (weeks <= 4) {
    return weeks === 1 ? "1 minggu lalu" : `${weeks} minggu lalu`;
  }

  // Bulan (29 hari - 12 bulan)
  const months = Math.floor(diffDays / 30);
  if (months <= 12) {
    return months === 1 ? "1 bulan lalu" : `${months} bulan lalu`;
  }

  // Tahun (lebih dari 12 bulan)
  const years = Math.floor(months / 12);
  return years === 1 ? "1 tahun lalu" : `${years} tahun lalu`;
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(timeString) {
  const date = new Date(`2000-01-01T${timeString}`); // dummy date biar bisa diparse
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
