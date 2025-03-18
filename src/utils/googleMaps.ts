import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCkohgYg5qa9qusA42r4E9SbzNFTqvHZiY';

let loader: Loader | null = null;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

export const initGoogleMaps = async () => {
  if (loadPromise) {
    return loadPromise;
  }

  if (!loader && !isLoading) {
    isLoading = true;
    loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    });

    loadPromise = loader.load().then(() => {
      isLoading = false;
    });

    return loadPromise;
  }
};

export const initAutocomplete = (
  inputElement: HTMLInputElement,
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void
) => {
  if (!inputElement || !window.google?.maps?.places) return null;

  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    componentRestrictions: { country: 'ZM' },
    fields: ['formatted_address', 'geometry', 'name'],
    types: ['geocode', 'establishment']
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place) {
      onPlaceSelect(place);
    }
  });

  return autocomplete;
};