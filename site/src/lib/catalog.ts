import data from "../generated/catalog.json";
import changelogData from "../generated/changelog.json";

export type UseCase = { title: string; description: string };
export type Benefit = { icon: string; title: string; description: string };

export type XbertExt = {
  displayName: string;
  tagline: string;
  audience: string[];
  categories: string[];
  prerequisites: string[];
  screenshots: string[];
  demoVideo: string | null;
  includes: { skills: number; commands: number; mcpTools: number };
  longDescription?: string;
  useCases?: UseCase[];
  benefits?: Benefit[];
  workflow?: string[];
};

export type Plugin = {
  slug: string;
  name: string;
  version?: string;
  description: string;
  author: { name: string; email?: string };
  homepage?: string;
  license?: string;
  keywords?: string[];
  readme: string;
  lastUpdated?: string;
  "x-xbert": XbertExt;
};

export type Bundle = {
  id: string;
  name: string;
  tagline: string;
  audience: string;
  plugins: string[];
};

export const plugins: Plugin[] = (data as { plugins: Plugin[] }).plugins;
export const bundles: Bundle[] = (data as { bundles?: Bundle[] }).bundles ?? [];

export function getPlugin(slug: string | undefined): Plugin | undefined {
  if (!slug) return undefined;
  return plugins.find((p) => p.slug === slug);
}

export type ChangelogEntry = {
  date: string;
  message: string;
  plugins: string[];
};

export const changelog: ChangelogEntry[] = changelogData as ChangelogEntry[];

export function allCategories(): string[] {
  const set = new Set<string>();
  plugins.forEach((p) => p["x-xbert"].categories.forEach((c) => set.add(c)));
  return Array.from(set).sort();
}
