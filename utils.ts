export const getLatencyClass = (latency: number | null): string => {
    if (latency === null) return 'failed';
    if (latency < 100) return 'good';
    if (latency < 250) return 'moderate';
    return 'high';
};

export const getOS = (userAgent: string) => {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/macintosh|mac os x/i.test(userAgent)) return 'macOS';
    if (/android/i.test(userAgent)) return 'Android';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    return 'Unknown';
};

export const getBrowser = (userAgent: string) => {
    if (/(edg|edge|msie|trident)/i.test(userAgent)) return 'Microsoft Edge';
    if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
    if (/opr|opera/i.test(userAgent)) return 'Opera';
    if (/chrome|crios/i.test(userAgent)) return 'Google Chrome';
    if (/safari/i.test(userAgent)) return 'Apple Safari';
    return 'Unknown';
};
