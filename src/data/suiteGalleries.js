const createSuiteGallery = (suiteName, photoName) => Array.from({ length: 3 }, (_, index) => ({
  src: `/${encodeURIComponent(`${suiteName} Images`)}/${encodeURIComponent(`Wyattel Suite ${photoName} ${index + 1}.png`)}`,
  alt: `${suiteName} at Wyattel Suite · photo ${index + 1}`,
  caption: `${suiteName} · view ${String(index + 1).padStart(2, '0')}`,
}))

/** @type {Record<string, import('../types').RoomPhoto[]>} */
export const suiteGalleries = {
  'Deluxe Suite': createSuiteGallery('Deluxe Suite', 'Deluxe'),
  'Twin Suite': createSuiteGallery('Twin Suite', 'Twin'),
  'Matrimonial Suite': createSuiteGallery('Matrimonial Suite', 'Matrimonial'),
  'Family Suite': createSuiteGallery('Family Suite', 'Family'),
}
