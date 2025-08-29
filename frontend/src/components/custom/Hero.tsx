import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icons } from '@/assets/icons'

const Hero = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-between min-h-screen p-8 gap-8 bg-white">
      {/* Left side → Map */}
      <div className="flex-1 w-full h-[400px] lg:h-[800px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          zoomControl={false}
          dragging={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>

      {/* Right side → Text */}
      <div className="flex-1 text-center lg:text-left space-y-6">
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
          Build the Future of <span className="text-primary">Hydrogen</span>
        </h1>
        <p className="text-gray-600 text-xl leading-relaxed">
          Visualize assets, optimize investments, and accelerate the hydrogen
          ecosystem with our interactive mapping and analytics platform.
        </p>
        <button className="cursor-pointer flex mt-4 px-6 py-3 bg-primary text-white rounded-xl shadow-md hover:bg-primary/80 transition">
          Explore Now <Icons.ArrowUpSide />
        </button>
      </div>
    </section>
  )
}

export default Hero
