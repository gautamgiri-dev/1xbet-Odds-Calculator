export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.3ec4db84.js","app":"_app/immutable/entry/app.fe873d02.js","imports":["_app/immutable/entry/start.3ec4db84.js","_app/immutable/chunks/scheduler.98c1d9ef.js","_app/immutable/chunks/singletons.e684e006.js","_app/immutable/chunks/index.1a4fa6f9.js","_app/immutable/entry/app.fe873d02.js","_app/immutable/chunks/scheduler.98c1d9ef.js","_app/immutable/chunks/index.47307959.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
