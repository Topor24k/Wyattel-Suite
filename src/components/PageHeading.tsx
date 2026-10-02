import React from 'react'

// Keep route announcements and a page heading without the removed visual banner.
export default function PageHeading({ title }: { title: string }) {
  return <h1 className="sr-only" tabIndex={-1} data-page-heading>{title}</h1>
}
