import { useEffect } from 'react';

const TawkChat = () => {
    useEffect(() => {
        // Tawk.to Script Integration
        // Replace 'YOUR_PROPERTY_ID' and 'YOUR_WIDGET_ID' with your actual IDs from tawk.to dashboard
        const propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID;
        const widgetId = import.meta.env.VITE_TAWK_WIDGET_ID;

        // Skip loading if IDs are placeholders or missing
        if (!propertyId || !widgetId || propertyId === '67ed6249430c0019253457a4') {
            return;
        }

        const s1 = document.createElement("script");
        const s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode?.insertBefore(s1, s0);

        return () => {
            // Cleanup: Tawk.to creates global variables and a widget element
            // Removing the script won't necessarily remove the widget, 
            // but for a global widget in a SPA we usually keep it mounted.
        };
    }, []);

    return null;
};

export default TawkChat;
