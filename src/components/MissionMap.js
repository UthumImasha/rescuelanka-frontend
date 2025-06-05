"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, Polyline, LoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "1rem",
};

const defaultZoom = 14;

function haversineDistance(coords1, coords2) {
    if (!coords1 || !coords2) return 0;
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const MissionMap = () => {
    const [userCoords, setUserCoords] = useState(null);
    const [otherCoords, setOtherCoords] = useState({ lat: "", lng: "" });
    const [parsedOtherCoords, setParsedOtherCoords] = useState(null);
    const [distance, setDistance] = useState(null);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserCoords({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                },
                (err) => {
                    alert("Unable to get your location. Please allow location access.");
                }
            );
        }
    }, []);

    // Parse and update other user's coordinates
    useEffect(() => {
        const lat = parseFloat(otherCoords.lat);
        const lng = parseFloat(otherCoords.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
            setParsedOtherCoords({ lat, lng });
        } else {
            setParsedOtherCoords(null);
        }
    }, [otherCoords]);

    // Calculate distance
    useEffect(() => {
        if (userCoords && parsedOtherCoords) {
            setDistance(haversineDistance(userCoords, parsedOtherCoords));
        } else {
            setDistance(null);
        }
    }, [userCoords, parsedOtherCoords]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOtherCoords((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mission Map</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-4">
                    <div className="mb-2 text-gray-700 font-medium">
                        Your Location:
                        {userCoords ? (
                            <span className="ml-2 text-blue-700">
                                Lat: {userCoords.lat.toFixed(6)}, Lng: {userCoords.lng.toFixed(6)}
                            </span>
                        ) : (
                            <span className="ml-2 text-gray-400">Detecting...</span>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <form
                        className="flex flex-col md:flex-row md:items-center gap-2"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <label className="font-medium text-gray-700">
                            Other User Coordinates:
                        </label>
                        <input
                            type="number"
                            step="any"
                            name="lat"
                            value={otherCoords.lat}
                            onChange={handleInputChange}
                            placeholder="Latitude"
                            className="border rounded px-2 py-1 w-32"
                        />
                        <input
                            type="number"
                            step="any"
                            name="lng"
                            value={otherCoords.lng}
                            onChange={handleInputChange}
                            placeholder="Longitude"
                            className="border rounded px-2 py-1 w-32"
                        />
                    </form>
                </div>
                {distance !== null && (
                    <div className="mb-4 text-green-700 font-semibold">
                        Distance: {distance.toFixed(2)} km
                    </div>
                )}
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                   <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
  {/* ... */}
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={userCoords || { lat: 7.8731, lng: 80.7718 }} // fallback center
                            zoom={defaultZoom}
                        >
                            {userCoords && (
                                <Marker
                                    position={userCoords}
                                    label="You"
                                    icon={{
                                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                    }}
                                />
                            )}
                            {parsedOtherCoords && (
                                <Marker
                                    position={parsedOtherCoords}
                                    label="Other"
                                    icon={{
                                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                    }}
                                />
                            )}
                            {userCoords && parsedOtherCoords && (
                                <Polyline
                                    path={[userCoords, parsedOtherCoords]}
                                    options={{
                                        strokeColor: "#FF0000",
                                        strokeOpacity: 0.8,
                                        strokeWeight: 2,
                                    }}
                                />
                            )}
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>
        </div>
    );
};

export default MissionMap;
