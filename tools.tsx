import React from 'react';
import { ToolId } from './types';
import { SpeedometerIcon, SignalIcon, DnsIcon, WhoisIcon, AccountTreeIcon } from './components';

const toolData = [
    { 
        id: 'speed' as ToolId, 
        title: 'Speed Test', 
        description: 'Measure your connection\'s download bandwidth against a global network.', 
        icon: <SpeedometerIcon /> 
    },
    { 
        id: 'latency' as ToolId, 
        title: 'Latency Test', 
        description: 'Check the response time (ping) to major online services like Google and Cloudflare.', 
        icon: <SignalIcon /> 
    },
    { 
        id: 'dns' as ToolId, 
        title: 'DNS Lookup', 
        description: 'Find common DNS records (A, AAAA, MX, TXT, etc.) for any domain name.', 
        icon: <DnsIcon /> 
    },
    { 
        id: 'whois' as ToolId, 
        title: 'WHOIS Lookup', 
        description: 'Retrieve public registration data and contact information for a domain or IP.', 
        icon: <WhoisIcon /> 
    },
    {
        id: 'cidr' as ToolId,
        title: 'CIDR Calculator',
        description: 'Calculate network ranges, subnets, and host information from an IP and CIDR prefix.',
        icon: <AccountTreeIcon />
    },
];

const ToolCard = ({ id, title, description, icon, onNavigate }: { id: ToolId, title: string, description: string, icon: React.ReactNode, onNavigate: (tool: ToolId) => void }) => (
    <div className="tool-card">
        <div className="tool-card-icon">{icon}</div>
        <div className="tool-card-content">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
        <button className="tool-card-btn" onClick={() => onNavigate(id)}>Open Tool</button>
    </div>
);

export const NetworkTools = ({ onNavigate }: { onNavigate: (tool: ToolId) => void }) => {
    return (
        <div className="tool-card-grid">
            {toolData.map(tool => (
                <ToolCard key={tool.id} {...tool} onNavigate={onNavigate} />
            ))}
        </div>
    );
};