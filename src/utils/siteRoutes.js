export const roomSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const roomPath = (name) => `/suites/${roomSlug(name)}`
export const photoId = (src) => `photo:${src}`
