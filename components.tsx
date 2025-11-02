import React, { useState } from 'react';
import { IpDisplayBoxProps, InfoRowProps } from './types';

// --- SVG Icon Components --- //
export const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

export const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"></path>
  </svg>
);

export const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
);

export const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export const ServerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
);

export const RouterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6.5 14h.01"/><path d="M10.5 14h.01"/><path d="M14.5 14h.01"/><path d="M18.5 14h.01"/><path d="M17.5 4a2.5 2.5 0 0 1-5 0"/><path d="M12.5 4a2.5 2.5 0 0 1-5 0"/><path d="M12 8V4"/></svg>
);

export const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export const SpeedometerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-9.4 13.5l8.5 8.5a10 10 0 0 0 13.5-9.4A10 10 0 0 0 12 2Z"/><path d="m12 12-4-4"/></svg>
);

export const SignalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a8 8 0 0 1 14 0"/><path d="M1.75 9.4a12 12 0 0 1 20.5 0"/><path d="M9 16.5a4 4 0 0 1 6 0"/></svg>
);

export const BrowserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20"/><path d="M5 6h2"/><path d="M9 6h2"/></svg>
);

export const DesktopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
);

export const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

export const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

export const DnsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.2 7.2a4 4 0 0 1 0 5.6l-2.8 2.8a4 4 0 0 1-5.6 0 4 4 0 0 1 0-5.6l2.8-2.8a4 4 0 0 1 5.6 0z"/><path d="M6.8 16.8a4 4 0 0 1 0-5.6l2.8-2.8a4 4 0 0 1 5.6 0"/></svg>
);

export const WhoisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


// --- Placeholder Components --- //
export const HeroPlaceholder = () => (
    <header className="hero-header placeholder-shimmer">
        <div className="placeholder-line" style={{ width: '200px', height: '20px', marginBottom: '1rem' }}></div>
        <div className="placeholder-line" style={{ width: '350px', height: '48px', marginBottom: '1.5rem' }}></div>
        <div className="placeholder-line" style={{ width: '120px', height: '48px', borderRadius: '8px' }}></div>
    </header>
);

export const MapPlaceholder = () => (
    <div id="map" className="map-placeholder placeholder-shimmer"></div>
);

export const InfoRowPlaceholder = () => (
    <div className="info-row placeholder-shimmer">
        <div className="info-icon placeholder-circle"></div>
        <div className="info-text">
            <div className="placeholder-line" style={{ width: '100px', height: '12px', marginBottom: '8px' }}></div>
            <div className="placeholder-line" style={{ width: '150px', height: '16px' }}></div>
        </div>
    </div>
);


// --- Reusable Components --- //
export const IpDisplayBox = React.memo(({ type, ip }: IpDisplayBoxProps) => {
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


export const InfoRow = React.memo(({ icon, label, value, href }: InfoRowProps) => {
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
        return <a href={href} target="_blank" rel="noopener noreferrer" className="info-row-link">{content}</a>;
    }

    return content;
});
