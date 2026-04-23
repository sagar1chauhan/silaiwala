import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 28.6139, lng: 77.2090 };

/**
 * DeliveryBoyLiveMap - Shows the delivery boy's live location on a map
 */
const DeliveryBoyLiveMap = ({
  riderLocation,
  destination,
  isLoaded,
  height = '400px',
}) => {
  if (!isLoaded) {
    return (
      <div style={{ height }} className="bg-slate-100 rounded-2xl flex items-center justify-center">
        <p className="text-xs text-slate-400 font-bold">Loading Map...</p>
      </div>
    );
  }

  const center = riderLocation?.lat ? riderLocation : defaultCenter;

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border border-slate-100">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          ],
        }}
      >
        {riderLocation?.lat && (
          <Marker
            position={riderLocation}
            label={{ text: '🛵', fontSize: '24px' }}
          />
        )}
        {destination?.lat && (
          <Marker
            position={destination}
            label={{ text: '📍', fontSize: '20px' }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default DeliveryBoyLiveMap;
