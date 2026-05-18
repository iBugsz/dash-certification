// src/lib/cad-utils.ts

export function getBounds(entities: any[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  const expand = (x: number, y: number) => {
    if (!isFinite(x) || !isFinite(y)) return;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };

  entities.forEach((e) => {
    const d = e.data;
    if (e.type === "LINE") {
      expand(d[10], d[20]);
      expand(d[11], d[21]);
    } else if (e.type === "CIRCLE" || e.type === "ARC") {
      expand(d[10] - d[40], d[20] - d[40]);
      expand(d[10] + d[40], d[20] + d[40]);
    }
  });

  if (!isFinite(minX))
    return { min: { x: -10, y: -10 }, max: { x: 10, y: 10 } };
  return { min: { x: minX, y: minY }, max: { x: maxX, y: maxY } };
}

export function generateSVGString(
  entities: any[],
  width: number,
  height: number,
): string {
  if (!entities || entities.length === 0) return "";

  const { min, max } = getBounds(entities);
  const dw = max.x - min.x || 1;
  const dh = max.y - min.y || 1;
  const padding = 0.8;
  const scale = Math.min((width * padding) / dw, (height * padding) / dh);

  const offsetX = width / 2 - ((min.x + max.x) / 2) * scale;
  const offsetY = height / 2 + ((min.y + max.y) / 2) * scale;

  let paths = "";
  entities.forEach((e) => {
    const d = e.data;
    if (e.type === "LINE") {
      paths += `<line x1="${d[10] * scale + offsetX}" y1="${-d[20] * scale + offsetY}" x2="${d[11] * scale + offsetX}" y2="${-d[21] * scale + offsetY}" stroke="#00d4ff" stroke-width="1.5" />`;
    } else if (e.type === "CIRCLE") {
      paths += `<circle cx="${d[10] * scale + offsetX}" cy="${-d[20] * scale + offsetY}" r="${d[40] * scale}" fill="none" stroke="#00d4ff" stroke-width="1.5" />`;
    }
  });

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#0d1117">${paths}</svg>`;
}
