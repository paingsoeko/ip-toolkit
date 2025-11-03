import React, { useState, useEffect } from 'react';
import { PingHistoryItem } from '../types';
import { getLatencyClass, secureFetch } from '../utils';
import { ToolPageLayout } from '../components';

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
                await secureFetch(`${url}?t=${new Date().getTime()}`, { cache: 'no-store', mode: 'no-cors' });
                const latency = Date.now() - startTime;
                currentTestResults[name] = latency;
            } catch (e) {
                console.error(`Ping failed for ${name}:`, e);
                currentTestResults[name] = null;
            }
            setPingResults(prev => ({...prev, [name]: currentTestResults[name] }));
        }
        
        const newHistoryItem: PingHistoryItem = {
            date: new Date().toISOString(),
            results: currentTestResults
        };
        
        const updatedHistory = [newHistoryItem, ...pingHistory].slice(0, 20);
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

const LatencyTestPage = ({ onBack }: { onBack: () => void }) => {
    return (
        <ToolPageLayout 
            title="Network Latency Test"
            description="Test response time to major services."
            onBack={onBack}
        >
            <LatencyTest />
        </ToolPageLayout>
    );
};

export default LatencyTestPage;
