const MARKETPLACE_NAME = "xbert";
const MARKETPLACE_REPO = "ThirstyStudios/XBert-Plugins";

export function installSnippet(slugs: string[], opts: { includeAdd?: boolean } = {}) {
  const includeAdd = opts.includeAdd ?? true;
  const lines: string[] = [];
  if (includeAdd) {
    lines.push(`/plugin marketplace add ${MARKETPLACE_REPO}`);
  }
  for (const slug of slugs) {
    lines.push(`/plugin install ${slug}@${MARKETPLACE_NAME}`);
  }
  return lines.join("\n");
}

export const marketplaceAddCommand = `/plugin marketplace add ${MARKETPLACE_REPO}`;
