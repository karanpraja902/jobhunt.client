import React, { useState } from 'react';
import { Building2, User } from 'lucide-react';

const SafeImage = ({ 
    src, 
    alt, 
    fallback = 'icon', 
    fallbackText, 
    className = '',
    iconClassName = '',
    ...props 
}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleError = () => {
        setError(true);
        setLoading(false);
    };

    const handleLoad = () => {
        setLoading(false);
    };

    if (error || !src) {
        if (fallback === 'icon') {
            return <Building2 className={iconClassName || 'h-8 w-8 text-gray-400'} />;
        }
        if (fallback === 'initial' && fallbackText) {
            return (
                <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
                    <span className='text-gray-600 font-bold'>
                        {fallbackText.charAt(0).toUpperCase()}
                    </span>
                </div>
            );
        }
        return <Building2 className={iconClassName || 'h-8 w-8 text-gray-400'} />;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={handleError}
            onLoad={handleLoad}
            style={{ display: loading ? 'none' : 'block' }}
            {...props}
        />
    );
};

export default SafeImage;
