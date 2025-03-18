import { initGoogleMaps } from './googleMaps';

export const RESTAURANT_ADDRESS = "Parirenyetwa Rd, Lusaka 10101, Zambia";
export const MAX_DELIVERY_TIME = 90; // Maximum delivery time in minutes

export const calculateDistance = async (origin: string, destination: string): Promise<number> => {
  try {
    await initGoogleMaps();
    
    return new Promise((resolve) => {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          region: 'zm' // Set region to Zambia
        },
        (response, status) => {
          if (status === 'OK' && response) {
            const result = response.rows[0].elements[0];
            if (result.status === 'OK') {
              // Convert distance from meters to kilometers
              const distanceInKm = result.distance.value / 1000;
              resolve(distanceInKm);
            } else {
              resolve(5); // Default to 5km if calculation fails
            }
          } else {
            resolve(5); // Default to 5km if service fails
          }
        }
      );
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 5; // Default to 5km if Google Maps fails to load
  }
};

export const calculateDeliveryTime = (distance: number) => {
  // Base preparation time: 15 minutes
  const preparationTime = 15;
  
  // Calculate delivery time based on distance (assuming average speed of 15 km/h for Lusaka traffic)
  // Convert distance to minutes: (distance in km / speed in km/h) * 60 minutes
  const deliveryTime = Math.ceil((distance / 15) * 60);
  
  return preparationTime + deliveryTime;
};

export const isDeliveryPossible = (distance: number): boolean => {
  const totalTime = calculateDeliveryTime(distance);
  return totalTime <= MAX_DELIVERY_TIME;
};

export const getStatusDurations = (totalMinutes: number) => {
  return {
    pending: Math.floor(totalMinutes * 0.2),      // 20% of total time
    preparing: Math.floor(totalMinutes * 0.4),     // 40% of total time
    outForDelivery: Math.floor(totalMinutes * 0.4) // 40% of total time
  };
};