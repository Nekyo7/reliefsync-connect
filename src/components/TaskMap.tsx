import { useEffect, useRef } from "react";
import type { ReliefTask } from "@/types";
import { getCoords } from "@/utils/mapUtils";

interface TaskMapProps {
  tasks: ReliefTask[];
}

export function TaskMap({ tasks }: TaskMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  useEffect(() => {
    let isDisposed = false;

    const loadMap = async () => {
      if (!mapRef.current) {
        return;
      }

      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (isDisposed || !mapRef.current) {
        return;
      }

      if (!mapInstanceRef.current) {
        const map = L.default.map(mapRef.current, {
          center: [12.9716, 77.5946],
          zoom: 11,
        });

        L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        mapInstanceRef.current = map;
        layerGroupRef.current = L.default.layerGroup().addTo(map);
      }

      const map = mapInstanceRef.current;
      const layerGroup = layerGroupRef.current;

      layerGroup.clearLayers();

      if (!tasks.length) {
        map.setView([12.9716, 77.5946], 11);
        return;
      }

      const bounds: [number, number][] = [];
      const urgencyColors: Record<string, string> = {
        CRITICAL: "#ef4444",
        HIGH: "#f97316",
        MEDIUM: "#eab308",
        LOW: "#22c55e",
      };

      tasks.forEach((task) => {
        const [lat, lng] = getCoords(task);
        bounds.push([lat, lng]);

        const color = urgencyColors[task.urgency_level] || "#64748b";
        const marker = L.default.circleMarker([lat, lng], {
          radius: task.urgency_level === "CRITICAL" ? 10 : 7,
          fillColor: color,
          color,
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.45,
        });

        marker.bindPopup(`
          <div style="min-width: 200px">
            <strong>${task.title}</strong><br/>
            <small>${task.location}</small><br/>
            <span style="color:${color};font-weight:bold">${task.urgency_level}</span>
            <span> · Score: ${task.priority_score.toFixed(1)}</span><br/>
            <small>${task.category}</small>
          </div>
        `);

        marker.addTo(layerGroup);
      });

      if (bounds.length === 1) {
        map.setView(bounds[0], 12);
      } else {
        map.fitBounds(bounds, { padding: [24, 24] });
      }
    };

    void loadMap();

    return () => {
      isDisposed = true;
    };
  }, [tasks]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="relative z-0 mb-5 h-[400px] w-full overflow-hidden rounded-xl border shadow-[var(--card-shadow)]"
    />
  );
}
