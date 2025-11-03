// FIX: Added React default import to make React.RefObject type available.
import React, { useState, useEffect, useCallback } from 'react';
import { IpInfo, SystemInfo, SectionId } from './types';
import { getOS, getBrowser, secureFetch } from './utils';

export const useIpData = () => {
    const [ipv4, setIpv4] = useState<string | null>(null);
    const [ipv6, setIpv6] = useState<string | null>(null);
    const [localIp, setLocalIp] = useState<string | null>(null);
    const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocalIp = useCallback(() => {
        try {
            const pc = new RTCPeerConnection({ iceServers: [] });
            pc.createDataChannel('');
            pc.createOffer().then(pc.setLocalDescription.bind(pc));
            let found = false;
            pc.onicecandidate = (ice) => {
                if (ice && ice.candidate && ice.candidate.candidate && !found) {
                    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                    const ip = ipRegex.exec(ice.candidate.candidate)?.[1];
                    if (ip) {
                        found = true;
                        setLocalIp(ip);
                        pc.close();
                    }
                }
            };
            setTimeout(() => {
                if (!found) {
                    setLocalIp('N/A');
                    pc.close();
                }
            }, 1000);
        } catch (e) {
            console.error("Local IP discovery failed:", e);
            setLocalIp("N/A");
        }
    }, []);

    const fetchIpData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setIpv4(null);
        setIpv6(null);
        setLocalIp(null);
        setIpInfo(null);

        try {
            fetchLocalIp();

            const [ipv4Res, ipv6Res] = await Promise.allSettled([
                secureFetch('https://api.ipify.org?format=json', { cache: 'no-store' }).then(res => res.json()),
                secureFetch('https://api64.ipify.org?format=json', { cache: 'no-store' }).then(res => res.json())
            ]);

            const newIpv4 = ipv4Res.status === 'fulfilled' ? ipv4Res.value.ip : 'Not Detected';
            const newIpv6 = ipv6Res.status === 'fulfilled' ? ipv6Res.value.ip : 'Not Detected';

            setIpv4(newIpv4);
            setIpv6(newIpv6);

            const geoLookupIp = newIpv4 !== 'N/A' && newIpv4 !== 'Not Detected' ? newIpv4 : (newIpv6 !== 'N/A' && newIpv6 !== 'Not Detected' ? newIpv6 : null);

            if (geoLookupIp) {
                secureFetch(`https://ipinfo.io/${geoLookupIp}/json`)
                    .then(response => response.ok ? response.json() : null)
                    .then((data: IpInfo | null) => setIpInfo(data))
                    .catch(err => {
                        console.warn("Error processing geo information:", err);
                        setIpInfo(null);
                    });
            } else {
                console.warn("Could not determine a public IP for geolocation.");
            }
        } catch (err: any) {
            console.error("Failed to fetch primary IP data:", err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }, [fetchLocalIp]);
    
    useEffect(() => {
        fetchIpData();
    }, [fetchIpData]);

    return { ipv4, ipv6, localIp, ipInfo, loading, error, fetchIpData };
};


export const useSystemInfo = () => {
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        setSystemInfo({
            userAgent: userAgent,
            browser: getBrowser(userAgent),
            os: getOS(userAgent),
            screenResolution: `${window.screen.width} x ${window.screen.height}`,
            devicePixelRatio: window.devicePixelRatio
        });
    }, []);

    return systemInfo;
};


export const useIntersectionObserver = (sectionRefs: { [key in SectionId]: React.RefObject<HTMLElement> }) => {
    const [activeSection, setActiveSection] = useState<SectionId>('overview');
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id as SectionId);
                    }
                });
            },
            { rootMargin: '-30% 0px -70% 0px', threshold: 0 }
        );

        const refs = Object.values(sectionRefs);
        refs.forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            refs.forEach(ref => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionRefs.overview, sectionRefs.details, sectionRefs.tools, sectionRefs.system]);

    return activeSection;
};
