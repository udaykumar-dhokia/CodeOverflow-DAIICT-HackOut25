import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { axiosInstance } from '@/api/axiosInstance'
import WindHeatmap from '../custom/WindHeatMap'

const solarIcon = new L.DivIcon({
  html: `
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.4" d="M11.8537 5.68724C11.0057 4.10295 8.73426 4.10295 7.88627 5.68724L2.2655 16.1884C1.46324 17.6873 2.54916 19.5002 4.24921 19.5002L19.7463 19.5003C21.4002 19.5003 22.4889 17.776 21.7777 16.2828L19.3509 11.1877C18.5365 9.47768 16.1027 9.47769 15.2882 11.1877L15.0573 11.6725L11.8537 5.68724Z" fill="#323544"/>
<path d="M7.88627 5.68755C8.73426 4.10326 11.0057 4.10325 11.8537 5.68754L15.0573 11.6728L15.2882 11.188C16.1027 9.47799 18.5365 9.47799 19.3509 11.188L21.7777 16.2831C22.4889 17.7763 21.4002 19.5006 19.7463 19.5006H12.517C12.5124 19.5006 12.5079 19.5006 12.5034 19.5005H4.24921C2.54916 19.5005 1.46324 17.6876 2.2655 16.1887L7.88627 5.68755ZM12.5306 18.0006H19.7463C20.2976 18.0006 20.6605 17.4258 20.4235 16.9281L17.9967 11.833C17.7252 11.263 16.9139 11.263 16.6425 11.833L15.7735 13.6575C15.6518 13.913 15.3968 14.0782 15.1139 14.0848C14.8311 14.0915 14.5686 13.9384 14.4351 13.689L10.5312 6.3954C10.2486 5.86731 9.49141 5.8673 9.20874 6.3954L3.58798 16.8966C3.32056 17.3962 3.68253 18.0005 4.24921 18.0005H12.517C12.5215 18.0005 12.5261 18.0006 12.5306 18.0006Z" fill="#323544"/>
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
    <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between min-h-screen p-8 gap-8">
      {/* Map Section */}
      <div className="flex-1 w-full h-[400px] lg:h-[800px]  overflow-hidden shadow-lg border border-gray-200 transition-transform hover:scale-[1.01] duration-300">
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
                    <h3 className="font-bold text-primary">Solar Plant</h3>
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

      {/* Sidebar */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Layer Toggle */}
        <div className="flex gap-4 justify-center lg:justify-start">
          <button
            onClick={() => setActiveLayer('solar')}
            className={`px-5 py-2 font-medium transition-all cursor-pointer ${
              activeLayer === 'solar'
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Solar
          </button>
          <button
            onClick={() => setActiveLayer('wind')}
            className={`px-5 py-2 font-medium transition-all cursor-pointer ${
              activeLayer === 'wind'
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Wind
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-6  shadow-sm border border-gray-200">
          {activeLayer === 'solar' ? (
            <>
              <h2 className="font-bold text-xl text-gray-800 mb-4">
                Solar Stats
              </h2>
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
          ) : (
            <>
              <h2 className="font-bold text-xl text-gray-800 mb-4">
                Wind Stats (km/hr)
              </h2>
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

        {/* List */}
        <div className="overflow-y-auto max-h-[350px] space-y-3">
          {activeLayer === 'solar' &&
            solars.map((s) => (
              <div
                key={s._id}
                className="p-3  bg-white shadow-sm border border-gray-200 hover:shadow-md transition"
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
                className="p-3  bg-white shadow-sm border border-gray-200 hover:shadow-md transition"
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
      </div>
    </section>
  )
}

export default Hero
