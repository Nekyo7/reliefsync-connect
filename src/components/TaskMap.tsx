import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ReliefTask } from "@/types";
import { getCoords } from "@/utils/mapUtils";

// Fix Leaflet's default icon missing issue in Vite
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});


interface TaskMapProps {
  tasks: ReliefTask[];
}

export function TaskMap({ tasks }: TaskMapProps) {
  return (
    <div className="overflow-hidden rounded-xl border z-0 relative shadow-[var(--card-shadow)]" style={{ height: "400px", width: "100%", marginBottom: "20px" }}>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={11}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {tasks.map((task) => {
          const position = getCoords(task);

          return (
            <Marker key={task.id} position={position}>
              <Popup>
                <div className="flex flex-col gap-1 min-w-[200px]">
                  <strong className="text-sm font-heading">{task.title}</strong>
                  <span className="text-xs text-muted-foreground"><strong className="text-foreground">Location:</strong> {task.location}</span>
                  <span className={`w-fit mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${task.urgency_level === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {task.urgency_level}
                  </span>
                  {task.status === "OPEN" ? (
                    <span className="text-xs font-semibold text-green-600 mt-1">Status: Unassigned</span>
                  ) : (
                    <span className="text-xs font-semibold text-primary mt-1">Status: Assigned</span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
