import React, { useState } from 'react';
import { IpDisplayBoxProps, InfoRowProps } from './types';

// --- Icon Components (Google Material Symbols) --- //
export const CopyIcon = () => <span className="material-symbols-outlined">content_copy</span>;
export const CheckIcon = () => <span className="material-symbols-outlined">check</span>;
export const LocationIcon = () => <span className="material-symbols-outlined">location_on</span>;
export const BuildingIcon = () => <span className="material-symbols-outlined">business</span>;
export const ClockIcon = () => <span className="material-symbols-outlined">schedule</span>;
export const ServerIcon = () => <span className="material-symbols-outlined">dns</span>;
export const RouterIcon = () => <span className="material-symbols-outlined">router</span>;
export const RefreshIcon = () => <span className="material-symbols-outlined">refresh</span>;
export const SpeedometerIcon = () => <span className="material-symbols-outlined">speed</span>;
export const SignalIcon = () => <span className="material-symbols-outlined">network_check</span>;
export const BrowserIcon = () => <span className="material-symbols-outlined">web</span>;
export const DesktopIcon = () => <span className="material-symbols-outlined">desktop_windows</span>;
export const HomeIcon = () => <span className="material-symbols-outlined">home</span>;
export const CodeIcon = () => <span className="material-symbols-outlined">code</span>;
export const DnsIcon = () => <span className="material-symbols-outlined">dns</span>;
export const WhoisIcon = () => <span className="material-symbols-outlined">person_search</span>;
export const XIcon = () => <span className="material-symbols-outlined">close</span>;
export const BackIcon = () => <span className="material-symbols-outlined">arrow_back</span>;
export const HubIcon = () => <span className="material-symbols-outlined">hub</span>;
export const AccountTreeIcon = () => <span className="material-symbols-outlined">account_tree</span>;


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

// --- New Layout Component --- //
export const ToolPageLayout = ({ title, description, onBack, children }: { title: string, description: string, onBack: () => void, children: React.ReactNode }) => (
    <div className="tool-page-container">
        <header className="tool-page-header">
            <button onClick={onBack} className="back-btn" aria-label="Back to toolkit">
                <BackIcon />
                <span>Back</span>
            </button>
            <div className="tool-page-title-group">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </header>
        <main className="tool-page-content">
            {children}
        </main>
    </div>
);