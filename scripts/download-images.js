const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { name: 'sydney-opera-house.jpg', url: 'https://picsum.photos/800/600?random=1' },
  { name: 'great-barrier-reef.jpg', url: 'https://picsum.photos/800/600?random=2' },
  { name: 'uluru.jpg', url: 'https://picsum.photos/800/600?random=3' },
  { name: 'kangaroo.jpg', url: 'https://picsum.photos/800/600?random=4' },
  { name: 'koala.jpg', url: 'https://picsum.photos/800/600?random=5' },
  { name: 'bondi-beach.jpg', url: 'https://picsum.photos/800/600?random=6' },
  { name: 'blue-mountains.jpg', url: 'https://picsum.photos/800/600?random=7' },
  { name: 'whitsunday-islands.jpg', url: 'https://picsum.photos/800/600?random=8' }
];

const galleryDir = path.join(__dirname, '../public/images/gallery');

// Create directory if it doesn't exist
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

images.forEach(image => {
  const filePath = path.join(galleryDir, image.name);
  const file = fs.createWriteStream(filePath);

  https.get(image.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${image.name}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${image.name}:`, err.message);
  });
}); 