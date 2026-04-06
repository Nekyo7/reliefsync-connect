import { useEffect, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { getCoords } from "@/utils/mapUtils";

const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const { tasks, initializeMockData } = useTaskStore();

  useEffect(() => { initializeMockData(); }, [initializeMockData]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const loadMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      const map = L.default.map(mapRef.current!, { center: [5, 20], zoom: 3 });
      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const urgencyColors: Record<string, string> = {
        CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e',
      };

      tasks.forEach((task) => {
        const [lat, lng] = getCoords(task);
        const color = urgencyColors[task.urgency_level] || '#666';
        const marker = L.default.circleMarker([lat, lng], {
          radius: task.urgency_level === 'CRITICAL' ? 10 : 7,
          fillColor: color, color: color, weight: 2, opacity: 0.8, fillOpacity: 0.5,
        }).addTo(map);
        marker.bindPopup(`
          <div style="min-width:200px">
            <strong>${task.title}</strong><br/>
            <small>${task.location}</small><br/>
            <span style="color:${color};font-weight:bold">${task.urgency_level}</span> · Score: ${task.priority_score}<br/>
            <small>${task.category}</small>
          </div>
        `);
      });

      mapInstanceRef.current = map;
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Map View</h1>
        <p className="text-muted-foreground mb-6">Geographic view of all active relief tasks</p>
        <div className="flex gap-4 mb-4 flex-wrap">
          {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
            <UrgencyBadge key={level} level={level} />
          ))}
        </div>
      </div>
      <div ref={mapRef} className="w-full h-[calc(100vh-220px)] border-t" />
    </div>
  );
};

export default MapView;
