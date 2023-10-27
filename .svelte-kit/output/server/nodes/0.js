import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.69868791.js","_app/immutable/chunks/scheduler.98c1d9ef.js","_app/immutable/chunks/index.47307959.js","_app/immutable/chunks/index.1a4fa6f9.js","_app/immutable/chunks/index.417e9525.js"];
export const stylesheets = ["_app/immutable/assets/0.9292a050.css","_app/immutable/assets/index.bd53154f.css"];
export const fonts = [];
