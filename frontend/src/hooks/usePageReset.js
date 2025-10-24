import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageReset = (resetCallback) => {
    const location = useLocation();

    useEffect(() => {
        return () => {
            if (resetCallback) {
                resetCallback();
            }
        };
    }, [location.pathname, resetCallback]);
};

export default usePageReset;