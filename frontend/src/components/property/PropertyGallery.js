import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PropertyGallery Component
 * Displays a responsive image gallery with lightbox functionality
 */
const PropertyGallery = () => {
    // State for lightbox
    const [selectedImage, setSelectedImage] = useState(null);

    // Property details
    const propertyDetails = {
        name: "Sheena Residence",
        address: "7028 E Sheena Drive, Scottsdale Arizona 85254",
        description: `Experience luxury living in this modern Scottsdale retreat. This beautifully renovated property 
            features a private pool and spa, perfect for enjoying the Arizona sunshine. Located in a quiet neighborhood,
            you'll be just minutes away from all the attractions Scottsdale has to offer.`,
        features: [
            "Private Pool & Heated Spa",
            "Modern, Fully-Equipped Kitchen",
            "Multiple Bedrooms with Premium Bedding",
            "Luxury Bathrooms with Designer Fixtures",
            "Outdoor Entertainment Area",
            "High-Speed WiFi Throughout",
            "Smart TV with Streaming Services",
            "Fully Air Conditioned",
            "Washer and Dryer",
            "Dedicated Workspace",
            "Free Parking on Premises"
        ],
        checkIn: "4:00 PM",
        checkOut: "11:00 AM",
        houseRules: [
            "No smoking",
            "No pets",
            "No parties or events",
            "Check-in time is 4:00 PM - 10:00 PM",
            "Check out by 11:00 AM",
            "Self check-in with keypad"
        ]
    };

    // Image data with descriptions
    const images = [
        {
            id: 1,
            src: "/assets/images/property/pool.jpg", // Image 2
            alt: "Luxurious Pool and Spa Area",
            description: "Stunning pool and spa area with palm trees and evening lighting",
            isPrimary: true
        },
        {
            id: 2,
            src: "/assets/images/property/main-bedroom.jpg", // Image 3
            alt: "Spacious Main Bedroom",
            description: "Modern bedroom with two queen beds and elegant decor"
        },
        {
            id: 3,
            src: "/assets/images/property/bunk-room.jpg", // Image 5
            alt: "Bunk Bed Room",
            description: "Comfortable bunk bed room perfect for families or groups"
        },
        {
            id: 4,
            src: "/assets/images/property/bathroom.jpg", // Image 4
            alt: "Modern Bathroom",
            description: "Luxury bathroom with designer shower and modern fixtures"
        },
        {
            id: 5,
            src: "/assets/images/property/bedroom-detail.jpg", // Image 1
            alt: "Bedroom Detail",
            description: "Stylish bedroom featuring modern design elements"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Property Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {propertyDetails.name}
                </h1>
                <p className="text-xl text-gray-600">
                    {propertyDetails.address}
                </p>
            </div>

            {/* Main Image */}
            <div className="mb-8">
                <div className="relative h-[600px] w-full overflow-hidden rounded-lg">
                    <img
                        src={images[0].src}
                        alt={images[0].alt}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setSelectedImage(images[0])}
                    />
                </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {images.slice(1).map((image) => (
                    <div
                        key={image.id}
                        className="relative h-80 overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover hover:opacity-95 transition-opacity"
                        />
                    </div>
                ))}
            </div>

            {/* Property Description */}
            <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">About This Property</h2>
                <p className="text-gray-700 mb-6">
                    {propertyDetails.description}
                </p>
                
                <h3 className="text-xl font-semibold mb-4">Featured Amenities</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {propertyDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                            <svg
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                        </li>
                    ))}
                </ul>

                <h3 className="text-xl font-semibold mb-4">House Rules</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {propertyDetails.houseRules.map((rule, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                            <svg
                                className="h-5 w-5 text-red-500 mr-2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M18 15l-6 6-6-6" />
                            </svg>
                            {rule}
                        </li>
                    ))}
                </ul>

                <h3 className="text-xl font-semibold mb-4">Check-in/Check-out</h3>
                <p className="text-gray-700 mb-6">
                    Check-in time is {propertyDetails.checkIn} and check-out time is {propertyDetails.checkOut}.
                </p>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-4xl w-full">
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                className="w-full h-auto rounded-lg"
                            />
                            <p className="absolute bottom-4 left-4 text-white text-lg">
                                {selectedImage.description}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PropertyGallery;
