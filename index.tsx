
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';

declare const L: any; // Use Leaflet from CDN

// --- SVG Icon Components --- //
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"></path>
  </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const ServerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
);

const RouterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6.5 14h.01"/><path d="M10.5 14h.01"/><path d="M14.5 14h.01"/><path d="M18.5 14h.01"/><path d="M17.5 4a2.5 2.5 0 0 1-5 0"/><path d="M12.5 4a2.5 2.5 0 0 1-5 0"/><path d="M12 8V4"/></svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);


// --- Data Types --- //
interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  hostname: string;
}

// --- Component Prop Types --- //
interface IpDisplayBoxProps {
    type: string;
    ip: string | null;
}

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | undefined | null;
    href?: string;
}

interface MapDisplayProps {
    coords: [number, number] | null;
    city: string;
}

// --- Placeholder Components --- //
const IpDisplayBoxPlaceholder = ({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) => (
    <div className={`ip-display-box placeholder-shimmer ${variant === 'primary' ? 'ip-primary-placeholder' : 'ip-secondary'}`}>
        <div className="ip-details">
            <div className="placeholder-line" style={{ width: '80px', height: '12px', marginBottom: '8px' }}></div>
            <div className="placeholder-line" style={{ width: '150px', height: variant === 'primary' ? '28px' : '20px' }}></div>
        </div>
    </div>
);

const MapPlaceholder = () => (
    <div id="map" className="map-placeholder placeholder-shimmer"></div>
);

const InfoRowPlaceholder = () => (
    <div className="info-row placeholder-shimmer">
        <div className="info-icon">
            <div className="placeholder-circle"></div>
        </div>
        <div className="info-text">
            <div className="placeholder-line" style={{ width: '100px', height: '12px', marginBottom: '8px' }}></div>
            <div className="placeholder-line" style={{ width: '150px', height: '16px' }}></div>
        </div>
    </div>
);


// --- Reusable Components --- //
const IpDisplayBox = React.memo(({ type, ip }: IpDisplayBoxProps) => {
    const [copied, setCopied] = useState(false);
    const isAvailable = ip !== null && ip !== 'N/A' && ip !== 'Not Detected';
    const displayIp = isAvailable ? ip : 'Not Detected';

    const handleCopy = () => {
        if (isAvailable && navigator.clipboard && ip) {
            navigator.clipboard.writeText(ip).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text.');
            });
        }
    };
    
    return (
        <div className={`ip-display-box ${!isAvailable ? 'not-detected' : ''}`}>
            <div className="ip-details">
                <span className="ip-version">{type}</span>
                <span className="ip-address">{ip === null ? '...' : displayIp}</span>
            </div>
            {isAvailable && (
                <button className="copy-btn" onClick={handleCopy} aria-label={`Copy ${type} address`}>
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
            )}
        </div>
    );
});


const InfoRow = React.memo(({ icon, label, value, href }: InfoRowProps) => {
    const content = (
        <div className={`info-row ${href ? 'info-row-clickable' : ''}`}>
            <div className="info-icon">{icon}</div>
            <div className="info-text">
                <span className="info-label">{label}</span>
                <span className="info-value">{value || 'N/A'}</span>
            </div>
        </div>
    );

    if (href && value && value !== 'N/A') {
        return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
    }

    return content;
});

const MapDisplay = React.memo(({ coords, city }: MapDisplayProps) => {
    const mapRef = useRef(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current && coords && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView(coords, 12);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstance.current);
            L.marker(coords).addTo(mapInstance.current).bindPopup(`<b>${city}</b>`).openPopup();
            L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
        } else if (mapInstance.current && coords) {
            mapInstance.current.setView(coords, 12);
            mapInstance.current.eachLayer((layer: any) => {
                if (layer instanceof L.Marker) {
                    mapInstance.current.removeLayer(layer);
                }
            });
            L.marker(coords).addTo(mapInstance.current).bindPopup(`<b>${city}</b>`).openPopup();
        }
    }, [coords, city]);

    return <div id="map" ref={mapRef}></div>;
});

const Footer = () => (
    <footer className="card-footer">
        <p>
            Our IP lookup tool provides real-time data about your public and local network connection,
            including ISP, hostname, and an interactive map of your approximate location.
        </p>
        <p className="copyright">
            &copy; {new Date().getFullYear()} IP & Network Toolkit. All Rights Reserved.
        </p>
    </footer>
);

const App = () => {
  const [ipv4, setIpv4] = useState<string | null>(null);
  const [ipv6, setIpv6] = useState<string | null>(null);
  const [localIp, setLocalIp] = useState<string | null>(null);
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');

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
      // Timeout to prevent hanging
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
      // This is not awaited, it runs in parallel and sets its state when done.
      fetchLocalIp();

      // Await the essential IP data.
      const [ipv4Res, ipv6Res] = await Promise.allSettled([
        fetch('https://api.ipify.org?format=json', { cache: 'no-store' }).then(res => res.json()),
        fetch('https://api64.ipify.org?format=json', { cache: 'no-store' }).then(res => res.json())
      ]);

      const newIpv4 = ipv4Res.status === 'fulfilled' ? ipv4Res.value.ip : 'Not Detected';
      const newIpv6 = 'Not Detected';
      
      // Show IPs as soon as they are fetched
      setIpv4(newIpv4);
      setIpv6(newIpv6);

      const geoLookupIp = newIpv4 !== 'N/A' && newIpv4 !== 'Not Detected' ? newIpv4 : (newIpv6 !== 'N/A' && newIpv6 !== 'Not Detected' ? newIpv6 : null);

      if (geoLookupIp) {
        // Fetch optional geo data without awaiting it.
        // This makes the UI update with IP info faster.
        // Errors are caught and handled locally, preventing a global error state.
        fetch(`https://ipinfo.io/${geoLookupIp}/json`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            console.warn(`Failed to fetch geo information. Status: ${response.statusText}`);
            return null; // Resolve with null on error to handle gracefully
          })
          .then((data: IpInfo | null) => {
            setIpInfo(data);
          })
          .catch(err => {
            console.warn("Error processing geo information:", err);
            setIpInfo(null); // Ensure state is null on any failure
          });
      } else {
        console.warn("Could not determine a public IP for geolocation.");
      }
    } catch (err: any) {
      console.error("Failed to fetch primary IP data:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      // setLoading(false) is called after IPs are fetched, but before geo data might be ready.
      // This makes the app feel faster.
      setLoading(false);
    }
  }, [fetchLocalIp]);

  useEffect(() => {
    fetchIpData();
  }, [fetchIpData]);
  
  const showGeoPlaceholders = !ipInfo && (!!ipv4 || !!ipv6) && (ipv4 !== 'Not Detected' || ipv6 !== 'Not Detected');

  return (
    <div className="container">
      <main className="ip-info-card">
        <header className="card-header">
          <div className="title-wrapper">
            <h1>IP & Network Toolkit</h1>
            <p>Your complete network diagnostic tool.</p>
          </div>
          <button 
            className={`refresh-btn ${loading ? 'loading' : ''}`} 
            onClick={fetchIpData} 
            disabled={loading}
            aria-label="Refresh IP Information"
          >
            <RefreshIcon />
          </button>
        </header>

        {error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <nav className="tab-nav">
              <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
              <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
            </nav>
            <div className="tab-content">
              <div className={`tab-pane ${activeTab === 'overview' ? 'active' : ''}`}>
                {loading ? (
                  <>
                    <div className="ip-layout">
                      <div className="ip-primary">
                        <IpDisplayBoxPlaceholder variant="primary" />
                      </div>
                      <div className="ip-secondary">
                        <IpDisplayBoxPlaceholder variant="secondary" />
                      </div>
                    </div>
                    <MapPlaceholder />
                  </>
                ) : (
                  <>
                    <div className="ip-layout">
                      <div className="ip-primary">
                        <IpDisplayBox type="IPv4 Address" ip={ipv4} />
                      </div>
                      <div className="ip-secondary">
                        <IpDisplayBox type="IPv6 Address" ip={ipv6} />
                      </div>
                    </div>
                    {ipInfo && ipInfo.loc ? (
                      <MapDisplay 
                        coords={ipInfo.loc.split(',').map(Number) as [number, number]} 
                        city={ipInfo.city || 'Unknown'} 
                      />
                    ) : (
                      <div id="map" className={`map-placeholder ${showGeoPlaceholders ? 'placeholder-shimmer' : ''}`}>
                        {!showGeoPlaceholders && (
                          <div className="map-placeholder-message">
                            Geolocation data not available
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className={`tab-pane ${activeTab === 'details' ? 'active' : ''}`}>
                {loading ? (
                  <div className="info-grid">
                    {[...Array(6)].map((_, i) => <InfoRowPlaceholder key={i} />)}
                  </div>
                ) : (
                  <div className="info-grid">
                    <InfoRow icon={<RouterIcon />} label="Local IP Address" value={localIp} />
                    {ipInfo ? (
                      <>
                        <InfoRow 
                          icon={<BuildingIcon/>} 
                          label="Service Provider (ISP)" 
                          value={ipInfo?.org} 
                          href={ipInfo?.org ? `https://www.google.com/search?q=${encodeURIComponent(ipInfo.org)}` : undefined} 
                        />
                        <InfoRow 
                          icon={<LocationIcon />} 
                          label="Location" 
                          value={ipInfo ? `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}` : 'N/A'} 
                          href={ipInfo?.loc ? `https://www.google.com/maps/search/?api=1&query=${ipInfo.loc}`: undefined} 
                        />
                        <InfoRow 
                          icon={<ServerIcon />} 
                          label="Hostname" 
                          value={ipInfo?.hostname} 
                          href={ipInfo?.hostname ? `https://www.google.com/search?q=${encodeURIComponent(ipInfo.hostname)}` : undefined} 
                        />
                        <InfoRow icon={<ClockIcon />} label="Timezone" value={ipInfo?.timezone} />
                        <InfoRow icon={<LocationIcon />} label="Postal Code" value={ipInfo?.postal} />
                      </>
                    ) : showGeoPlaceholders ? (
                       <>
                         <InfoRowPlaceholder />
                         <InfoRowPlaceholder />
                         <InfoRowPlaceholder />
                         <InfoRowPlaceholder />
                         <InfoRowPlaceholder />
                       </>
                    ) : (
                        <>
                           <InfoRow icon={<BuildingIcon/>} label="Service Provider (ISP)" value={'N/A'} />
                           <InfoRow icon={<LocationIcon />} label="Location" value={'N/A'} />
                           <InfoRow icon={<ServerIcon />} label="Hostname" value={'N/A'} />
                           <InfoRow icon={<ClockIcon />} label="Timezone" value={'N/A'} />
                           <InfoRow icon={<LocationIcon />} label="Postal Code" value={'N/A'} />
                        </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <Footer />
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
