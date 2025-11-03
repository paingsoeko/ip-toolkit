import React, { useState, useEffect } from 'react';
import { CidrResult } from '../types';
import { calculateCidr, parseAndValidateCidr } from '../cidr';
import { ToolPageLayout } from '../components';

const CidrCalculator = ({ defaultIp }: { defaultIp: string | null }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CidrResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (defaultIp) {
            setQuery(`${defaultIp}/24`);
        } else {
            setQuery('192.168.1.1/24');
        }
    }, [defaultIp]);

    useEffect(() => {
        // Automatically calculate on first load if query is valid
        if (query) {
            handleCalculate();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCalculate = () => {
        setError(null);
        setResults(null);
        const validationResult = parseAndValidateCidr(query);

        if ('error' in validationResult) {
            setError(validationResult.error);
            return;
        }

        const calcResults = calculateCidr(validationResult.ip, validationResult.prefix);
        setResults(calcResults);
    };

    const ResultItem = ({ label, value }: { label: string, value: string | number | null }) => (
        <div className="cidr-result-item">
            <span className="cidr-result-label">{label}</span>
            <span className="cidr-result-value">{value?.toLocaleString() ?? 'N/A'}</span>
        </div>
    );
    
    const ResultItemSmall = ({ label, value }: { label: string, value: string | number | null }) => (
         <div className="cidr-result-item">
            <span className="cidr-result-label">{label}</span>
            <span className="cidr-result-value cidr-result-value-sm">{value?.toLocaleString() ?? 'N/A'}</span>
        </div>
    );

    return (
        <div className="tool-panel">
            <div className="tool-input-group">
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="e.g., 192.168.1.1/24" 
                    aria-label="IP Address and CIDR Prefix" 
                    onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                />
                <button className="tool-btn" onClick={handleCalculate} disabled={!query}>Calculate</button>
            </div>
            {error && <div className="tool-error">{error}</div>}
            {results && (
                <div className="cidr-results-grid">
                    <ResultItem label="Network Address" value={results.networkAddress} />
                    <ResultItem label="Broadcast Address" value={results.broadcastAddress} />
                    <ResultItem label="First Usable Host" value={results.firstHost} />
                    <ResultItem label="Last Usable Host" value={results.lastHost} />
                    <ResultItemSmall label="Subnet Mask" value={results.subnetMask} />
                    <ResultItemSmall label="Wildcard Mask" value={results.wildcardMask} />
                    <ResultItemSmall label="Total Hosts" value={results.totalHosts} />
                    <ResultItemSmall label="Usable Hosts" value={results.usableHosts} />
                    <ResultItemSmall label="IP Type" value={results.ipType} />
                </div>
            )}
        </div>
    );
};

const CidrCalculatorPage = ({ onBack, defaultIp }: { onBack: () => void, defaultIp: string | null }) => {
    return (
        <ToolPageLayout 
            title="IPv4 CIDR Calculator"
            description="Calculate network details from an IP and CIDR prefix."
            onBack={onBack}
        >
            <CidrCalculator defaultIp={defaultIp} />
        </ToolPageLayout>
    );
};

export default CidrCalculatorPage;