import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { axiosInstance } from '@/api/axiosInstance'
import Loader from '@/components/custom/Loader'

export const Route = createFileRoute(
  '/_protected/project-developer/_layout/marketplace',
)({
  component: RouteComponent,
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

function RouteComponent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/marketplace')
        setProducts(res.data.data)
        setFiltered(res.data.data)
      } catch (err) {
        console.error('Error fetching marketplace data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
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
        <Loader />
      </div>
    )
  }

  const categories = [
    'All',
    ...Array.from(new Set(products.map((p) => p.category))),
  ]

  return (
    <>
      <div className="">
        <header className="flex items-center justify-between p-6 bg-white">
          <h1 className="text-3xl font-bold text-gray-800">Marketplace</h1>
        </header>

        <div className="flex gap-6 justify-center">
          {/* Sidebar filters */}
          <aside className="w-64 border rounded-lg p-4 bg-white h-fit">
            <h2 className="font-semibold mb-4">Filters</h2>

            {/* Search */}
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

            {/* Category */}
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

            {/* Max Price */}
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

          {/* Product Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 flex-1 max-w-5xl">
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow hover:shadow-lg transition bg-white"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-60 object-contain rounded-t-lg"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{product.title}</h2>
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                    <p className="mt-2 font-bold text-green-700">
                      ₹{product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Available: {product.quantity}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium">
                        Seller: {product.seller_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.seller_contact}
                      </p>
                      <p className="text-xs text-gray-500">
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
                  </div>
                  <div className="mt-2 text-end align-bottom">
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
              ))
            ) : (
              <p className="text-gray-500">No products match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
