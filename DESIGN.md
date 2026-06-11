# Design Brief

## Direction

BookNest — Premium online bookstore and digital library with refined editorial aesthetic, merging literary luxury with modern SaaS clarity.

## Tone

Calm, sophisticated, curated minimalism inspired by high-end independent bookstores — warm, inviting, and intentional without fussiness.

## Differentiation

Warm cream + deep gold + sage green palette evokes book binding and literary comfort, distinctly warm and Editorial rather than corporate cool-blue aesthetic typical of retail tech.

## Color Palette

| Token      | OKLCH           | Role                                  |
|----------|-----------------|---------------------------------------|
| background | 0.975 0.01 80   | Warm cream off-white base             |
| foreground | 0.18 0.02 50    | Deep warm charcoal text               |
| card       | 1.0 0.005 80    | Pure white elevated surfaces          |
| primary    | 0.52 0.16 50    | Deep warm gold — CTAs, highlights     |
| accent     | 0.58 0.12 160   | Soft sage green — secondary accents   |
| muted      | 0.93 0.015 80   | Warm light grey — disabled, tertiary  |
| border     | 0.88 0.01 80    | Soft warm border grey                 |

## Typography

- Display: Fraunces — refined serif for hero, section headings, book titles (substitute for Playfair Display)
- Body: Figtree — clean, modern sans-serif for descriptions, metadata, UI labels (substitute for Inter)
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-4xl font-semibold`, label `text-sm font-medium`, body `text-base`

## Elevation & Depth

Soft layered elevation via subtle warm-tinted shadows (`shadow-subtle` 6px blur, `shadow-elevated` 16px blur) and card lift on hover — depth without harshness, maintaining warm luxury aesthetic.

## Structural Zones

| Zone    | Background           | Border                    | Notes                             |
|---------|----------------------|---------------------------|----------------------------------|
| Header  | card (white)         | border-b subtle light     | Minimal nav, logo left, icons right |
| Hero    | background (cream)   | —                         | Full-width tagline + carousel    |
| Content | background (cream)   | —                         | Sections alternate: card, muted  |
| Cards   | card (white)         | border subtle             | 8px radius, hover-lift effect    |
| Footer  | muted/30 warm        | border-t subtle light     | Warm grey-cream tone             |

## Spacing & Rhythm

8px grid base unit. Sections separated by 4–6rem vertical spacing. Card inner padding 1.5rem–2rem. Micro-spacing 0.5rem between labels and inputs. Dense grid on desktop (3–4 cols), single column mobile.

## Component Patterns

- **Buttons**: Primary (deep gold bg, white text, rounded-md), hover lift + brightness increase; Secondary (muted bg, dark text)
- **Cards**: White bg, 8px radius, subtle shadow, 12px border on hover, lift on hover (translateY -4px)
- **Badges**: Soft sage accent bg, dark text, 12px radius (pill-like)
- **Input**: Warm grey border, white bg, focus ring in primary gold

## Motion

- **Entrance**: Fade-in + slide-up on section scroll (0.4s ease-out)
- **Hover**: All interactive elements 0.3s smooth cubic-bezier transition — card lift, button brightness, text color shifts
- **Decorative**: Soft pulse on featured carousel (2s ease-in-out), carousel slide transition (0.5s ease)

## Constraints

- No harsh shadows or glowing effects
- Minimum 4.5:1 text contrast ratio (all combinations AA+)
- No rainbow palettes — limit to gold (primary), sage (accent), warm grey (muted), white/cream
- Mobile-first: breakpoints sm 640px, md 768px, lg 1024px
- All color tokens via CSS variables, no arbitrary Tailwind colors

## Signature Detail

Deep warm gold accents (not corporate blue) paired with sage green create a "literary comfort" identity — intentional and memorable, distinct from generic tech retail aesthetics.
