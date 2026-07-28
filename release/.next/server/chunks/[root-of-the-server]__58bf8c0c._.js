module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},44549,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),o=e.i(61916),s=e.i(74677),i=e.i(69741),l=e.i(16795),d=e.i(87718),u=e.i(95169),p=e.i(47587),c=e.i(66012),h=e.i(70101),w=e.i(26937),x=e.i(10372),R=e.i(93695);e.i(52474);var g=e.i(220);async function v(){return new Response(`
User-agent: *
Allow: /

# Important pages
Allow: /wp-content/uploads/
Allow: /assets/
Allow: /images/

# Disallow sensitive/system paths
Disallow: /admin/
Disallow: /login/
Disallow: /dashboard/
Disallow: /checkout/
Disallow: /cart/
Disallow: /api/
Disallow: /storage/
Disallow: /vendor/
Disallow: /private/
Disallow: /shopdetail/

# Allow AI crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: https://www.tourpickkars.in/sitemap.xml
`.trim(),{headers:{"Content-Type":"text/plain","Cache-Control":"no-store"}})}e.s(["GET",()=>v,"dynamic",0,"force-dynamic","fetchCache",0,"force-no-store","revalidate",0,0],72783);var m=e.i(72783);let f=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/robots.txt/route",pathname:"/robots.txt",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/robots.txt/route.js",nextConfigOutput:"standalone",userland:m}),{workAsyncStorage:A,workUnitAsyncStorage:E,serverHooks:C}=f;function y(){return(0,a.patchFetch)({workAsyncStorage:A,workUnitAsyncStorage:E})}async function b(e,t,a){f.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/robots.txt/route";v=v.replace(/\/index$/,"")||"/";let m=await f.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!m)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:A,params:E,nextConfig:C,parsedUrl:y,isDraftMode:b,prerenderManifest:T,routerServerContext:P,isOnDemandRevalidate:U,revalidateOnlyGenerated:D,resolvedPathname:N,clientReferenceManifest:k,serverActionsManifest:O}=m,S=(0,i.normalizeAppPath)(v),_=!!(T.dynamicRoutes[S]||T.routes[N]),q=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,y,!1):t.end("This page could not be found"),null);if(_&&!b){let e=!!T.routes[N],t=T.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(C.experimental.adapterPath)return await q();throw new R.NoFallbackError}}let I=null;!_||f.isDev||b||(I="/index"===(I=N)?"/":I);let H=!0===f.isDev||!_,j=_&&!H;O&&k&&(0,s.setManifestsSingleton)({page:v,clientReferenceManifest:k,serverActionsManifest:O});let M=e.method||"GET",B=(0,o.getTracer)(),$=B.getActiveScopeSpan(),F={params:E,prerenderManifest:T,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:H,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:C.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>f.onRequestError(e,t,a,n,P)},sharedContext:{buildId:A}},G=new l.NodeNextRequest(e),K=new l.NodeNextResponse(t),L=d.NextRequestAdapter.fromNodeNextRequest(G,(0,d.signalFromNodeResponse)(t));try{let s=async e=>f.handle(L,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=B.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${M} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${M} ${v}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var o,l;let d=async({previousCacheEntry:r})=>{try{if(!i&&U&&D&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await s(n);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=F.renderOpts.collectedTags;if(!_)return await (0,c.sendResponse)(G,K,o,F.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(o.headers);d&&(t[x.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,a=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:g.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await f.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:U})},!1,P),t}},u=await f.handleResponse({req:e,nextConfig:C,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:T,isRoutePPREnabled:!1,isOnDemandRevalidate:U,revalidateOnlyGenerated:D,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:i});if(!_)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==g.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",U?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),b&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let R=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return i&&_||R.delete(x.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||R.get("Cache-Control")||R.set("Cache-Control",(0,w.getCacheControlHeader)(u.cacheControl)),await (0,c.sendResponse)(G,K,new Response(u.value.body,{headers:R,status:u.value.status||200})),null};$?await l($):await B.withPropagatedContext(e.headers,()=>B.trace(u.BaseServerSpan.handleRequest,{spanName:`${M} ${v}`,kind:o.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},l))}catch(t){if(t instanceof R.NoFallbackError||await f.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:U})},!1,P),_)throw t;return await (0,c.sendResponse)(G,K,new Response(null,{status:500})),null}}e.s(["handler",()=>b,"patchFetch",()=>y,"routeModule",()=>f,"serverHooks",()=>C,"workAsyncStorage",()=>A,"workUnitAsyncStorage",()=>E],44549)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__58bf8c0c._.js.map