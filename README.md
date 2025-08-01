# IP & Network Toolkit

A modern, feature-rich web application designed to provide detailed insights into your network connection. This tool fetches and displays your public IPv4/IPv6 addresses, local IP, geolocation data, ISP, hostname, and more in a professional, dark-themed interface.

## ✨ Features

*   **Public IP Detection:** Instantly finds and displays your public IPv4 and IPv6 addresses.
*   **Local IP Detection:** Uses WebRTC to discover and show your local network IP address (e.g., `192.168.x.x`).
*   **Detailed Geolocation:** Provides comprehensive location information, including city, region, country, and postal code.
*   **Interactive Map:** Visually pinpoints your IP's approximate location on a dynamic, dark-themed map powered by Leaflet.js.
*   **Network Information:** Displays your Internet Service Provider (ISP) and hostname.
*   **Comprehensive Network Tools:**
    *   **Download Speed Test:** Measure your connection's download bandwidth against Cloudflare's network.
    *   **Latency Test:** Ping major services like Google, Cloudflare, and GitHub to check network latency.
    *   **DNS Lookup:** Retrieve common DNS records (A, AAAA, MX, TXT, NS, CNAME) for any domain.
    *   **WHOIS Lookup:** Get public registration data for any domain or IP address using RDAP.
*   **System Information:** Shows details about your browser, OS, screen resolution, and more.
*   **Modern Dark UI:** Features a sleek, dark-themed design with a "glassmorphism" sticky top navigation bar for smooth scrolling between sections. The interface is clean, responsive, and looks great on all devices.
*   **Clickable Details:** Allows you to click on your ISP, hostname, or location to perform a quick web search or view it on Google Maps.
*   **Copy to Clipboard:** Easily copy your IP addresses with a single click.
*   **Skeleton Loading UI:** Implements a modern placeholder UI that appears while data is being fetched, improving perceived performance.
*   **SEO Optimized:** Includes structured data (JSON-LD) and descriptive metadata to improve visibility on search engines.

## 🛠️ Technology Stack

*   **Frontend:** React 19, TypeScript
*   **Styling:** CSS3 with custom properties for theming and a responsive layout.
*   **Mapping:** [Leaflet.js](https://leafletjs.com/)
*   **APIs:**
    *   [ipify](https://www.ipify.org/) for public IP address retrieval.
    *   [ipinfo.io](https://ipinfo.io/) for geolocation and network details.
    *   [Google Public DNS (DoH)](https://developers.google.com/speed/public-dns/docs/doh) for DNS lookups.
    *   [RDAP (Registration Data Access Protocol)](https://www.icann.org/rdap) for WHOIS lookups.
*   **Local IP Detection:** WebRTC (`RTCPeerConnection` API).
*   **Build/Module System:** ES Modules with an `importmap` for browser-based dependency management.

---

This project was built to be a fast, accurate, and beautifully designed utility for developers, network administrators, and anyone curious about their internet connection details.