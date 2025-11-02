// FIX: Added React import to make React.ReactNode type available.
import React from 'react';

// --- Data Types --- //
export type SectionId = 'overview' | 'details' | 'tools' | 'system';
export type ToolId = 'speed' | 'latency' | 'dns' | 'whois';

export interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  postal: string;
  timezone: string;
  hostname: string;
}

export interface SystemInfo {
  browser: string;
  os: string;
  screenResolution: string;
  devicePixelRatio: number;
  userAgent: string;
}

export interface DnsRecord {
    name: string;
    type: number;
    TTL: number;
    data: string;
    typeName: string;
}

export interface PingHistoryItem {
    date: string;
    results: Record<string, number | null>;
}

// --- Component Prop Types --- //
export interface IpDisplayBoxProps {
    type: string;
    ip: string | null;
}

export interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined | null;
    href?: string;
}

export interface MapDisplayProps {
    coords: [number, number] | null;
    city: string;
}
