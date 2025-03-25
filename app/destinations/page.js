'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Australian destinations data
const destinations = [
  {
    name: 'Great Barrier Reef',
    coordinates: [-18.2871, 146.2587],
    description: 'The world\'s largest coral reef system',
    region: 'Queensland',
    highlights: [
      'Snorkeling and diving experiences',
      'Coral reef ecosystems',
      'Marine wildlife encounters'
    ],
    blogPosts: [
      { slug: 'great-barrier-reef', title: 'Exploring the Great Barrier Reef' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1587139223877-04cb899fa3e8'
  },
  {
    name: 'Sydney',
    coordinates: [-33.8688, 151.2093],
    description: 'Australia\'s largest city with iconic landmarks',
    region: 'New South Wales',
    highlights: [
      'Sydney Opera House',
      'Harbour Bridge',
      'Bondi Beach'
    ],
    blogPosts: [
      { slug: 'sydney-harbour', title: 'Sydney Harbour: A Complete Guide' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9'
  },
  {
    name: 'Melbourne',
    coordinates: [-37.8136, 144.9631],
    description: 'Cultural capital known for its laneways and coffee',
    region: 'Victoria',
    highlights: [
      'Street art and laneways',
      'Coffee culture',
      'Sports venues'
    ],
    blogPosts: [
      { slug: 'melbourne-laneways', title: 'Melbourne\'s Hidden Laneways' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1514395462725-fb4566210426'
  },
  {
    name: 'Uluru',
    coordinates: [-25.3444, 131.0369],
    description: 'Sacred Aboriginal site in the heart of Australia',
    region: 'Northern Territory',
    highlights: [
      'Sunrise and sunset views',
      'Aboriginal cultural experiences',
      'Desert landscapes'
    ],
    blogPosts: [
      { slug: 'outback-adventures', title: 'Adventures in the Outback' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1529108190281-9d6ebf35a776'
  },
  {
    name: 'Tasmania',
    coordinates: [-41.4545, 146.6153],
    description: 'Island state known for wilderness and wildlife',
    region: 'Tasmania',
    highlights: [
      'Cradle Mountain',
      'MONA museum',
      'Port Arthur historic site'
    ],
    blogPosts: [
      { slug: 'tasmania-wilderness', title: 'Tasmanian Wilderness Adventures' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1527549993586-dff825b37782'
  }
];

export default function DestinationsPage() {
  const [activeDestination, setActiveDestination] = useState(null);
  const mapRef = useRef(null);

  // Function to fly to a destination
  const flyToDestination = (destination) => {
    if (mapRef.current) {
      mapRef.current.flyTo(destination.coordinates, 8, {
        duration: 2
      });
    }
    setActiveDestination(destination);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Australian Destinations
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover amazing places across Australia. Click on markers or destinations to learn more.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg relative" 
               style={{ height: '600px' }}>
            <MapContainer
              center={[-25.2744, 133.7751]} // Center of Australia
              zoom={4}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {destinations.map((destination, index) => (
                <Marker
                  key={index}
                  position={destination.coordinates}
                  eventHandlers={{
                    click: () => flyToDestination(destination)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="text-lg font-semibold">{destination.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{destination.description}</p>
                      <p className="text-sm font-medium text-blue-600">{destination.region}</p>
                      <Link
                        href={`/blog?destination=${destination.name.toLowerCase()}`}
                        className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                      >
                        View Related Posts →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md z-[1000]">
              <h4 className="text-sm font-semibold mb-2">Map Legend</h4>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Major Cities</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Natural Attractions</span>
              </div>
            </div>
          </div>

          {/* Destinations Panel */}
          <div className="space-y-6">
            {/* Active Destination Details */}
            {activeDestination && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <img
                  src={activeDestination.imageUrl}
                  alt={activeDestination.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {activeDestination.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {activeDestination.description}
                </p>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Highlights:</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {activeDestination.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Related Posts:</h3>
                  <div className="space-y-2">
                    {activeDestination.blogPosts.map((post, index) => (
                      <Link
                        key={index}
                        href={`/posts/${post.slug}`}
                        className="block text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {post.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Destinations List */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Featured Destinations
              </h2>
              <div className="space-y-4">
                {destinations.map((destination, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer ${
                      activeDestination?.name === destination.name
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                    onClick={() => flyToDestination(destination)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {destination.region}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {destination.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 