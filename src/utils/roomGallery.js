export function getRoomGallery(room) {
  // A supplied suite gallery is authoritative: don't mix in placeholder or hotel photos.
  const photos = room.gallery?.length ? room.gallery : [
    { src: room.image, alt: `${room.name} at Wyattel Suite`, caption: `${room.name} · suite view` },
  ]
  const seen = new Set()
  return photos.filter((photo) => {
    if (!photo.src || seen.has(photo.src)) return false
    seen.add(photo.src)
    return true
  })
}
