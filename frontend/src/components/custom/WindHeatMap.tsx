import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import 'leaflet.heat'

interface HeatmapProps {
  points: { lat: number; lng: number; value: number }[]
}

const WindHeatmap = ({ points }: HeatmapProps) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // Convert points to LatLng array with intensity
    const heatData = points.map(
      (p) => [p.lat, p.lng, p.value] as [number, number, number],
    )

    // Create heat layer
    const heatLayer = (window as any).L.heatLayer(heatData, {
      radius: 25,
      blur: 20,
      maxZoom: 10,
      max: 20, // adjust based on wind dataset
      gradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red',
      },
    }).addTo(map)

    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, points])

  return null
}

export default WindHeatmap
