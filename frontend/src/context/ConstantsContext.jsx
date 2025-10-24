import { createContext, useContext, useState, useEffect } from 'react';
import constantsService from '../services/constantsService';

const ConstantsContext = createContext();

export const ConstantsProvider = ({ children }) => {
    const [constants, setConstants] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConstants();
    }, []);

    const loadConstants = async () => {
        try {
            const response = await constantsService.getConstants();
            setConstants(response.data);
        } catch (error) {
            console.error('Failed to load constants:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConstantsContext.Provider value={{ constants, loading }}>
            {children}
        </ConstantsContext.Provider>
    );
};

export const useConstants = () => {
    const context = useContext(ConstantsContext);
    if (!context) {
        throw new Error('useConstants must be used within ConstantsProvider');
    }
    return context;
};