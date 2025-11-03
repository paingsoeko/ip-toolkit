import React, { useState, useRef } from 'react';
import { useIpData, useSystemInfo, useIntersectionObserver } from './hooks';
import { SectionId, ToolId } from './types';
import TopNav from './TopNav';
import Modal from './Modal';
import MapDisplay from './MapDisplay';
import { NetworkTools } from './tools';
import {
    HeroPlaceholder,
    MapPlaceholder,
    InfoRowPlaceholder,
    IpDisplayBox,
    InfoRow,
    RefreshIcon,
    RouterIcon,
    BuildingIcon,
    LocationIcon,
    ServerIcon,
    ClockIcon,
    BrowserIcon,
    DesktopIcon,
    HomeIcon,
    CodeIcon,
    HubIcon,
} from './components';
import SpeedTestPage from './pages/SpeedTestPage';
import LatencyTestPage from './pages/LatencyTestPage';
import DnsLookupPage from './pages/DnsLookupPage';
import WhoisLookupPage from './pages/WhoisLookupPage';
import CidrCalculatorPage from './pages/CidrCalculatorPage';

// --- Page Content for Modals --- //
const aboutContent = (
    <>
        <p>Welcome to the IP & Network Toolkit, a comprehensive, modern web application designed to provide detailed insights into your network connection. Whether you're a developer, a network administrator, or just curious about your digital footprint, our toolkit offers the information you need in a clean, intuitive, and powerful interface.</p>
        <h3>Our Mission</h3>
        <p>Our goal is to demystify network data and make it accessible to everyone. We believe that understanding your IP address and network performance should be straightforward. This toolkit was built to be a fast, accurate, and beautifully designed utility that puts you in control.</p>
        <h3>Key Features</h3>
        <ul>
            <li><strong>IP Address Detection:</strong> Instantly find your public IPv4 and IPv6 addresses, as well as your local network IP using WebRTC technology.</li>
            <li><strong>Geolocation Insights:</strong> Discover the approximate physical location of your IP address on an interactive map, along with details like your ISP, city, and country.</li>
            <li><strong>Advanced Network Tools:</strong> Go beyond the basics with our suite of built-in tools, including a download speed test, network latency test, DNS record lookup, and WHOIS query tool.</li>
            <li><strong>System Information:</strong> Get a quick overview of your system's setup, including your browser, operating system, and screen resolution.</li>
            <li><strong>User-Focused Design:</strong> We've crafted a sleek, responsive dark-themed UI that's both aesthetically pleasing and highly functional on any device.</li>
        </ul>
        <p>This project is continuously evolving. We're committed to adding new features and improving the toolkit to make it the ultimate destination for network information.</p>
    </>
);

const termsContent = (
    <>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>By accessing and using the IP & Network Toolkit ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>
        <h3>Use of Service</h3>
        <p>This Service is provided for informational purposes only. You agree not to use the Service for any malicious or unlawful activities. The tools provided, such as DNS Lookup and WHOIS, should be used responsibly and not for spamming or any form of harassment.</p>
        <h3>Disclaimer of Warranty</h3>
        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for accuracy, we do not warrant that the information provided (including but not limited to IP addresses, geolocation data, and network speed results) is accurate, complete, reliable, or error-free. Your use of the Service is solely at your own risk.</p>
        <h3>Limitation of Liability</h3>
        <p>In no event shall the creators of the IP & Network Toolkit be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from the use of or inability to use the service.</p>
        <h3>Third-Party Services</h3>
        <p>The Service relies on various third-party APIs (such as ipify, ipinfo.io, and Google DNS) to function. We are not responsible for the availability or accuracy of these third-party services. Their use is subject to their respective terms and privacy policies.</p>
        <h3>Changes to Terms</h3>
        <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>
    </>
);

const privacyContent = (
    <>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect information in relation to our IP & Network Toolkit ("Service").</p>
        <h3>Information We Collect</h3>
        <p>When you use our Service, certain information is automatically collected to provide you with the core functionalities of the toolkit:</p>
        <ul>
            <li><strong>IP Addresses:</strong> Your public IPv4 and IPv6 addresses are fundamental to the Service. We process this information to display it to you and use it to query third-party services for additional details.</li>
            <li><strong>Geolocation Data:</strong> We use your public IP address to query third-party services (like ipinfo.io) to retrieve approximate location data (city, region, country), ISP, and hostname. This data is displayed to you and is not stored by us.</li>
            <li><strong>System Information:</strong> Information about your browser, operating system, and screen resolution is detected client-side and displayed to you. This information is not sent to our servers.</li>
            <li><strong>Tool Usage Data:</strong> When you use tools like the DNS or WHOIS lookup, the domain or IP you enter is sent to the respective third-party service (e.g., Google Public DNS, RDAP) to perform the query. We do not log these queries.</li>
        </ul>
        <h3>How We Use Information</h3>
        <p>The information collected is used solely to provide and operate the Service. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. We do not create user profiles or track you across different websites.</p>
        <h3>Third-Party Services</h3>
        <p>This Service integrates with third-party APIs to provide its features. These services have their own privacy policies, and we encourage you to review them:</p>
        <ul>
            <li><strong>ipify.org:</strong> Used for public IP address detection.</li>
            <li><strong>ipinfo.io:</strong> Used for geolocation and ISP information.</li>
            <li><strong>Google Public DNS:</strong> Used for the DNS Lookup tool.</li>
            <li><strong>Cloudflare:</strong> Used for the speed test.</li>
            <li><strong>RDAP services:</strong> Used for the WHOIS Lookup tool.</li>
        </ul>
        <h3>Data Security</h3>
        <p>We are committed to ensuring that your information is secure. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.</p>
        <h3>Changes to This Policy</h3>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
    </>
);

const MODAL_CONTENT: { [key: string]: { title: string; content: React.ReactNode } } = {
    'about': { title: 'About This Toolkit', content: aboutContent },
    'terms': { title: 'Terms of Service', content: termsContent },
    'privacy': { title: 'Privacy Policy', content: privacyContent },
};

const Section = ({ id, title, children, refProp }: { id: SectionId; title: string; children?: React.ReactNode; refProp: React.RefObject<HTMLElement> }) => (
    <section id={id} className="content-section" ref={refProp}>
        <h2 className="section-title">{title}</h2>
        {children}
    </section>
);

const App = () => {
  const { ipv4, ipv6, localIp, ipInfo, loading, error, fetchIpData } = useIpData();
  const systemInfo = useSystemInfo();
  
  const sectionRefs = {
      overview: useRef<HTMLElement>(null),
      details: useRef<HTMLElement>(null),
      tools: useRef<HTMLElement>(null),
      system: useRef<HTMLElement>(null),
  };
  const activeSection = useIntersectionObserver(sectionRefs);
  
  const [heroCopied, setHeroCopied] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<ToolId | 'main'>('main');

  const handleHeroCopy = () => {
    if (ipv4 && ipv4 !== 'Not Detected' && navigator.clipboard) {
        navigator.clipboard.writeText(ipv4).then(() => {
            setHeroCopied(true);
            setTimeout(() => setHeroCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy IP:', err);
        });
    }
  };
  
  const handleNavigate = (tool: ToolId) => {
    window.scrollTo(0, 0);
    setCurrentPage(tool);
  };

  const handleBack = () => {
    setCurrentPage('main');
  };

  if (error) {
      return <div className="error-fullpage">{error}</div>
  }

  if (currentPage !== 'main') {
    const pageProps = { onBack: handleBack };
    switch (currentPage) {
        case 'speed': return <SpeedTestPage {...pageProps} />;
        case 'latency': return <LatencyTestPage {...pageProps} />;
        case 'dns': return <DnsLookupPage {...pageProps} />;
        case 'whois': return <WhoisLookupPage {...pageProps} />;
        case 'cidr': return <CidrCalculatorPage defaultIp={ipv4} {...pageProps} />;
        default: setCurrentPage('main'); return null;
    }
  }

  const showGeoPlaceholders = !ipInfo && (!!ipv4 || !!ipv6) && (ipv4 !== 'Not Detected' || ipv6 !== 'Not Detected');

  // Parse ASN and ISP from the org string
  const orgString = ipInfo?.org || '';
  const asnMatch = orgString.match(/^(AS\d+)\s?(.*)$/);
  let asn: string | null = null;
  let isp: string | null = orgString || null;
  if (asnMatch) {
      asn = asnMatch[1];
      isp = asnMatch[2].trim() || null;
  }
  
  return (
    <>
      <TopNav activeSection={activeSection} />
      <main className="main-container">
        {loading ? (
          <HeroPlaceholder />
        ) : (
          <header className="hero-header">
              <h1>Your Public IP Address</h1>
              <p 
                className={`hero-ip ${ipv4 && ipv4 !== 'Not Detected' ? 'hero-ip-clickable' : ''}`}
                onClick={handleHeroCopy}
                title={ipv4 && ipv4 !== 'Not Detected' ? 'Click to copy' : ''}
              >
                  {heroCopied ? 'Copied!' : (ipv4 || 'Detecting...')}
              </p>
              <button
                  className={`refresh-btn ${loading ? 'loading' : ''}`}
                  onClick={fetchIpData}
                  disabled={loading}
                  aria-label="Refresh IP Information"
              >
                  <RefreshIcon />
                  <span>Refresh</span>
              </button>
          </header>
        )}
        
        <Section id="overview" title="IP Overview" refProp={sectionRefs.overview}>
          {loading ? (
            <div className="overview-grid">
                <div className="ip-layout">
                  <div className="ip-display-box placeholder-shimmer ip-primary"><div className="placeholder-line" style={{ width: '150px', height: '28px' }}></div></div>
                  <div className="ip-display-box placeholder-shimmer"><div className="placeholder-line" style={{ width: '150px', height: '20px' }}></div></div>
                </div>
                <MapPlaceholder />
            </div>
           ) : (
            <div className="overview-grid">
              <div className="ip-layout">
                <IpDisplayBox type="IPv4 Address" ip={ipv4} />
                <IpDisplayBox type="IPv6 Address" ip={ipv6} />
              </div>
              {ipInfo && ipInfo.loc ? (
                  <MapDisplay coords={ipInfo.loc.split(',').map(Number) as [number, number]} city={ipInfo.city || 'Unknown'} />
              ) : (
                  <div id="map" className={`map-placeholder ${showGeoPlaceholders ? 'placeholder-shimmer' : ''}`}>
                      {!showGeoPlaceholders && <div className="map-placeholder-message">Geolocation data not available</div>}
                  </div>
              )}
            </div>
           )}
        </Section>
        
        <Section id="details" title="Connection Details" refProp={sectionRefs.details}>
          {loading ? (
            <div className="info-grid">
              {[...Array(7)].map((_, i) => <InfoRowPlaceholder key={i} />)}
            </div>
          ) : (
            <div className="info-grid">
              <InfoRow icon={<RouterIcon />} label="Local IP Address" value={localIp} />
              {ipInfo ? (
                <>
                  <InfoRow icon={<BuildingIcon/>} label="Service Provider (ISP)" value={isp} href={isp ? `https://www.google.com/search?q=${encodeURIComponent(isp)}` : undefined} />
                  <InfoRow icon={<HubIcon/>} label="Network Group (ASN)" value={asn} href={asn ? `https://www.google.com/search?q=${encodeURIComponent(asn)}` : undefined} />
                  <InfoRow icon={<LocationIcon />} label="Location" value={ipInfo ? `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}` : 'N/A'} href={ipInfo?.loc ? `https://www.google.com/maps/search/?api=1&query=${ipInfo.loc}`: undefined} />
                  <InfoRow icon={<ServerIcon />} label="Hostname" value={ipInfo?.hostname} href={ipInfo?.hostname ? `https://www.google.com/search?q=${encodeURIComponent(ipInfo.hostname)}` : undefined} />
                  <InfoRow icon={<ClockIcon />} label="Timezone" value={ipInfo?.timezone} />
                  <InfoRow icon={<LocationIcon />} label="Postal Code" value={ipInfo?.postal} />
                </>
              ) : showGeoPlaceholders ? (
                 [...Array(6)].map((_, i) => <InfoRowPlaceholder key={`detail-placeholder-${i}`} />)
              ) : (
                  <>
                     <InfoRow icon={<BuildingIcon/>} label="Service Provider (ISP)" value={'N/A'} />
                     <InfoRow icon={<HubIcon/>} label="Network Group (ASN)" value={'N/A'} />
                     <InfoRow icon={<LocationIcon />} label="Location" value={'N/A'} />
                     <InfoRow icon={<ServerIcon />} label="Hostname" value={'N/A'} />
                     <InfoRow icon={<ClockIcon />} label="Timezone" value={'N/A'} />
                     <InfoRow icon={<LocationIcon />} label="Postal Code" value={'N/A'} />
                  </>
              )}
            </div>
          )}
        </Section>
        
        <Section id="tools" title="Network Tools" refProp={sectionRefs.tools}>
            <NetworkTools onNavigate={handleNavigate} />
        </Section>
        
        <Section id="system" title="System Information" refProp={sectionRefs.system}>
          {systemInfo ? (
            <div className="info-grid">
                <InfoRow icon={<BrowserIcon />} label="Browser" value={systemInfo.browser} />
                <InfoRow icon={<DesktopIcon />} label="Operating System" value={systemInfo.os} />
                <InfoRow icon={<HomeIcon />} label="Screen Resolution" value={systemInfo.screenResolution} />
                <InfoRow icon={<CodeIcon />} label="Device Pixel Ratio" value={systemInfo.devicePixelRatio} />
                <InfoRow icon={<ServerIcon />} label="User Agent" value={systemInfo.userAgent} />
            </div>
           ) : (
            <div className="info-grid">
                {[...Array(5)].map((_, i) => <InfoRowPlaceholder key={i} />)}
            </div>
           )}
        </Section>
      </main>
      <footer className="site-footer">
          <div className="footer-container">
              <p>&copy; {new Date().getFullYear()} IP & Network Toolkit. All Rights Reserved.</p>
              <nav className="footer-nav">
                 <button onClick={() => setActiveModal('about')}>About</button>
                 <button onClick={() => setActiveModal('terms')}>Terms of Service</button>
                 <button onClick={() => setActiveModal('privacy')}>Privacy Policy</button>
              </nav>
          </div>
      </footer>
      
      <Modal 
        show={activeModal !== null} 
        onClose={() => setActiveModal(null)} 
        title={activeModal ? MODAL_CONTENT[activeModal].title : ''}
      >
        {activeModal ? MODAL_CONTENT[activeModal].content : null}
      </Modal>
    </>
  );
};

export default App;