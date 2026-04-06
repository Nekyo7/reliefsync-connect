import type { ReliefTask } from "@/types";

export const locationMap: Record<string, [number, number]> = {
  "Whitefield": [12.9698, 77.75],
  "Indiranagar": [12.9784, 77.6408],
  "MG Road": [12.9756, 77.605],
  "Electronic City": [12.8456, 77.6603],
  "Bangalore": [12.9716, 77.5946],
  "Koramangala": [12.9279, 77.6271],
  "Jayanagar": [12.9299, 77.5826],
  "Bengaluru": [12.9716, 77.5946],
};

export const getCoords = (task: ReliefTask): [number, number] => {
  // Simple hash for deterministic jitter based on task id to prevent exact overlapping
  let hash = 0;
  for (let i = 0; i < task.id.length; i++) {
    hash = task.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const jitterX = ((Math.abs(hash) % 100) / 100 - 0.5) * 0.015;
  const jitterY = (((Math.abs(hash) >> 2) % 100) / 100 - 0.5) * 0.015;

  if (task.lat !== undefined && task.lng !== undefined) {
    if (Number.isFinite(task.lat) && Number.isFinite(task.lng)) {
      return [task.lat + jitterX, task.lng + jitterY];
    }
  }
  
  for (const [key, coords] of Object.entries(locationMap)) {
    if (task.location.toLowerCase().includes(key.toLowerCase())) {
      return [coords[0] + jitterX, coords[1] + jitterY];
    }
  }

  // Fallback to center with jitter so they don't exactly overlap
  return [12.9716 + jitterX, 77.5946 + jitterY];
};
