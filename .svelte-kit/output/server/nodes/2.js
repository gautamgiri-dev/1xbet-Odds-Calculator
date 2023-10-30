

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.706875f7.js","_app/immutable/chunks/scheduler.98c1d9ef.js","_app/immutable/chunks/index.47307959.js","_app/immutable/chunks/index.417e9525.js","_app/immutable/chunks/index.1a4fa6f9.js"];
export const stylesheets = ["_app/immutable/assets/index.bd53154f.css"];
export const fonts = [];
