const CACHE_NAME = 'printol-v2.6';
const urlsToCache = [
  './',
  './index.html',
  './font.ttf',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './logo/messengers.png',
  './logo/isp.png',
  './logo/university.png',
  './logo/school.png',
  './logo/bank.png',
  './logo/car.png',
  './logo/tax.png',
  './logo/subsidy.png',
  './logo/judiciary.png',
  './logo/license.png',
  './logo/post.png',
  './logo/sports.png',
  './logo/pension.png',
  './logo/insurance.png',
  './logo/government.png',
  './logo/tools.png',
  './logo/scan.png',
  './logo/default.png'
];

// نصب و کش کردن فایل‌های ضروری
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        await Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(err => console.warn('Skip cache:', url, err)))
        );
      })
  );
});

// فعال‌سازی و پاکسازی کش‌های قدیمی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// پاسخ‌دهی آفلاین
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
