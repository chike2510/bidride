"use client";

import { useEffect, useRef, useState } from "react";
import { FUPRE_CAMPUS, FUPRE_PLACES } from "@/lib/campus";
import { cn } from "@/lib/utils";

type MapPoint = { latitude: number; longitude: number };

type FupreLeafletMapProps = {
  pickup?: MapPoint;
  destination?: MapPoint;
  driver?: MapPoint;
  followDriver?: boolean;
  className?: string;
};

function pointToLatLng(point: MapPoint) {
  return [point.latitude, point.longitude] as [number, number];
}

function markerIcon(L: any, color: string, label: string) {
  return L.divIcon({
    className: "bidride-map-marker",
    html: `<span style="background:${color}" aria-label="${label}"></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function FupreLeafletMap({
  pickup,
  destination,
  driver,
  followDriver = false,
  className,
}: FupreLeafletMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<{ road: any; satellite: any }>({ road: null, satellite: null });
  const markersRef = useRef<any[]>([]);
  const routeRef = useRef<any>(null);
  const [view, setView] = useState<"road" | "satellite">("road");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    import("leaflet")
      .then(({ default: L }) => {
        if (cancelled || !mapElement.current || mapRef.current) return;

        const map = L.map(mapElement.current, {
          center: [FUPRE_CAMPUS.centerLat, FUPRE_CAMPUS.centerLng],
          zoom: 16,
          zoomControl: false,
          attributionControl: true,
        });

        const road = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        });
        const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 19,
          attribution: 'Tiles &copy; Esri',
        });

        road.addTo(map);
        L.control.zoom({ position: "bottomright" }).addTo(map);
        mapRef.current = map;
        layersRef.current = { road, satellite };
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setMessage("The map could not load. Check your internet connection and try again.");
        }
      });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    const selected = layersRef.current[view];
    const other = layersRef.current[view === "road" ? "satellite" : "road"];
    if (other && map.hasLayer(other)) map.removeLayer(other);
    if (selected && !map.hasLayer(selected)) selected.addTo(map);
  }, [status, view]);

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then(({ default: L }) => {
      const map = mapRef.current;
      if (!map || cancelled || status !== "ready") return;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      if (routeRef.current) {
        routeRef.current.remove();
        routeRef.current = null;
      }

      const addMarker = (point: MapPoint, color: string, label: string, popup?: string) => {
        const marker = L.marker(pointToLatLng(point), { icon: markerIcon(L, color, label), title: label });
        if (popup) marker.bindPopup(popup);
        marker.addTo(map);
        markersRef.current.push(marker);
        return marker;
      };

      FUPRE_PLACES.forEach((place) => addMarker(
        { latitude: place.latitude, longitude: place.longitude },
        "#10213f",
        place.name,
        `<strong>${place.name}</strong><br /><span>FUPRE campus landmark</span>`
      ));

      if (pickup) addMarker(pickup, "#1f9d63", "Pickup location", "<strong>Pickup location</strong>");
      if (destination) addMarker(destination, "#e95757", "Destination", "<strong>Destination</strong>");
      if (driver) {
        const driverMarker = addMarker(driver, "#e7a800", "Driver location", "<strong>Driver location</strong>");
        if (followDriver) map.panTo(pointToLatLng(driver));
        driverMarker.openPopup();
      }

      if (pickup && destination) {
        routeRef.current = L.polyline([pointToLatLng(pickup), pointToLatLng(destination)], {
          color: "#e7a800",
          weight: 5,
          opacity: 0.9,
          dashArray: "10 8",
        }).addTo(map);

        const bounds = L.latLngBounds([pointToLatLng(pickup), pointToLatLng(destination)]);
        map.fitBounds(bounds.pad(0.25), { maxZoom: 17, animate: false });
      } else if (!driver) {
        map.setView([FUPRE_CAMPUS.centerLat, FUPRE_CAMPUS.centerLng], 16);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [destination, driver, followDriver, pickup, status]);

  function retry() {
    window.location.reload();
  }

  return (
    <div className={cn("relative min-h-[260px] overflow-hidden rounded-input bg-[#edf1f6]", className)}>
      <div ref={mapElement} className="absolute inset-0" aria-label="Interactive FUPRE campus map" />
      {status !== "ready" && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-[#edf1f6]/95 p-5 text-center">
          <div className="max-w-xs">
            <p className="font-semibold text-sm">{status === "loading" ? "Loading FUPRE map…" : "Map unavailable"}</p>
            <p className="text-xs text-navy/55 mt-1">{message || "OpenStreetMap is loading without an API key."}</p>
            {status === "error" && <button type="button" onClick={retry} className="mt-3 text-xs font-semibold text-gold hover:underline">Try again</button>}
          </div>
        </div>
      )}
      {status === "ready" && (
        <button
          type="button"
          onClick={() => setView((current) => current === "road" ? "satellite" : "road")}
          className="absolute top-3 right-3 z-[400] rounded-input bg-white px-3 py-2 text-xs font-semibold shadow-soft hover:bg-bg"
          aria-label="Toggle satellite imagery"
        >
          {view === "road" ? "Satellite" : "Road map"}
        </button>
      )}
    </div>
  );
}
