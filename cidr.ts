import { CidrResult } from './types';

const ipToLong = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
};

const longToIp = (long: number): string => {
    return [(long >>> 24), (long >> 16 & 255), (long >> 8 & 255), (long & 255)].join('.');
};

const getIpType = (ipLong: number): 'Public' | 'Private' | 'Loopback' | 'Other' => {
    // 10.0.0.0/8
    if (ipLong >= ipToLong('10.0.0.0') && ipLong <= ipToLong('10.255.255.255')) return 'Private';
    // 172.16.0.0/12
    if (ipLong >= ipToLong('172.16.0.0') && ipLong <= ipToLong('172.31.255.255')) return 'Private';
    // 192.168.0.0/16
    if (ipLong >= ipToLong('192.168.0.0') && ipLong <= ipToLong('192.168.255.255')) return 'Private';
    // 127.0.0.0/8
    if (ipLong >= ipToLong('127.0.0.0') && ipLong <= ipToLong('127.255.255.255')) return 'Loopback';
    
    return 'Public';
};

export const calculateCidr = (ip: string, prefix: number): CidrResult => {
    const ipLong = ipToLong(ip);
    
    const subnetMaskLong = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const subnetMask = longToIp(subnetMaskLong);
    
    const wildcardMaskLong = ~subnetMaskLong >>> 0;
    const wildcardMask = longToIp(wildcardMaskLong);
    
    const networkAddressLong = (ipLong & subnetMaskLong) >>> 0;
    const networkAddress = longToIp(networkAddressLong);
    
    const broadcastAddressLong = (networkAddressLong | wildcardMaskLong) >>> 0;
    const broadcastAddress = longToIp(broadcastAddressLong);
    
    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix < 31 ? totalHosts - 2 : 0;
    
    const firstHost = prefix < 31 ? longToIp(networkAddressLong + 1) : null;
    const lastHost = prefix < 31 ? longToIp(broadcastAddressLong - 1) : null;
    
    return {
        ip,
        prefix,
        networkAddress,
        broadcastAddress,
        firstHost,
        lastHost,
        subnetMask,
        wildcardMask,
        totalHosts,
        usableHosts,
        ipType: getIpType(ipLong),
    };
};

export const parseAndValidateCidr = (query: string): { ip: string, prefix: number } | { error: string } => {
    const parts = query.split('/');
    if (parts.length !== 2) {
        return { error: "Invalid format. Use IP/prefix (e.g., 192.168.1.1/24)." };
    }
    
    const [ip, prefixStr] = parts;
    const prefix = parseInt(prefixStr, 10);
    
    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
        return { error: "Invalid prefix. Must be a number between 0 and 32." };
    }
    
    const ipParts = ip.split('.');
    if (ipParts.length !== 4 || ipParts.some(p => isNaN(parseInt(p)) || parseInt(p) < 0 || parseInt(p) > 255)) {
        return { error: "Invalid IPv4 address format." };
    }
    
    return { ip, prefix };
};
