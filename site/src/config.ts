// Site-wide settings. Edit here rather than in components.
export const SITE = {
  name: 'Daisy, Yi Wang',
  title: 'Daisy, Yi Wang | Product Designer',
  description:
    'Daisy Yi Wang is a product designer in San Jose, CA with 9+ years leading AI-powered, data-driven products at scale.',
  email: 'daisyyiwang@gmail.com',
  linkedin: 'https://www.linkedin.com/in/daisyyiwang',
  dribbble: 'https://dribbble.com/Daisywang',
  resume: '/files/DaisyYiWang-ProductDesign.pdf',
  // Legacy pages not yet migrated still live on the current site.
  legacyBase: 'https://daisywang.design',
};

// Home-page footer copy.
export const FOOTER_MANIFESTO = {
  title: 'Let’s make things that matter.',
  values: [
    { title: 'Useful.', body: 'Solve real problems.' },
    { title: 'Usable.', body: 'Make life easier.' },
    { title: 'Meaningful.', body: 'Make a difference.' },
  ],
  closing: "Designing things people value, experiences people love, and a world that's a little better for it.",
};

// GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Analytics is skipped while empty.
export const GA4_ID = '';

// Client-side password. `enabled` gates whole pages behind /unlock; it's off, so only the
// <LockedSection> parts of the Adobe case studies ask for it. Unlocking once unlocks them all.
export const ACCESS_GUARD = {
  enabled: false,
  storageKey: 'portfolio_unlocked',
  password: 'daisy!',
};

// Visual direction. The site ships with Refine; the earlier explorations live in
// src/styles/tokens/explorations/ and can be re-enabled by importing their theme
// file in BaseLayout and adding them here.
export const STYLES = [
  { id: 'refine', label: 'Refine', hint: 'Retro-corporate office, CRT terminal' },
] as const;
export const DEFAULT_STYLE = 'refine';

// Floating switcher for comparing directions (only useful with more than one style).
export const SHOW_STYLE_SWITCHER = STYLES.length > 1;
