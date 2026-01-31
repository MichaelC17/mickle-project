# Landing Page + Blog

A beautiful, fast, and SEO-friendly personal landing page with an integrated blog built with Next.js 14.

## Features

- ⚡ **Fast** - Static generation with Next.js App Router
- 🔍 **SEO Optimized** - Dynamic meta tags, sitemap, and robots.txt
- 📝 **Easy Blogging** - Write posts in Markdown, no database needed
- 🎨 **Beautiful Design** - Custom typography with Playfair Display & DM Sans
- 📱 **Responsive** - Looks great on all devices
- 🌙 **Unique Aesthetic** - Warm cream/sepia/rust color palette

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── content/
│   └── blog/           # Markdown blog posts
├── public/             # Static assets
├── src/
│   ├── app/
│   │   ├── blog/       # Blog pages
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Landing page
│   ├── components/     # React components
│   └── lib/
│       └── blog.ts     # Blog utilities
└── package.json
```

## Writing Blog Posts

Create a new `.md` or `.mdx` file in `content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description for SEO and previews"
date: "2026-01-31"
category: "Development"
tags: ["tag1", "tag2"]
---

# Your Post Title

Your content here...
```

The post will automatically appear on the blog page.

## Customization

### Colors

Edit the color palette in `tailwind.config.ts`:

```typescript
colors: {
  cream: "#FAF7F2",
  ink: "#1C1917",
  sepia: "#A67C52",
  rust: "#BF5B3F",
  sage: "#6B7F6B",
  charcoal: "#2D2926",
}
```

### Fonts

The project uses Google Fonts loaded via CSS. Modify `src/app/globals.css` to change fonts.

### Metadata

Update site metadata in `src/app/layout.tsx` for SEO and social sharing.

## Deployment

Deploy easily to Vercel, Netlify, or any platform that supports Next.js:

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Static Export

For static hosting:

```bash
npm run build
```

The output will be in the `.next` directory.

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [MDX](https://mdxjs.com/) - Enhanced Markdown
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter parsing

## License

MIT
