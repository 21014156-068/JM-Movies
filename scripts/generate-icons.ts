import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SVG_PATH = path.join(PUBLIC_DIR, 'favicon.svg');

async function generateIcons() {
  if (!fs.existsSync(SVG_PATH)) {
    console.error('favicon.svg not found!');
    return;
  }

  const svgBuffer = fs.readFileSync(SVG_PATH);

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'pwa-192x192.png'));
  console.log('✅ Generated pwa-192x192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'pwa-512x512.png'));
  console.log('✅ Generated pwa-512x512.png');

  // 180x180 apple-touch-icon.png
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('✅ Generated apple-touch-icon.png');

  // 512x512 maskable icon with 10% safe zone padding
  const innerSize = Math.round(512 * 0.8);
  const innerBuffer = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 5, g: 6, b: 15, alpha: 1 } // #05060f brand background
    }
  })
    .composite([
      {
        input: innerBuffer,
        top: Math.round((512 - innerSize) / 2),
        left: Math.round((512 - innerSize) / 2)
      }
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'pwa-maskable-512x512.png'));
  console.log('✅ Generated pwa-maskable-512x512.png');
}

generateIcons().catch(console.error);
