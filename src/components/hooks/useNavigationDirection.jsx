import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useNavigationDirection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isBackwards, setIsBackwards] = useState(false);
    const previousLocationRef = useRef(location);

    useEffect(() => {
        const handlePopState = () => {
            const currentPath = location.pathname;
            const previousPath = previousLocationRef.current.pathname;
            
            // Logic to determine if it's a backward navigation
            setIsBackwards(previousPath !== currentPath);
            
            // Update the previous location
            previousLocationRef.current = location;
        };

        // Listen for popstate event
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location]);

    return isBackwards;
};

export default useNavigationDirection;
