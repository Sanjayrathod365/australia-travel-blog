const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const images = [
  {
    name: 'sydney-opera-house.jpg',
    url: 'https://picsum.photos/seed/sydney/800/600'
  },
  {
    name: 'great-barrier-reef.jpg',
    url: 'https://picsum.photos/seed/reef/800/600'
  },
  {
    name: 'uluru.jpg',
    url: 'https://picsum.photos/seed/uluru/800/600'
  },
  {
    name: 'kangaroo.jpg',
    url: 'https://picsum.photos/seed/kangaroo/800/600'
  },
  {
    name: 'koala.jpg',
    url: 'https://picsum.photos/seed/koala/800/600'
  },
  {
    name: 'bondi-beach.jpg',
    url: 'https://picsum.photos/seed/bondi/800/600'
  },
  {
    name: 'blue-mountains.jpg',
    url: 'https://picsum.photos/seed/mountains/800/600'
  },
  {
    name: 'whitsunday-islands.jpg',
    url: 'https://picsum.photos/seed/whitsunday/800/600'
  }
];

async function downloadImage(image) {
  try {
    const response = await fetch(image.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const buffer = await response.buffer();
    fs.writeFileSync(path.join(__dirname, image.name), buffer);
    console.log(`Downloaded: ${image.name}`);
  } catch (error) {
    console.error(`Error downloading ${image.name}:`, error);
  }
}

async function downloadAllImages() {
  for (const image of images) {
    await downloadImage(image);
  }
}

downloadAllImages(); 