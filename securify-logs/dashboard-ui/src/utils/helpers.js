export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

export const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

export const getSeverityColor = (severity) => {
  const colors = {
    critical: "danger",
    high: "danger",
    medium: "warning",
    low: "info",
    info: "info",
  };
  return colors[severity] || "info";
};

export const getStatusBadge = (status) => {
  const badges = {
    completed: "success",
    running: "warning",
    pending: "info",
    failed: "danger",
  };
  return badges[status] || "info";
};
