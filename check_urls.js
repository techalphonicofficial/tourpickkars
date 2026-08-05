const http = require('http');

const urls = [
  '/blog/trails-of-wonder-discover-the-magic-of-travel-beyond-boundaries',
  '/trips/spiti-valley',
  '/trips/treks-trails',
  '/trips/upcoming-trips/all',
  '/manali-tour-package',
  '/sacred-hills-himalayan-trails-a-6-day-journey-through-dehradun-rishikesh-mussoorie-dhanaulti-haridwar',
  '/assets/img/normal/resort-details.jpg'
];

//ss

async function checkUrl(path) {
  return new Promise((resolve) => {
    http.get({
      hostname: 'localhost',
      port: 3001,
      path: path,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      }
    }, (res) => {
      resolve({ path, status: res.statusCode });
    }).on('error', (e) => {
      resolve({ path, error: e.message });
    });
  });
}

async function run() {
  for (const url of urls) {
    const result = await checkUrl(url);
    console.log(`${result.path} - ${result.status || result.error}`);
  }
}

run();
