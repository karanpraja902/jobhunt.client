import React, { useState, useEffect } from 'react';
import { Building2, User, Image } from 'lucide-react';

const SafeImageCORS = ({ 
    src, 
    alt, 
    fallback = 'icon', 
    fallbackText, 
    className = '',
    iconClassName = '',
    useProxy = true,
    ...props 
}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        if (!src) {
            setError(true);
            setLoading(false);
            return;
        }

        // Check if the image is from an external domain
        const isExternal = src.startsWith('http://') || src.startsWith('https://');
        const isLocalhost = src.includes('localhost') || src.includes('127.0.0.1');
        
        if (isExternal && !isLocalhost && useProxy) {
            // Try multiple proxy services as fallbacks
            const proxies = [
                `https://images.weserv.nl/?url=${encodeURIComponent(src)}`,
                `https://cors-anywhere.herokuapp.com/${src}`,
                `/api/proxy-image?url=${encodeURIComponent(src)}` // Your backend proxy endpoint
            ];
            
            // Use the first proxy by default
            setImageSrc(proxies[0]);
        } else {
            setImageSrc(src);
        }
    }, [src, useProxy]);

    const handleError = () => {
        console.log('Image failed to load:', imageSrc);
        
        // If using a proxy and it failed, try the original URL
        if (useProxy && imageSrc !== src) {
            console.log('Trying original URL:', src);
            setImageSrc(src);
            return;
        }
        
        setError(true);
        setLoading(false);
    };

    const handleLoad = () => {
        setLoading(false);
    };

    // Render fallback if error or no source
    if (error || !src) {
        if (fallback === 'icon') {
            return <Building2 className={iconClassName || 'h-8 w-8 text-gray-400'} />;
        }
        if (fallback === 'initial' && fallbackText) {
            return (
                <div className={`flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded ${className}`}>
                    <span className='font-bold text-lg'>
                        {fallbackText.charAt(0).toUpperCase()}
                    </span>
                </div>
            );
        }
        if (fallback === 'placeholder') {
            return (
                <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`}>
                    <Image className='h-6 w-6 text-gray-400' />
                </div>
            );
        }
        return <Building2 className={iconClassName || 'h-8 w-8 text-gray-400'} />;
    }

    return (
        <>
            {loading && (
                <div className={`flex items-center justify-center bg-gray-100 animate-pulse ${className}`}>
                    <Image className='h-6 w-6 text-gray-400' />
                </div>
            )}
            <img
                src={imageSrc}
                alt={alt}
                className={className}
                onError={handleError}
                onLoad={handleLoad}
                style={{ display: loading ? 'none' : 'block' }}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                {...props}
            />
        </>
    );
};

export default SafeImageCORS;
