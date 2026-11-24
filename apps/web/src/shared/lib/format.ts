/** Formats a list of slugs like "gluten-free" as "Gluten free". */
export const humanize = (slug: string): string => {
  const words = slug.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;
