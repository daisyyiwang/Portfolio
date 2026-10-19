// About page content. Edit copy here; layout lives in src/pages/about.astro.
export const about = {
  photo: '/images/daisy-portrait.jpg',
  // Decorative ID badge around the photo (Refine direction).
  badge: { org: 'Dept. of Product Design', name: 'Daisy Wang', role: 'Product designer · 9+ yrs', id: 'DW-0917-AI' },
  tagline: 'Grounded in data, driven by results, and deeply inspired by human insights.',
  intro: "Hi there! 👋 I'm Daisy Wang, a product designer based in the Bay Area, California.",
  highlights: [
    { icon: '⏳', title: '9 years', body: 'Designing both B2C and B2B products across desktop, mobile, web and extensions, at any scale.' },
    { icon: '🤖', title: 'AI in practice', body: 'Using AI for design workshops, user research, rapid prototyping, share-outs and design QA — and building functional products with AI tools.' },
    { icon: '📊', title: 'Data driven', body: 'Deeply grounded in business context, leading user-centered design from 0→1 and scaling solutions to support 3× growth.' },
    { icon: '♿', title: 'Accessibility in mind', body: 'An accessibility advocate connecting product design with the codebase, building inclusive experiences from spec through shipped code.' },
  ],
  releases: [
    { title: 'Unlock edit image tools for Acrobat', body: 'Enable image editing in PDFs across desktop, web, mobile, and Chrome extension workflows for end-to-end document updates.', image: '/images/thumb-edit.png', href: 'https://blog.adobe.com/en/publish/2024/06/17/adobe-acrobat-reimagines-documents-multi-format-ai-powered-work' },
    { title: 'Launch Acrobat Pro free Teams trial', body: 'Launch a free Teams trial experience with collaboration and admin capabilities tailored for small and mid-size businesses.', image: '/images/thumb-pro-teams.png', href: 'https://www.adobe.com/acrobat/business/acrobat-pro-teams.html' },
    { title: 'Enable MPIP protection in Acrobat', body: 'Add native sensitivity labeling and protection support so enterprise teams can secure PDF content with Microsoft Purview policies.', image: '/images/thumb-mpip.jpg', href: 'https://blog.adobe.com/en/publish/2023/05/08/introducing-microsoft-purview-information-protection-mpip-in-acrobat' },
    { title: 'Embed Adobe Sign in Microsoft Teams', body: 'Bring signing workflows into Microsoft Teams so users can send, track, and complete agreements without leaving their collaboration space.', image: '/images/thumb-sign-teams.png', href: 'https://www.adobe.com/acrobat/business/integrations/microsoft-teams.html' },
    { title: 'Showcase Adobe × Microsoft 365', body: 'Showcase connected Adobe workflows across Microsoft 365 apps to streamline document tasks across creation, review, and signatures.', image: '/images/thumb-office365.png', href: 'https://youtu.be/LXC1e-P3XVM?si=IMLbCLuuWy9xVqeP' },
    { title: 'Integrate Notarize.com with Adobe Sign', body: 'Enable remote online notarization directly within Adobe Sign workflows so users can complete signed and notarized documents in one flow.', image: 'https://cdn.prod.website-files.com/651c6d0a39a8a5ec04e121e1/6542b2167ad8007135ed5012_623f3026581deec907ba8978_Product.jpeg', href: 'https://www.notarize.com/blog/notarize-brings-remote-online-notarization-to-adobe-sign' },
  ],
};
