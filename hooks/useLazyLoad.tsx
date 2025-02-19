import { useState, useEffect } from 'react';

const useLazyLoad = <T extends unknown>(data: T[], batchSize: number) => {
    const [loadedData, setLoadedData] = useState<T[]>([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (data.length) {
        setLoadedData(data.slice(0, batchSize));
        setPage(0);
        }
    }, [data, batchSize]);

    const loadMore = () => {
        if (isLoading) return;

        const nextPage = page + 1;
        const startIndex = nextPage * batchSize;
        const endIndex = startIndex + batchSize;

        if (startIndex < data.length) {
        setIsLoading(true);
        setTimeout(() => {
            setLoadedData((prevData) => [
            ...prevData,
            ...data.slice(startIndex, endIndex),
            ]);
            setPage(nextPage);
            setIsLoading(false);
        }, 1000);
        }
    };

    const hasMore = loadedData.length < data.length;


    return { data: loadedData, hasMore , loadMore, isLoading };
    };

export default useLazyLoad;
