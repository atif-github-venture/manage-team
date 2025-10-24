import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchFunction, dependencies = [], skip = false) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!skip);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (skip) return;

        setLoading(true);
        setError(null);

        try {
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [fetchFunction, skip]);

    useEffect(() => {
        fetchData();
    }, dependencies);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
};

export default useFetch;