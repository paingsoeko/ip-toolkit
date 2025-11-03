import React, { useState } from 'react';
import { DnsRecord } from '../types';
import { secureFetch } from '../utils';
import { ToolPageLayout } from '../components';

const DnsLookup = () => {
    const [dnsQuery, setDnsQuery] = useState<string>('google.com');
    const [dnsResults, setDnsResults] = useState<DnsRecord[] | null>(null);
    const [isDnsLoading, setIsDnsLoading] = useState<boolean>(false);
    const [dnsError, setDnsError] = useState<string | null>(null);

    const handleDnsLookup = async () => {
        if (!dnsQuery) return;
        setIsDnsLoading(true);
        setDnsResults(null);
        setDnsError(null);
        try {
            const recordTypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];
            const requests = recordTypes.map(type =>
                secureFetch(`https://dns.google/resolve?name=${encodeURIComponent(dnsQuery)}&type=${type}`).then(res => res.json())
            );

            const responses = await Promise.all(requests);
            const typeNameMap: { [key: number]: string } = { 1: 'A', 28: 'AAAA', 15: 'MX', 16: 'TXT', 2: 'NS', 5: 'CNAME' };
            
            const finalResults = responses.flatMap(res => 
                res.Answer ? res.Answer.map((ans: DnsRecord) => ({...ans, typeName: typeNameMap[ans.type] || `Type ${ans.type}`})) : []
            ).sort((a, b) => a.type - b.type);

            if (finalResults.length === 0) {
                setDnsError(`No common DNS records found for "${dnsQuery}".`);
            } else {
                setDnsResults(finalResults);
            }
        } catch (err) {
            setDnsError("Failed to fetch DNS records. Please check the domain and your connection.");
        } finally {
            setIsDnsLoading(false);
        }
    };

    return (
        <div className="tool-panel">
            <div className="tool-input-group">
                <input type="text" value={dnsQuery} onChange={(e) => setDnsQuery(e.target.value)} placeholder="e.g., google.com" aria-label="Domain for DNS lookup" onKeyDown={(e) => e.key === 'Enter' && handleDnsLookup()}/>
                <button className="tool-btn" onClick={handleDnsLookup} disabled={isDnsLoading || !dnsQuery}>{isDnsLoading ? 'Looking up...' : 'Lookup'}</button>
            </div>
            {dnsError && <div className="tool-error">{dnsError}</div>}
            {isDnsLoading && <div className="loading-dots" style={{ marginTop: '1rem' }}><span>.</span><span>.</span><span>.</span></div>}
            {dnsResults && (
                <div className="tool-results dns-results-container">
                    {dnsResults.map((record, index) => (
                        <div className="dns-record" key={`${index}-${record.data}`}>
                            <span className="dns-record-type">{record.typeName}</span>
                            <span className="dns-record-data">{record.data}</span>
                            <span className="dns-record-ttl">TTL: {record.TTL}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const DnsLookupPage = ({ onBack }: { onBack: () => void }) => {
    return (
        <ToolPageLayout 
            title="DNS Lookup"
            description="Find DNS records for a domain name."
            onBack={onBack}
        >
            <DnsLookup />
        </ToolPageLayout>
    );
};

export default DnsLookupPage;
