import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/custom/Header'
import Footer from '@/components/custom/Footer'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { motion } from 'motion/react'
import { Icons } from '@/assets/icons'

export const Route = createFileRoute('/_public/marketplace')({
  component: MarketPlace,
})

type Product = {
  _id: string
  title: string
  description: string
  category: string
  price: number
  quantity: number
  seller_email: string
  seller_contact: string
  seller_name: string
  images: string[]
  tags: string[]
}

export function MarketPlace() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/marketplace')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data)
        setFiltered(data.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching marketplace data:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = [...products]

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category !== 'All') {
      result = result.filter((p) => p.category === category)
    }

    if (maxPrice !== null) {
      result = result.filter((p) => p.price <= maxPrice)
    }

    setFiltered(result)
  }, [search, category, maxPrice, products])

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: 'anticipate',
            duration: 1,
          }}
          className="flex items-center justify-center"
        >
          <Icons.Refresh />
        </motion.div>
      </div>
    )
  }

  const categories = [
    'All',
    ...Array.from(new Set(products.map((p) => p.category))),
  ]

  return (
    <>
      <Header />
      <div className="p-6">
        <div className="py-6 space-y-2 flex flex-col justify-center items-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
            Marketplace
          </h1>
          <p className="text-center text-gray-600 max-w-3xl">
            Explore and connect with trusted suppliers of hydrogen technologies,
            renewable energy equipment, and infrastructure solutions. From
            electrolyzers and storage tanks to pipelines and fuel dispensers,
            discover everything you need to power the future of clean energy.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 border rounded-lg p-4 bg-white h-fit">
            <h2 className="font-semibold mb-4">Filters</h2>

            <div className="mb-4">
              <label className="text-sm font-medium">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full mt-1 rounded-none">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium">Max Price (₹)</label>
              <input
                type="number"
                value={maxPrice ?? ''}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : null)
                }
                placeholder="e.g. 500000"
                className="w-full mt-1 p-2 border rounded"
              />
            </div>
          </aside>

          <div className="flex-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow hover:shadow-lg transition bg-white flex flex-col"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 sm:h-60 object-contain rounded-t-lg"
                  />

                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold">{product.title}</h2>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="mt-2 font-bold text-green-700">
                      ₹{product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Available: {product.quantity}
                    </p>

                    <div className="mt-3 text-sm">
                      <p className="font-medium">
                        Seller: {product.seller_name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {product.seller_contact}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {product.seller_email}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 text-right">
                      <Button
                        className="rounded-none"
                        onClick={() => {
                          const subject = encodeURIComponent(
                            `Inquiry about ${product.title}`,
                          )
                          const body = encodeURIComponent(
                            `Hello ${product.seller_name},\n\nI am interested in your product "${product.title}". Could you please share more details?\n\nThanks,`,
                          )
                          window.location.href = `mailto:${product.seller_email}?subject=${subject}&body=${body}`
                        }}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                No products match your filters.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
