import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Destinations | Australia Travel Blog',
  description: 'Explore the best destinations in Australia, from iconic cities to hidden gems.',
}

const destinations = [
  {
    name: 'Sydney',
    description: 'Australia\'s largest city, known for its iconic Opera House and Harbour Bridge.',
    image: '/images/destinations/sydney.jpg',
    slug: 'sydney'
  },
  {
    name: 'Melbourne',
    description: 'A vibrant cultural hub with world-class dining, arts, and sports.',
    image: '/images/destinations/melbourne.jpg',
    slug: 'melbourne'
  },
  {
    name: 'Gold Coast',
    description: 'Famous for its beaches, theme parks, and laid-back lifestyle.',
    image: '/images/destinations/gold-coast.jpg',
    slug: 'gold-coast'
  }
]

export default function DestinationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Explore Australia</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((destination) => (
          <Link 
            key={destination.slug} 
            href={`/destinations/${destination.slug}`}
            className="group"
          >
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-2">{destination.name}</h2>
              <p className="text-gray-600">{destination.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 