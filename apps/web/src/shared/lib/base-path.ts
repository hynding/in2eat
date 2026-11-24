/** Prefixes a public asset path with the deploy base path. next/link does this itself; fetch() does not. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const withBasePath = (path: string): string => `${basePath}${path}`;
