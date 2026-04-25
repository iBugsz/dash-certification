export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function pct(used: number, limit: number): number {
  const percent = Math.min((used / limit) * 100, 100);
  return percent < 1 ? Math.round(percent * 10) / 10 : Math.round(percent);
}