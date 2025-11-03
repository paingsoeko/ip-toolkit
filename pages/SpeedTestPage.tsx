import React, { useState, useEffect } from 'react';
import { secureFetch } from '../utils';
import { ToolPageLayout } from '../components';

const speedToPercentage = (speed: number) => {
    const MAX_SPEED_LOG = Math.log10(1000); // Max speed of 1000 Mbps for visual scaling
    const MIN_SPEED_LOG = Math.log10(0.1);  // Min speed of 0.1 Mbps
    if (speed <= 0.1) return 0;
    const speedLog = Math.log10(speed);
    const percentage = ((speedLog - MIN_SPEED_LOG) / (MAX_SPEED_LOG - MIN_SPEED_LOG)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
};

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

        const duration = 2000;
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

        const testFileSize = 10 * 1024 * 1024;
        const testFileUrl = 'https://speed.cloudflare.com/__down';
        
        await new Promise(resolve => setTimeout(resolve, 400));
        
        setTestState('testing');
        const startTime = Date.now();

        try {
            const response = await secureFetch(`${testFileUrl}?bytes=${testFileSize}&t=${new Date().getTime()}`);
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

const SpeedTestPage = ({ onBack }: { onBack: () => void }) => {
    return (
        <ToolPageLayout 
            title="Download Speed Test"
            description="Measure your connection's download bandwidth."
            onBack={onBack}
        >
            <SpeedTest />
        </ToolPageLayout>
    );
};

export default SpeedTestPage;
