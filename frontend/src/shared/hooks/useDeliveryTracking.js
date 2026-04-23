import { useState, useEffect, useRef, useCallback } from 'react';
import { useDeliveryAuthStore } from '../../modules/delivery/store/deliveryStore';

/**
 * useDeliveryTracking - Tracks rider's live GPS location and syncs with backend.
 * @param {string} riderId - The delivery partner's ID
 * @param {Array} activeTasks - Array of active order objects (optional)
 * @returns {{ lat: number|null, lng: number|null }} - Current location
 */
export const useDeliveryTracking = (riderId, activeTasks = []) => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const watchIdRef = useRef(null);
  const updateLocation = useDeliveryAuthStore?.getState?.()?.updateLocation;

  const handlePosition = useCallback((position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ lat: latitude, lng: longitude });

    // Sync location to backend if rider is active
    if (riderId && typeof updateLocation === 'function') {
      updateLocation(latitude, longitude);
    }
  }, [riderId, updateLocation]);

  useEffect(() => {
    if (!riderId || !navigator.geolocation) return;

    // Get initial position
    navigator.geolocation.getCurrentPosition(handlePosition, (err) => {
      console.warn('[useDeliveryTracking] Initial position error:', err.message);
    }, { enableHighAccuracy: true, timeout: 10000 });

    // Watch for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      (err) => {
        console.warn('[useDeliveryTracking] Watch error:', err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [riderId, handlePosition]);

  return location;
};

export default useDeliveryTracking;
