export type RoomPhoto = {
  src: string
  alt: string
  caption: string
}

export type Room = {
  name: string
  note: string
  image: string
  text: string
  facts: string[]
  gallery?: RoomPhoto[]
}

export type Experience = {
  id: string
  number: string
  title: string
  eyebrow: string
  text: string
  image: string
  imageAlt: string
  position: string
}
