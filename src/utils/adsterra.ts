/**
 * Adsterra Direct Link Monetization Engine
 * Manages master rotation, high-CTR conversion triggers, and targeted cinema channel placements.
 */

export const ADSTERRA_DIRECT_LINKS = [
  'https://www.effectivecpmnetwork.com/hkb33irgqh?key=a4a6a852616c073aba3604c5f8a3b609',
  'https://www.effectivecpmnetwork.com/mvs30d3pg?key=c037060ed397556019b25e3ae9024178',
  'https://www.effectivecpmnetwork.com/d4eny0nuhg?key=5f51ec9454fb4399b94d0f55cd4f2d23',
  'https://www.effectivecpmnetwork.com/bj6sbimvr8?key=795fba62a235d68c7c664db850085689',
  'https://www.effectivecpmnetwork.com/w4y56r2um?key=2855dad5719e86655d8d20bda879a5b3',
  'https://www.effectivecpmnetwork.com/my3ehigs2v?key=1c43a77bdde65f94511a254e55fc844c',
  'https://www.effectivecpmnetwork.com/rtsn10sx43?key=1d32c93da4294ee31a2e79f0c407d583',
  'https://www.effectivecpmnetwork.com/tyw1ajz3s2?key=3f5844b370bb99fa19fcf9b2118bdb83',
  'https://www.effectivecpmnetwork.com/hu3cgus2zq?key=d38b0494876eb4f5a0f4417335a0b6fe',
  'https://www.effectivecpmnetwork.com/q392y7kcr?key=8494483abc8c8e5d1cd1d4958b3c880e',
  'https://www.effectivecpmnetwork.com/xf0vue0z?key=91864d26cd04a79746c2732bf718765b',
  'https://www.effectivecpmnetwork.com/s7c2u83f2d?key=657a61e599279fb236a4ac5991a9dfc1'
];

export const ADSTERRA_TARGETED_CHANNELS = {
  NAVBAR_VIP_STREAM: 'https://www.effectivecpmnetwork.com/tyw1ajz3s2?key=3f5844b370bb99fa19fcf9b2118bdb83',
  FAST_DOWNLOAD_SERVER: 'https://www.effectivecpmnetwork.com/hu3cgus2zq?key=d38b0494876eb4f5a0f4417335a0b6fe',
  CLASH_VOTE_BONUS: 'https://www.effectivecpmnetwork.com/q392y7kcr?key=8494483abc8c8e5d1cd1d4958b3c880e',
  QUIZ_REWARD_UNLOCK: 'https://www.effectivecpmnetwork.com/xf0vue0z?key=91864d26cd04a79746c2732bf718765b',
  PREMIERE_EARLY_ACCESS: 'https://www.effectivecpmnetwork.com/s7c2u83f2d?key=657a61e599279fb236a4ac5991a9dfc1',
  PLAYER_BACKUP_MIRROR: 'https://www.effectivecpmnetwork.com/rtsn10sx43?key=1d32c93da4294ee31a2e79f0c407d583'
};

let currentIndex = 0;

/**
 * Returns a rotated Adsterra direct link to distribute clicks and maximize CPM across all 12 links.
 */
export function getRotatedAdsterraLink(): string {
  const link = ADSTERRA_DIRECT_LINKS[currentIndex % ADSTERRA_DIRECT_LINKS.length];
  currentIndex++;
  return link;
}

/**
 * Returns a random Adsterra direct link from all 12 active campaigns.
 */
export function getRandomAdsterraLink(): string {
  const randomIndex = Math.floor(Math.random() * ADSTERRA_DIRECT_LINKS.length);
  return ADSTERRA_DIRECT_LINKS[randomIndex];
}

/**
 * Helper to safely open any Adsterra direct link in a new tab without blocking the app.
 */
export function openAdsterraLink(urlOrIndex?: string | number) {
  let targetUrl: string;
  if (typeof urlOrIndex === 'string') {
    targetUrl = urlOrIndex;
  } else if (typeof urlOrIndex === 'number' && ADSTERRA_DIRECT_LINKS[urlOrIndex]) {
    targetUrl = ADSTERRA_DIRECT_LINKS[urlOrIndex];
  } else {
    targetUrl = getRotatedAdsterraLink();
  }

  // Create temporary link and click to trigger clean tab open
  const link = document.createElement('a');
  link.href = targetUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
