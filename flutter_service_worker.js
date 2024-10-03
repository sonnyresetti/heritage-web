'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "19afd3d950a2cc4f31b605bd7b353802",
"assets/AssetManifest.bin.json": "764fff7236c8bb121f75adf46b216973",
"assets/AssetManifest.json": "393c4be8e93fbf4246e52e0c920d55d6",
"assets/assets/fonts/SF-Pro-Display-Bold.otf": "644563f48ab5fe8e9082b64b2729b068",
"assets/assets/fonts/SF-Pro-Display-Regular.otf": "aaeac71d99a345145a126a8c9dd2615f",
"assets/assets/fonts/SF-Pro-Display-Ultralight.otf": "bc55c63e7841855767b283b78bbd8d3a",
"assets/assets/fonts/SF-Pro-Display-Medium.otf": "51fd7406327f2b1dbc8e708e6a9da9a5",
"assets/assets/fonts/SF-Pro-Display-Semibold.otf": "e6ef4ea3cf5b1b533a85a5591534e3e4",
"assets/assets/fonts/SF-Pro-Display-Light.otf": "ac5237052941a94686167d278e1c1c9d",
"assets/assets/fonts/SF-Pro-Display-Heavy.otf": "a545fc03ce079844a5ff898a25fe589b",
"assets/assets/fonts/SF-Pro-Display-Black.otf": "11e421ee3f03e231763aeb70962badd8",
"assets/assets/fonts/SF-Pro-Display-Thin.otf": "f35e961114e962e90cf926bf979a8abc",
"assets/assets/images/logo_text.webp": "0dc6e926742383cbfa7943cc917b44a9",
"assets/assets/images/binoculars.png": "1cc65b817283ba292bf243d407da8e94",
"assets/assets/images/connection_spouse.webp": "c1aa0c246b3a312c96e4162749ea6b4a",
"assets/assets/images/tree_background.webp": "9ba3688f61b2deb45b18a98e29245438",
"assets/assets/images/app_loading.webp": "f66eca1c0aa850c76111afbb5c6fb01b",
"assets/assets/images/badge.svg": "6815a1cef668134451979883c78ce003",
"assets/fonts/MaterialIcons-Regular.otf": "ea2218129186c5faf7bc1fe201afb221",
"assets/NOTICES": "619201cb9c9f5ea56a9f0b7dfdf86553",
"assets/AssetManifest.bin": "fdc13e9f85f1315bcb6c10fff4a5d816",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "064471c9810cf5d652055cfbd64c3851",
"assets/FontManifest.json": "908c8b70d3e4b2d635c668dee3882cf1",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"flutter_bootstrap.js": "378de799938e64e63e2f6bf5a0d11107",
"logo_text.webp": "0dc6e926742383cbfa7943cc917b44a9",
"index.html": "d997b65412ff7b9b910782e13897e6c6",
"/": "d997b65412ff7b9b910782e13897e6c6",
"manifest.json": "fccf28fe98145d50464f1c33ec8453a8",
"style.css": "36a335a595205f21e7e88cf91a446f75",
"loading.webp": "2887c3a915a0807bf76cea611d5f40ce",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"main.dart.js": "bab938b44c9ddd5135a66ebf0cf3706b",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"icons/Icon-512.png": "275e8c1f2d286fcafce18e6bca3f365d",
"icons/Icon-192.png": "9c15c3aba4853dcf8b26f8fc27da77ad",
"icons/Icon-maskable-192.png": "29d7b510a18c8a6cbce83792c2e2b884",
"icons/Icon-maskable-512.png": "11db4e0e0ac1de43b5a456d4e405affd",
"404.html": "fe45c39b7b7ec86c299b3b4fb5b57d38",
"favicon.png": "d5045017c5f520b56de09302c048f1f2"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
