import React, { useState, useEffect } from 'react';
import { ToolId, DnsRecord, PingHistoryItem } from './types';
import { getLatencyClass } from './utils';
import { SpeedometerIcon, SignalIcon, DnsIcon, WhoisIcon } from './components';

// Helper function to convert speed to a logarithmic percentage for the gauge
const speedToPercentage = (speed: number) => {
    const MAX_SPEED_LOG = Math.log10(1000); // Max speed of 1000 Mbps for visual scaling
    const MIN_SPEED_LOG = Math.log10(0.1);  // Min speed of 0.1 Mbps
    if (speed <= 0.1) return 0;
    const speedLog = Math.log10(speed);
    const percentage = ((speedLog - MIN_SPEED_LOG) / (MAX_SPEED_LOG - MIN_SPEED_LOG)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
};

// Helper function to determine gauge color based on speed
const getSpeedColor = (speed: number | null): string => {
    if (speed === null) return 'var(--accent-color)';
    if (speed < 10) return 'var(--status-high)';
    if (speed < 50) return 'var(--status-moderate)';
    return 'var(--status-good)';
};

const SpeedTest = () => {
    const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
    const [animatedSpeed, setAnimatedSpeed] = useState<number>(0);
    const [animatedGaugeProgress, setAnimatedGaugeProgress] = useState(0);
    const [testState, setTestState] = useState<'idle' | 'connecting' | 'testing' | 'finished' | 'error'>('idle');
    const [speedTestError, setSpeedTestError] = useState<string | null>(null);

    const isTestingSpeed = testState === 'connecting' || testState === 'testing';

    useEffect(() => {
        if (downloadSpeed === null || testState !== 'finished') {
            setAnimatedSpeed(0);
            setAnimatedGaugeProgress(0);
            return;
        }

        let animationFrameId: number;
        const endSpeed = downloadSpeed;
        const endProgress = speedToPercentage(downloadSpeed);
        if (endSpeed === 0) return;

        const duration = 2000; // Longer, smoother animation
        const startTime = performance.now();
        
        const easeOutBack = (x: number): number => {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        };

        const easeOutQuart = (x: number): number => {
            return 1 - Math.pow(1 - x, 4);
        };

        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const numberProgress = easeOutQuart(progress);
            setAnimatedSpeed(numberProgress * endSpeed);
            
            const gaugeProgress = easeOutBack(progress);
            setAnimatedGaugeProgress(gaugeProgress * endProgress);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setAnimatedSpeed(endSpeed);
                setAnimatedGaugeProgress(endProgress);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [downloadSpeed, testState]);

    const handleSpeedTest = async () => {
        setTestState('connecting');
        setDownloadSpeed(null);
        setSpeedTestError(null);

        const testFileSize = 10 * 1024 * 1024; // 10MB
        const testFileUrl = 'https://speed.cloudflare.com/__down';
        
        // Artificial delay to make 'Connecting...' visible
        await new Promise(resolve => setTimeout(resolve, 400));
        
        setTestState('testing');
        const startTime = Date.now();

        try {
            const response = await fetch(`${testFileUrl}?bytes=${testFileSize}&t=${new Date().getTime()}`);
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
            if (!response.body) throw new Error("ReadableStream not supported by browser.");
            
            const reader = response.body.getReader();
            let receivedLength = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                receivedLength += value.length;
            }
            
            const endTime = Date.now();
            const durationInSeconds = (endTime - startTime) / 1000;
            if (durationInSeconds < 0.5) throw new Error("Connection too fast for accurate measurement.");
            
            const bitsLoaded = receivedLength * 8;
            const speedMbps = (bitsLoaded / durationInSeconds) / 1000000;
            setDownloadSpeed(speedMbps);
            setTestState('finished');
        } catch (error: any) {
            console.error("Speed test failed:", error);
            setSpeedTestError(error.message || "The test failed. Please try again.");
            setDownloadSpeed(null);
            setTestState('error');
        }
    };

    const gaugeCircumference = 2 * Math.PI * 44;
    const gaugeColor = getSpeedColor(downloadSpeed);

    return (
        <div className="tool-panel">
            <div className="tool-header"><h3>Download Speed</h3></div>
            <p className="tool-subtitle">Measure your connection's download bandwidth.</p>
            <div className="gauge-display">
                <div className={`gauge-container ${isTestingSpeed ? 'testing' : ''}`}>
                    <svg className="gauge" viewBox="0 0 100 100">
                        <circle className="gauge-bg" cx="50" cy="50" r="44"></circle>
                        <circle 
                            className="gauge-fg" 
                            cx="50" 
                            cy="50" 
                            r="44" 
                            strokeDasharray={gaugeCircumference} 
                            strokeDashoffset={gaugeCircumference * (1 - animatedGaugeProgress / 100)}
                            style={{ stroke: gaugeColor }}
                        ></circle>
                    </svg>
                    <div className="gauge-text">
                        {isTestingSpeed ? (
                            <div className="speed-value testing-text">{testState === 'connecting' ? 'Connecting...' : 'Testing...'}</div>
                        ) : testState === 'finished' && downloadSpeed !== null ? (
                            <div className="speed-value">{animatedSpeed.toFixed(2)}</div>
                        ) : (
                            <div className="speed-value">--</div>
                        )}
                        <div className="speed-unit">Mbps</div>
                    </div>
                    {testState === 'finished' && downloadSpeed !== null && (
                        <div className="gauge-tooltip">
                            Exact: {downloadSpeed.toFixed(4)} Mbps
                        </div>
                    )}
                </div>
            </div>
            {testState === 'error' && speedTestError && <div className="tool-error">{speedTestError}</div>}
            <button className="tool-btn" onClick={handleSpeedTest} disabled={isTestingSpeed}>{isTestingSpeed ? 'Testing...' : 'Start Test'}</button>
        </div>
    );
};

const LatencyTest = () => {
    const [pingResults, setPingResults] = useState<Record<string, number | null>>({});
    const [isPinging, setIsPinging] = useState(false);
    const [pingHistory, setPingHistory] = useState<PingHistoryItem[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('pingTestHistory');
            if (storedHistory) {
                setPingHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load ping history from localStorage:", error);
        }
    }, []);
    
    const handlePingTest = async () => {
        setIsPinging(true);
        setPingResults({}); // Clear current results display
        const targets = {
            'Google': 'https://www.google.com/generate_204',
            'Cloudflare': 'https://speed.cloudflare.com/cdn-cgi/trace',
            'GitHub': 'https://api.github.com',
        };

        const currentTestResults: Record<string, number | null> = {};

        for (const [name, url] of Object.entries(targets)) {
            try {
                const startTime = Date.now();
                await fetch(`${url}?t=${new Date().getTime()}`, { cache: 'no-store', mode: 'no-cors' });
                const latency = Date.now() - startTime;
                currentTestResults[name] = latency;
            } catch (e) {
                console.error(`Ping failed for ${name}:`, e);
                currentTestResults[name] = null;
            }
             // Update the UI progressively for immediate feedback
            setPingResults(prev => ({...prev, [name]: currentTestResults[name] }));
        }
        
        // Save complete result to history
        const newHistoryItem: PingHistoryItem = {
            date: new Date().toISOString(),
            results: currentTestResults
        };
        
        const updatedHistory = [newHistoryItem, ...pingHistory].slice(0, 20); // Keep last 20 results
        setPingHistory(updatedHistory);
        localStorage.setItem('pingTestHistory', JSON.stringify(updatedHistory));
        
        setIsPinging(false);
    };

    const handleClearHistory = () => {
        setPingHistory([]);
        localStorage.removeItem('pingTestHistory');
    };

    const testTargets = ['Google', 'Cloudflare', 'GitHub'];

    return (
        <div className="tool-panel">
            <div className="tool-header"><h3>Network Latency</h3></div>
            <p className="tool-subtitle">Test response time to major services.</p>
            <div className="ping-results">
                {testTargets.map((name) => (
                    <div className="ping-row" key={name}>
                        <div className="ping-target"><span className={`ping-status-dot ${isPinging || !pingResults.hasOwnProperty(name) ? 'pending' : getLatencyClass(pingResults[name])}`}></span>{name}</div>
                        {isPinging && !pingResults.hasOwnProperty(name) ? <span className="ping-value loading-dots"><span>.</span><span>.</span><span>.</span></span> : pingResults.hasOwnProperty(name) ? (pingResults[name] === null ? <span className="ping-value error">Failed</span> : <span className="ping-value">{pingResults[name]} ms</span>) : <span className="ping-value">-- ms</span>}
                    </div>
                ))}
            </div>
            <button className="tool-btn" onClick={handlePingTest} disabled={isPinging}>{isPinging ? 'Pinging...' : 'Run Ping Test'}</button>

            {pingHistory.length > 0 && (
                <div className="ping-history-section">
                    <div className="ping-history-header">
                        <h4>Test History</h4>
                        <button className="clear-history-btn" onClick={handleClearHistory}>Clear History</button>
                    </div>
                    <div className="ping-history-list">
                        {pingHistory.map((item, index) => (
                            <div className="ping-history-item" key={index}>
                                <div className="history-item-header">
                                    {new Date(item.date).toLocaleString()}
                                </div>
                                <div className="history-item-results">
                                    {testTargets.map(target => (
                                        <div className="history-result" key={target}>
                                            <span className="target">{target}:</span>
                                            {item.results[target] === null ? (
                                                <span className="value failed">Failed</span>
                                            ) : (
                                                <span className={`value ${getLatencyClass(item.results[target])}`}>
                                                    {item.results[target]} ms
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

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
                fetch(`https://dns.google/resolve?name=${encodeURIComponent(dnsQuery)}&type=${type}`).then(res => res.json())
            );

            const responses = await Promise.all(requests);
            const typeNameMap = { 1: 'A', 28: 'AAAA', 15: 'MX', 16: 'TXT', 2: 'NS', 5: 'CNAME' };
            
            const finalResults = responses.flatMap(res => 
                res.Answer ? res.Answer.map(ans => ({...ans, typeName: typeNameMap[ans.type] || `Type ${ans.type}`})) : []
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
            <div className="tool-header"><h3>DNS Lookup</h3></div>
            <p className="tool-subtitle">Find DNS records for a domain name.</p>
            <div className="tool-input-group">
                <input type="text" value={dnsQuery} onChange={(e) => setDnsQuery(e.target.value)} placeholder="e.g., google.com" aria-label="Domain for DNS lookup" onKeyDown={(e) => e.key === 'Enter' && handleDnsLookup()}/>
                <button className="tool-btn" onClick={handleDnsLookup} disabled={isDnsLoading || !dnsQuery}>{isDnsLoading ? 'Looking up...' : 'Lookup'}</button>
            </div>
            {dnsError && <div className="tool-error">{dnsError}</div>}
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
        // vcard[1] is the array of properties, e.g., ["fn", {}, "text", "Google LLC"]
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
            
            const response = await fetch(url);
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
            <div className="tool-header"><h3>WHOIS Lookup</h3></div>
            <p className="tool-subtitle">Get registration data for a domain or IP.</p>
            <div className="tool-input-group">
                <input type="text" value={whoisQuery} onChange={(e) => setWhoisQuery(e.target.value)} placeholder="e.g., google.com or 8.8.8.8" aria-label="Domain or IP for WHOIS lookup" onKeyDown={(e) => e.key === 'Enter' && handleWhoisLookup()}/>
                <button className="tool-btn" onClick={handleWhoisLookup} disabled={isWhoisLoading || !whoisQuery}>{isWhoisLoading ? 'Querying...' : 'Query'}</button>
            </div>
            {whoisError && <div className="tool-error">{whoisError}</div>}
            {whoisResults && <div className="tool-results"><WhoisResultsDisplay data={whoisResults} /></div>}
        </div>
    );
};

export const NetworkTools = () => {
    const [activeTool, setActiveTool] = useState<ToolId>('speed');

    const toolTabs = [
        { id: 'speed', label: 'Speed', icon: <SpeedometerIcon /> },
        { id: 'latency', label: 'Latency', icon: <SignalIcon /> },
        { id: 'dns', label: 'DNS', icon: <DnsIcon /> },
        { id: 'whois', label: 'WHOIS', icon: <WhoisIcon /> },
    ];

    return (
        <>
            <div className="tool-tabs">
                {toolTabs.map(tab => (
                    <button 
                        key={tab.id}
                        className={activeTool === tab.id ? 'active' : ''}
                        onClick={() => setActiveTool(tab.id as ToolId)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="tool-content">
                {activeTool === 'speed' && <SpeedTest />}
                {activeTool === 'latency' && <LatencyTest />}
                {activeTool === 'dns' && <DnsLookup />}
                {activeTool === 'whois' && <WhoisLookup />}
            </div>
        </>
    );
};