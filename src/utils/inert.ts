/**
 * Props that take a subtree out of focus and the accessibility tree while an
 * overlay covers it. React 18 only forwards `inert` as a string attribute.
 */
export const inertProps: Record<string, string> = { inert: '', 'aria-hidden': 'true' }
