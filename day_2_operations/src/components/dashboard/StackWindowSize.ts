import { useState, useEffect } from 'react';

export const StackWindowSize = () => {
    const getSize = () => ({
        width: window.innerWidth,
        count: window.innerWidth <= 1000 ? 10 : window.innerWidth <= 1300 ? 6 : window.innerWidth <= 1600 ? 7 : 8,
        totalFontSize: window.innerWidth < 1190 ? '7px' : window.innerWidth < 1376 ? '8px' : '10px',
        responsiveColWidth: window.innerWidth < 1190 ? '18px' : window.innerWidth < 1376 ? '23px' : '30px',
    });

    const [size, setSize] = useState(getSize);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const handleResize = () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                setSize(getSize());
                timeoutId = null;
            }, 200);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    return size;
};
