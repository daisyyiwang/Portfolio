import { getCollection, type CollectionEntry } from 'astro:content';

export function projectHref(project: CollectionEntry<'projects'>) {
  const { migrated, href, external } = project.data;
  if (migrated) return { href: `/work/${project.id}/`, external: false };
  // Not yet migrated: link to the page on the current site (opens in a new tab).
  return { href: href ?? '#', external: external || Boolean(href?.startsWith('http')) };
}

export async function getProjects() {
  const all = await getCollection('projects');
  const sorted = all.sort((a, b) => a.data.order - b.data.order);
  return {
    live: sorted.filter((p) => !p.data.archive),
    archive: sorted.filter((p) => p.data.archive),
  };
}
