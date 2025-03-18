import React, { useEffect, useState } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { initGoogleMaps } from '../utils/googleMaps';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCkohgYg5qa9qusA42r4E9SbzNFTqvHZiY';
const DEFAULT_CENTER = { lat: -15.4167, lng: 28.2833 }; // Lusaka coordinates
const DEFAULT_ZOOM = 13;

interface DeliveryMapProps {
  restaurantAddress: string;
  deliveryAddress: string;
  orderId: string;
}

interface RouteInfo {
  directions: google.maps.DirectionsResult | null;
  distance: string;
  duration: string;
  restaurantLocation: google.maps.LatLng | null;
  deliveryLocation: google.maps.LatLng | null;
}

// Store routes for each order
const routeCache = new Map<string, RouteInfo>();

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  restaurantAddress,
  deliveryAddress,
  orderId
}) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [restaurantLocation, setRestaurantLocation] = useState<google.maps.LatLng | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<google.maps.LatLng | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const geocodeAddress = async (address: string): Promise<google.maps.LatLng> => {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 
        address,
        region: 'zm' // Set region to Zambia
      }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          resolve(results[0].geometry.location);
        } else {
          reject(new Error(`Geocoding failed for address: ${address}`));
        }
      });
    });
  };

  const calculateRoute = async () => {
    if (!window.google || !restaurantAddress || !deliveryAddress) {
      setError('Missing required address information');
      return;
    }

    try {
      // First geocode both addresses
      const [restLocation, delLocation] = await Promise.all([
        geocodeAddress(restaurantAddress),
        geocodeAddress(deliveryAddress)
      ]);

      console.log(restLocation);
      console.log(delLocation);

      setRestaurantLocation(restLocation);
      setDeliveryLocation(delLocation);

      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: restLocation,
          destination: delLocation,
          travelMode: google.maps.TravelMode.DRIVING,
          region: 'zm' // Set region to Zambia
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            
            // Get distance and duration from the result
            const route = result.routes[0].legs[0];
            if (route) {
              setDistance(route.distance?.text || null);
              setDuration(route.duration?.text || null);

              // Cache the route info
              routeCache.set(orderId, {
                directions: result,
                distance: route.distance?.text || '',
                duration: route.duration?.text || '',
                restaurantLocation: restLocation,
                deliveryLocation: delLocation
              });
            }
            setError(null);
          } else {
            setError('Could not calculate delivery route');
          }
        }
      );
    } catch (err) {
      setError('Could not find one or both addresses');
    }
  };

  useEffect(() => {
    initGoogleMaps().then(() => {
      setMapLoaded(true);
    });
  }, []);

  // Recalculate route when addresses or orderId changes
  useEffect(() => {
    if (mapLoaded && restaurantAddress && deliveryAddress) {
      // Check cache first
      const cachedRoute = routeCache.get(orderId);
      if (cachedRoute) {
        setDirections(cachedRoute.directions);
        setRestaurantLocation(cachedRoute.restaurantLocation);
        setDeliveryLocation(cachedRoute.deliveryLocation);
        setDistance(cachedRoute.distance);
        setDuration(cachedRoute.duration);
      } else {
        calculateRoute();
      }
    }
  }, [restaurantAddress, deliveryAddress, orderId, mapLoaded]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem'
  };

  if (!restaurantAddress || !deliveryAddress) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-yellow-800">Please provide both restaurant and delivery addresses.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
        <div className="h-[400px] bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {distance && duration && (
        <div className="bg-primary-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-700 font-medium">Distance</p>
              <p className="text-primary-900 text-lg font-semibold">{distance}</p>
            </div>
            <div>
              <p className="text-primary-700 font-medium">Estimated Time</p>
              <p className="text-primary-900 text-lg font-semibold">{duration}</p>
            </div>
          </div>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={restaurantLocation?.toJSON() || DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#7C3AED',
                strokeWeight: 5,
              },
            }}
          />
        )}

        {restaurantLocation && (
          <Marker
            position={restaurantLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/restaurant.png',
              scaledSize: new google.maps.Size(32, 32),
            }}
            label={{
              text: 'Restaurant',
              className: 'text-xs font-medium bg-white px-2 py-1 rounded shadow-sm',
            }}
          />
        )}

        {deliveryLocation && (
          <Marker
            position={deliveryLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/home.png',
              scaledSize: new google.maps.Size(32, 32),
            }}
            label={{
              text: 'Delivery Location',
              className: 'text-xs font-medium bg-white px-2 py-1 rounded shadow-sm',
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};