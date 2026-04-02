# Smart Helmet Page Redesign

Date: 2026-04-02
Project: `medusa-nextjs-ecommerce-storefront`
Target page: `src/app/[countryCode]/(main)/smart-helmet/page.tsx`
Reference: `v3/smart-helmets.html`

## Goal

Redesign the storefront `smart-helmet` landing page so its overall presentation follows the `v3` smart-helmets page, while continuing to use the storefront's own navigation, footer, localization, and product data.

The redesign should not copy `v3` literally. It should adapt the layout so the product showcase and comparison content are structurally linked on desktop, tablet, and mobile.

## Confirmed Scope

- Follow the overall visual direction of `v3/smart-helmets.html`
- Keep the storefront's existing global shell:
  - announcement bar
  - navigation
  - footer
  - locale and region behavior
- Keep existing DLL copy where possible instead of rewriting the page voice
- Use the storefront's own products and product links
- If the Smart Helmets category has fewer than 4 products, fill the remaining slots with other storefront products

## Non-Goals

- No backend schema or product metadata changes
- No new real comparison data integration
- No change to checkout or product detail behavior
- No global theme rewrite
- No generic shared "landing page template" abstraction for other pages in this pass

## User-Approved Design Decisions

### 1. Layout model

The page should not mirror `v3`'s oversized top product cards with a detached comparison block below. Instead, the product showcase and comparison area should be merged into one synchronized section.

Each product occupies one column or one slide, and its comparison content must live directly below its product card in the same visual unit.

### 2. Responsive behavior

- Desktop:
  - 4-column aligned layout
  - each column contains a product card on top and that product's comparison/features block below
- Tablet:
  - 2-column carousel
  - each carousel view shows 2 product columns together
  - the product card and its matching comparison/features block move together
- Mobile:
  - 1-column carousel
  - each slide contains one product card plus its matching comparison/features block

### 3. Comparison data strategy

The comparison/features area does not use real backend data in this pass.

It should use `v3`-style mock data for structure and presentation. This includes the comparison attributes and product-level badges or labels. The page should make this feel like marketing comparison content rather than a strict database-backed specification table.

### 4. Existing section retention/removal

Remove these sections from the current `smart-helmet` page:

- large dark hero
- certifications bar
- technology features grid
- full-width comparison/value-prop banner

Keep these sections:

- FAQ
- related blog posts
- bottom CTA

## Proposed Page Structure

### Section A: Intro header

Replace the current dark hero with a simplified, `v3`-inspired intro block:

- light neutral background
- centered title
- centered supporting description
- copy sourced from existing i18n where possible

Recommended mapping:

- title: `smart_helmet.products.title`
- description: `smart_helmet.products.description`

This keeps the tone aligned with the rest of the DLL storefront without inventing new marketing copy.

### Section B: Synchronized product + feature comparison section

This becomes the core of the page.

Each product unit contains:

1. Product visual area
   - product image
   - optional color swatches
   - product name
   - optional small tag or category label
   - short description
   - `Learn more` link to the product detail page
   - `Buy` link to the product detail page anchored to the purchase area

2. Product comparison/features area
   - a top product-specific summary row or badge area
   - a vertically stacked list of mock comparison features from `v3`
   - values rendered per product column rather than in one detached global matrix

Desktop shows 4 product units side by side.
Tablet shows 2 product units per carousel view.
Mobile shows 1 product unit per carousel view.

### Section C: FAQ

Reuse the current localized FAQ content and keep it below the synchronized product section.

The FAQ can remain structurally simple and does not need to mimic `v3` exactly.

### Section D: Related articles

Keep the current related articles section using the existing `LatestPosts` integration.

### Section E: Bottom CTA

Keep the current CTA section and existing translation keys.

## Data Model And Mapping

### Product source

Products should come from the storefront's own Medusa product data.

Selection strategy:

1. Prefer products from the `Smart Helmets` category
2. If fewer than 4 products are found, fill the remaining slots with other storefront products
3. Limit the final display set to 4 products

This keeps the page populated and stable even when the catalog is incomplete.

### Product data fields

Use real storefront data for:

- image: `thumbnail`, fallback to first product image
- title: `title`
- short description:
  - prefer `subtitle`
  - fallback to a trimmed product `description`
- product link: `/products/[handle]`
- buy link: `/products/[handle]#buy`

### Color swatches

Color swatches are presentation-only in this redesign.

Behavior:

- If a product has a `Color` option, render swatches from those option values
- If no color option exists, omit swatches
- Clicking a swatch only affects showcase presentation
- It must not mutate cart state or actual selected purchasing variant
- If an image can be reasonably matched to the selected color, swap the displayed image
- If no matching image exists, keep the current image and only update the selected swatch state

This preserves the `v3` interaction feel without falsely implying backend variant image support.

### Comparison/features mock content

The comparison/features content is static frontend configuration for now.

It should include:

- product-level tag presentation similar to `v3`
- optional `NEW` label where relevant to the mock layout
- mock comparison rows modeled after `v3`

The mock content is attached to display slots rather than to actual product IDs. In practice:

- slot 1 mock config applies to displayed product 1
- slot 2 mock config applies to displayed product 2
- slot 3 mock config applies to displayed product 3
- slot 4 mock config applies to displayed product 4

This avoids coupling fake comparison data to real catalog identities.

## Component Design

The implementation should stay mostly inside the existing page route, but one small data helper is justified.

### Recommended units

#### `getSmartHelmetDisplayProducts`

Purpose:

- fetch candidate products
- prefer Smart Helmets category
- fill with fallback products when needed
- return exactly the 4 products used by the page

Location options:

- local helper in the page file
- or a small helper near the page if the file gets too large

#### `ProductComparisonCard`

Purpose:

- render one synchronized product unit
- own the swatch interaction state
- render both top product content and lower comparison content

This should likely be a client component because swatch interaction and carousel state are interactive.

#### `SmartHelmetComparisonCarousel`

Purpose:

- handle tablet and mobile carousel behavior
- keep product card and comparison block in the same slide/group

Desktop should not use the carousel layout and can render a static 4-column grid.

## Interaction Design

### Desktop

- Static 4-column layout
- No carousel controls
- Each column keeps its own product and feature data visually locked together

### Tablet

- 2-up carousel
- Each step advances by 2 products
- Visible columns remain aligned within the same viewport

### Mobile

- 1-up carousel
- Each step advances by 1 product

### Carousel synchronization

There should not be a separate second slider for the comparison region.

Instead, each slide or slide-group contains both:

- the product card content
- the matching comparison/features block

This avoids sync drift and keeps the implementation simpler.

## Accessibility Notes

- Swatches need accessible labels derived from color names
- Carousel controls need text labels
- Content must remain usable without hover
- Use semantic headings in a consistent hierarchy
- Do not rely on color alone to convey selected swatch state

## Error Handling And Empty States

### Product fetch failure

If products fail to load:

- do not render a broken comparison section
- show a lightweight fallback message or preserve skeleton behavior

### Fewer than 4 products available

If fewer than 4 products exist total even after fallback:

- render the available products only
- do not fabricate additional fake products

The approved fallback rule only fills from real storefront products.

### Missing images

If a product lacks an image:

- use the existing placeholder thumbnail behavior

### Missing handle

If a product lacks a usable handle:

- do not render the CTA links for that product as clickable product routes
- prefer excluding such products from the chosen set if possible

## Testing Strategy

### Manual verification

Verify:

1. desktop renders 4 aligned product columns
2. tablet renders 2-up carousel with comparison sections moving together with products
3. mobile renders 1-up carousel with synchronized content
4. product links point to real storefront product pages
5. `Buy` links point to the product detail page buy section anchor
6. swatch clicks only affect presentation and do not change cart state
7. FAQ, related posts, and bottom CTA still render
8. missing product images still show placeholders cleanly

### Code-level validation

At minimum, run:

- lint on modified files
- targeted typecheck if feasible in the current project setup

If a carousel library already exists in the storefront, reuse it instead of introducing a second pattern.

## Risks

### 1. Fake comparison data next to real products

This can be misread as real specs.

Mitigation:

- keep the presentation clearly editorial/marketing in style
- avoid overly precise technical numbers unless already present in `v3`

### 2. Variant/image mismatch

Products may not have image assets that match color options.

Mitigation:

- treat swatches as presentation-only
- degrade gracefully when no image match exists

### 3. Carousel implementation drift across breakpoints

Separate render paths for desktop, tablet, and mobile can diverge.

Mitigation:

- define one shared product unit component
- only vary grouping and viewport behavior by breakpoint

## Implementation Summary

The redesign should replace the current smart helmet page's top half with a `v3`-inspired synchronized product comparison experience:

- intro header instead of dark hero
- product card and feature comparison combined per product
- 4-column desktop layout
- 2-column tablet carousel
- 1-column mobile carousel
- real storefront products
- static `v3`-style mock comparison data
- existing FAQ, blog, and CTA retained

This approach matches the approved design direction while keeping the implementation contained and avoiding backend changes.
