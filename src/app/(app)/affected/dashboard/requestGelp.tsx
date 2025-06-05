import React, { useState, useEffect } from 'react';
import {
    X, Send, Upload, Utensils, Home, Stethoscope, Shirt, Droplets, Zap, MapPin
} from 'lucide-react';

// Help types
const HELP_TYPES = [
    { id: 'food', label: 'Food & Water', icon: Utensils },
    { id: 'shelter', label: 'Shelter', icon: Home },
    { id: 'medical', label: 'Medical Aid', icon: Stethoscope },
    { id: 'clothing', label: 'Clothing', icon: Shirt },
    { id: 'water', label: 'Clean Water', icon: Droplets },
    { id: 'power', label: 'Power/Fuel', icon: Zap }
];

const RequestHelpModal = ({
    open,
    onClose,
    onSubmit,
    isOnline
}) => {
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedHelpTypes, setSelectedHelpTypes] = useState([]);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [locationStatus, setLocationStatus] = useState('Detecting...');
    const [images, setImages] = useState([]);

    // Auto-detect location on mount
    useEffect(() => {
        if (!open) return;
        setLocationStatus('Detecting...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setLocationStatus('Location detected');
                },
                (err) => setLocationStatus('Unable to detect location')
            );
        } else {
            setLocationStatus('Geolocation not supported');
        }
    }, [open]);

    // Handle help type (multi-select)
    const toggleHelpType = (id) => {
        setSelectedHelpTypes((prev) =>
            prev.includes(id)
                ? prev.filter((t) => t !== id)
                : [...prev, id]
        );
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImages(prev => [
                    ...prev,
                    { file, preview: ev.target.result, name: file.name }
                ]);
            };
            reader.readAsDataURL(file);
        });
    };

    // Submit handler
    const handleSubmit = () => {
        const requestData = {
            title,
            description,
            helpTypes: selectedHelpTypes,
            images,
            coordinates,
            timestamp: new Date().toISOString()
        };
        onSubmit(requestData);
        // Reset form
        setTitle('');
        setDescription('');
        setSelectedHelpTypes([]);
        setImages([]);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/90 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Request Emergency Help</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Short title for your request"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Describe your situation and needs"
                            />
                        </div>

                        {/* Help Types (multi-select) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type(s) of Help Needed</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {HELP_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => toggleHelpType(type.id)}
                                        className={`flex flex-col items-center space-y-2 p-4 rounded-lg border transition-colors ${selectedHelpTypes.includes(type.id)
                                                ? 'border-red-500 bg-red-50 text-red-700'
                                                : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <type.icon className="h-6 w-6" />
                                        <span className="text-sm">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Detected Location</label>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                <span>
                                    {locationStatus}
                                    {coordinates.lat && coordinates.lng && (
                                        <>: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}</>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">Click to upload images showing your situation</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="help-image-upload"
                                />
                                <label
                                    htmlFor="help-image-upload"
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                    Select Images
                                </label>
                            </div>
                            {images.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Uploaded Images</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {images.map((image, idx) => (
                                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                                <img
                                                    src={image.preview}
                                                    alt={image.name}
                                                    className="w-full h-32 object-cover rounded mb-2"
                                                />
                                                <p className="text-sm text-gray-600">{image.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-4 pt-6 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!title || !description || selectedHelpTypes.length === 0}
                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                                <span>Submit Request</span>
                                {!isOnline && <span className="ml-2 text-xs">(Offline)</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestHelpModal;
