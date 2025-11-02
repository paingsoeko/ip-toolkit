import React from 'react';
import { SectionId } from './types';
import { HomeIcon, ServerIcon, SpeedometerIcon, DesktopIcon } from './components';

const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: <HomeIcon/> },
    { id: 'details', label: 'Details', icon: <ServerIcon/> },
    { id: 'tools', label: 'Tools', icon: <SpeedometerIcon/> },
    { id: 'system', label: 'System', icon: <DesktopIcon/> },
];

const TopNav = ({ activeSection }: { activeSection: SectionId }) => {
    const handleNavClick = (sectionId: SectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <nav className="top-nav">
            <div className="nav-container">
                <span className="nav-logo">IP & Network Toolkit</span>
                <div className="nav-links">
                    {NAV_ITEMS.map(({ id, label, icon }) => (
                        <button 
                            key={id} 
                            onClick={() => handleNavClick(id as SectionId)}
                            className={activeSection === id ? 'active' : ''}
                            aria-label={label}
                        >
                            {icon}
                            <span className="nav-label">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default TopNav;
