

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.da737010.js","_app/immutable/chunks/scheduler.98c1d9ef.js","_app/immutable/chunks/index.47307959.js","_app/immutable/chunks/singletons.ecce416d.js","_app/immutable/chunks/index.1a4fa6f9.js"];
export const stylesheets = [];
export const fonts = [];
