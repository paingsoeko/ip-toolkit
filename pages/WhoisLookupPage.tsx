import React, { useState } from 'react';
import { secureFetch } from '../utils';
import { ToolPageLayout } from '../components';

const WhoisResultsDisplay = ({ data }: { data: any }) => {
    if (!data) return null;

    const renderSimpleKV = (obj: object, title: string) => {
        const entries = Object.entries(obj).filter(
            ([key]) => !['objectClassName', 'events', 'entities', 'nameservers', 'status', 'rdapConformance', 'notices'].includes(key)
        );
        if (entries.length === 0) return null;

        return (
            <div className="whois-section">
                <h4 className="whois-section-title">{title}</h4>
                {entries.map(([key, value]) => {
                    let displayValue;
                    if (key.toLowerCase().includes('date')) {
                        displayValue = new Date(value).toLocaleString();
                    } else if (typeof value === 'string' && value.startsWith('http')) {
                        displayValue = <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
                    } else {
                        displayValue = String(value);
                    }
                    return (
                        <div className="whois-kv-pair" key={key}>
                            <div className="whois-key">{key.replace(/_/g, ' ')}</div>
                            <div className="whois-value">{displayValue}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderList = (items: any[], title: string, renderItem: (item: any, index: number) => React.ReactNode) => {
        if (!items || items.length === 0) return null;
        return (
            <div className="whois-section">
                <h4 className="whois-section-title">{title}</h4>
                <div className="whois-list">
                    {items.map(renderItem)}
                </div>
            </div>
        );
    };

    const renderVCard = (vcard: any) => {
        if (!vcard?.[1]) return <p>Contact details not public.</p>;
        return vcard[1].map((prop: any[], index: number) => (
            <div className="whois-kv-pair" key={index}>
                <div className="whois-key">{prop[0]}</div>
                <div className="whois-value">{Array.isArray(prop[3]) ? prop[3].join(', ') : prop[3]}</div>
            </div>
        ));
    };

    return (
        <div className="whois-results-container">
            {renderSimpleKV(data, 'General Information')}
            
            {renderList(data.status, 'Domain Status', (status: string, index: number) => (
                <div className="whois-list-item" key={index}>{status}</div>
            ))}
            
            {renderList(data.events, 'Dates & Events', (event: any, index: number) => (
                <div className="whois-kv-pair" key={index}>
                    <div className="whois-key">{event.eventAction}</div>
                    <div className="whois-value">{new Date(event.eventDate).toLocaleString()}</div>
                </div>
            ))}
            
            {renderList(data.nameservers, 'Nameservers', (ns: any, index: number) => (
                <div className="whois-list-item" key={index}>{ns.ldhName}</div>
            ))}

            {renderList(data.entities, 'Contacts', (entity: any, index: number) => (
                 <div className="whois-contact" key={index}>
                    <h5 className="whois-contact-role">{entity.roles?.join(', ')}</h5>
                    {renderVCard(entity.vcardArray)}
                 </div>
            ))}
        </div>
    );
};

const WhoisLookup = () => {
    const [whoisQuery, setWhoisQuery] = useState<string>('google.com');
    const [whoisResults, setWhoisResults] = useState<any | null>(null);
    const [isWhoisLoading, setIsWhoisLoading] = useState<boolean>(false);
    const [whoisError, setWhoisError] = useState<string | null>(null);

    const handleWhoisLookup = async () => {
        if (!whoisQuery) return;
        setIsWhoisLoading(true);
        setWhoisResults(null);
        setWhoisError(null);
        try {
            const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(whoisQuery) || whoisQuery.includes(':');
            const url = `https://rdap.org/${isIp ? 'ip' : 'domain'}/${encodeURIComponent(whoisQuery)}`;
            
            const response = await secureFetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.description || `Could not find info for "${whoisQuery}". Status: ${response.status}`);
            }
            
            const data = await response.json();
            setWhoisResults(data);
        } catch (err: any) {
            setWhoisError(err.message || "WHOIS lookup failed.");
        } finally {
            setIsWhoisLoading(false);
        }
    };

    return (
        <div className="tool-panel">
            <div className="tool-input-group">
                <input type="text" value={whoisQuery} onChange={(e) => setWhoisQuery(e.target.value)} placeholder="e.g., google.com or 8.8.8.8" aria-label="Domain or IP for WHOIS lookup" onKeyDown={(e) => e.key === 'Enter' && handleWhoisLookup()}/>
                <button className="tool-btn" onClick={handleWhoisLookup} disabled={isWhoisLoading || !whoisQuery}>{isWhoisLoading ? 'Querying...' : 'Query'}</button>
            </div>
            {whoisError && <div className="tool-error">{whoisError}</div>}
            {isWhoisLoading && <div className="loading-dots" style={{ marginTop: '1rem' }}><span>.</span><span>.</span><span>.</span></div>}
            {whoisResults && <div className="tool-results" style={{maxHeight: '450px'}}><WhoisResultsDisplay data={whoisResults} /></div>}
        </div>
    );
};

const WhoisLookupPage = ({ onBack }: { onBack: () => void }) => {
    return (
        <ToolPageLayout 
            title="WHOIS Lookup"
            description="Get registration data for a domain or IP."
            onBack={onBack}
        >
            <WhoisLookup />
        </ToolPageLayout>
    );
};

export default WhoisLookupPage;
