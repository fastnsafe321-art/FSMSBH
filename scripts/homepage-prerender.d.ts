import type { Plugin } from 'vite';

export function prerenderHomepage(): Promise<void>;
export function homepagePrerenderPlugin(): Plugin;
