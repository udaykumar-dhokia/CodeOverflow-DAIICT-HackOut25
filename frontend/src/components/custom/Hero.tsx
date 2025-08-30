import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { axiosInstance } from '@/api/axiosInstance'
import WindHeatmap from '../custom/WindHeatMap'

const solarIcon = new L.DivIcon({
  html: `
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.8789 8.29492C17.8789 11.0089 15.8674 13.2531 13.2539 13.618L13.2539 22.1699C13.2539 22.5841 12.9181 22.9199 12.5039 22.9199C12.0897 22.9199 11.7539 22.5841 11.7539 22.1699L11.7539 13.618C9.14041 13.2531 7.12891 11.0089 7.12891 8.29492C7.12891 5.32639 9.53538 2.91992 12.5039 2.91992C15.4724 2.91992 17.8789 5.32639 17.8789 8.29492Z" fill="#323544"/>
</svg>
  `,
  className: '',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
})

const Hero = () => {
  const [solars, setSolars] = useState<any[]>([])
  const [winds, setWinds] = useState<any[]>([])
  const [activeLayer, setActiveLayer] = useState<'solar' | 'wind'>('solar')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const solarRes = await axiosInstance.get('/solar/get-all')
        setSolars(solarRes.data.solars || [])

        const windRes = await axiosInstance.get('/wind/get-all')
        setWinds(windRes.data.winds || [])
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between min-h-screen p-8 gap-8 bg-white">
      {/* Left side → Map */}
      <div className="flex-1 w-full h-[400px] lg:h-[800px] rounded-none overflow-hidden shadow-lg">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          minZoom={4}
          maxZoom={10}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {activeLayer === 'solar' &&
            solars.map((item) => (
              <Marker
                key={item._id}
                position={[item.latitude, item.longitude]}
                icon={solarIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">Solar Plant</h3>
                    <p>
                      <strong>Unit:</strong> {item.unit}
                    </p>
                    <p>
                      <strong>Lat:</strong> {item.latitude},{' '}
                      <strong>Lng:</strong> {item.longitude}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

          {activeLayer === 'wind' && (
            <WindHeatmap
              points={winds.map((w) => ({
                lat: w.latitude,
                lng: w.longitude,
                value: w.speed || 1,
              }))}
            />
          )}
        </MapContainer>
      </div>

      <div className="flex-1 text-center lg:text-left space-y-6">
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
          Build the Future of <span className="text-primary">Hydrogen</span>
        </h1>
        <p className="text-gray-600 text-xl leading-relaxed">
          Visualize assets, optimize investments, and accelerate the hydrogen
          ecosystem with our interactive mapping and analytics platform.
        </p>

        {/* Layer toggle buttons */}
        <div className="flex gap-4 justify-center lg:justify-start">
          <button
            onClick={() => setActiveLayer('solar')}
            className={`px-4 py-2 rounded-none font-medium ${
              activeLayer === 'solar'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Solar
          </button>
          <button
            onClick={() => setActiveLayer('wind')}
            className={`px-4 py-2 rounded-none font-medium ${
              activeLayer === 'wind'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Wind
          </button>
        </div>

        {/* Stats / Summary */}
        <div className="mt-4 bg-gray-50 p-4 rounded-none shadow-inner space-y-2">
          {activeLayer === 'solar' && (
            <>
              <h2 className="font-semibold text-lg">Solar Stats</h2>
              <p>Total Plants: {solars.length}</p>
              <p>
                Max Unit:{' '}
                {solars.length > 0
                  ? Math.max(...solars.map((s) => s.unit))
                  : 'N/A'}
              </p>
              <p>
                Min Unit:{' '}
                {solars.length > 0
                  ? Math.min(...solars.map((s) => s.unit))
                  : 'N/A'}
              </p>
            </>
          )}

          {activeLayer === 'wind' && (
            <>
              <h2 className="font-semibold text-lg">Wind Stats (km/hr)</h2>
              <p>Total Points: {winds.length}</p>
              <p>
                Max Speed:{' '}
                {winds.length > 0
                  ? Math.max(...winds.map((w) => w.speed))
                  : 'N/A'}
              </p>
              <p>
                Min Speed:{' '}
                {winds.length > 0
                  ? Math.min(...winds.map((w) => w.speed))
                  : 'N/A'}
              </p>
            </>
          )}
        </div>

        {/* List of items */}
        <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
          {activeLayer === 'solar' &&
            solars.map((s) => (
              <div
                key={s._id}
                className="p-2 border rounded-none bg-white shadow-sm"
              >
                <p>
                  <strong>Unit:</strong> {s.unit}
                </p>
                <p>
                  <strong>Location:</strong> {s.latitude}, {s.longitude}
                </p>
              </div>
            ))}

          {activeLayer === 'wind' &&
            winds.map((w) => (
              <div
                key={w._id}
                className="p-2 border rounded-none bg-white shadow-sm"
              >
                <p>
                  <strong>Speed:</strong> {w.speed}
                </p>
                <p>
                  <strong>Location:</strong> {w.latitude}, {w.longitude}
                </p>
              </div>
            ))}
        </div>

        {/* <button className="cursor-pointer flex mt-6 px-6 py-3 bg-primary text-white rounded-none shadow-md hover:bg-primary/80 transition items-center gap-2">
          Explore Now <Icons.ArrowUpSide />
        </button> */}
      </div>
    </section>
  )
}

export default Hero
