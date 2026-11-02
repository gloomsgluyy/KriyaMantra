# Kriya Mantra Design System

Dokumentasi design system untuk konsistensi visual antara landing page dan aplikasi SaaS Kriya Mantra.

---

## 🎨 Color Palette

### Primary Colors
```css
--color-1: #292524  /* Dark Brown — teks utama, background gelap */
--color-2: #ffffff  /* White — background terang, teks pada dark */
--color-3: #fffbeb  /* Cream — background alternatif, kartu */
--color-4: #f59e0b  /* Amber — aksen utama, tombol CTA, link aktif */
```

### Secondary & Supporting Colors
```css
--color-5: #57534e  /* Stone — teks sekunder, label */
--color-6: #292524  /* Dark Brown (sama dengan color-1) */
--color-7: #fde68a  /* Light Amber — highlight, badge */
--color-8: #fbbf24  /* Medium Amber — variasi aksen */
--color-9: #e7e5e4  /* Light Stone — border, divider */
```

### Semantic Usage
- **Text Primary**: `#292524` (color-1)
- **Text Secondary**: `#57534e` (color-5) dengan opacity 78-76%
- **Accent/CTA**: `#f59e0b` (color-4) untuk tombol, link, dan elemen interaktif
- **Background Light**: `#ffffff` (color-2)
- **Background Warm**: `#fffbeb` (color-3) untuk section alternatif
- **Hover State (Amber)**: `#d97706` (lebih gelap dari color-4)

**Prinsip:**  
Palet Warm Amber menciptakan kesan ramah, hangat, dan natural — cocok untuk brand yang mendampingi perajin tradisional Bali.

---

## 🔤 Typography

### Font Family
```css
--font-1: "Host Grotesk", "Host Grotesk Fallback", Arial, sans-serif;
```

**Host Grotesk** (Google Fonts)  
- Weight range: 300–800  
- Digunakan untuk semua teks  
- Fallback: Arial dengan size adjustment untuk mengurangi CLS

### Type Scale

| Class | Size | Weight | Line Height | Letter Spacing | Use Case |
|-------|------|--------|-------------|----------------|----------|
| `.m-text` | 1.0625rem (17px) | 400 | 1.55 | 0 | Body text |
| `.m-text-2` | clamp(3rem, 6.4vw, 6rem) | 600 | 0.96 | -0.045em | Hero heading |
| `.m-text-3` | clamp(2.25rem, 5.4vw, 5rem) | 600 | 1 | -0.04em | Section heading |
| `.m-text-4` | clamp(1.125rem, 1.35vw, 1.3125rem) | 400 | 1.45 | -0.01em | Lead paragraph |
| `.m-text-5` | clamp(1.1875rem, 1.6vw, 1.4375rem) | 600 | 1.2 | -0.02em | Card heading |
| `.m-text-6` | 0.9375rem (15px) | 600 | 1.25 | -0.005em | Label, small heading |
| `.m-text-7` | 0.8125rem (13px) | 400 | 1.5 | 0 | Caption, footnote |
| `.m-text-8` | 1rem (16px) | 400 | 1.5 | 0 | Secondary body |

**Responsive Typography:**  
Gunakan `clamp()` untuk heading agar ukuran menyesuaikan viewport tanpa breakpoint manual.

**Optical Tuning:**  
Heading besar menggunakan negative letter-spacing untuk kepadatan visual lebih baik.

---

## 📐 Spacing & Layout

### Spacing Tokens
```css
--space-1: clamp(1.125rem, 4.2vw, 3.5rem)  /* Padding horizontal container */
--space-2: clamp(5rem, 10vw, 9rem)         /* Padding vertikal section */
```

### Container
```css
.l-wrap {
  width: 100%;
  max-width: 88rem;  /* 1408px */
  margin-inline: auto;
  padding-inline: var(--space-1);
}
```

### Gap & Padding Patterns
- **Card internal gap**: `0.875rem` (14px)
- **Form field gap**: `0.5rem` (8px)
- **Button padding**: `0.875rem 1.625rem`
- **Section vertical spacing**: `var(--space-2)` (80–144px)

---

## 🔘 Border Radius

```css
--radius-1: 3.5rem   /* Section background bands */
--radius-2: 1.75rem  /* Card, panel, image container */
--radius-3: 62.5rem  /* Tombol (pill shape) */
--radius-4: 1.25rem  /* Chat bubble */
```

**Prinsip:**  
Radius besar untuk tombol dan section menciptakan visual soft, organic, dan approachable.

---

## 🌑 Shadows

```css
--shadow-1: 0 1.5rem 3rem -1.5rem color-mix(in srgb, var(--color-1) 60%, transparent);
--shadow-2: 0 0.75rem 1.75rem -0.75rem color-mix(in srgb, var(--color-4) 85%, transparent);
```

- **shadow-1**: dipakai untuk kartu, foto, elemen elevated
- **shadow-2**: dipakai untuk tombol amber

Bayangan menggunakan `color-mix()` agar warna bayangan menyatu dengan konteks (dark atau amber).

---

## 🔘 Buttons

### Primary Button (`.m-btn`)
```css
min-height: 3.25rem;
padding: 0.875rem 1.625rem;
border-radius: var(--radius-3);  /* pill */
background: var(--color-4);      /* amber */
color: var(--color-1);
font-size: 1rem;
font-weight: 600;
box-shadow: var(--shadow-2);
```

**Hover:**
- Label slide kiri `translate(-0.5rem, 0)`
- Munculkan wave indicator (3 bar animasi)
- Background berubah `#d97706`

### Secondary Button (`.m-btn-2`)
```css
background: var(--color-1);  /* dark */
color: var(--color-2);
```

### Small Button (`.m-btn-3`)
```css
min-height: 2.75rem;
padding: 0.625rem 1.25rem;
font-size: 0.9375rem;
```

### Icon Button (`.m-icon-btn`)
```css
width: 3rem;
height: 3rem;
border: 0.0625rem solid color-mix(in srgb, var(--color-2) 22%, transparent);
border-radius: var(--radius-3);
background: transparent;
```

**Hover:**
- Background amber scale dari bawah
- Icon berubah warna dark

**Prinsip:**  
Tombol menggunakan pill shape dengan micro-interaction (wave animation) untuk feedback visual. Hindari tombol rectangular kaku.

---

## 🔗 Links

### Text Link (`.m-link`)
```css
font-weight: 600;
text-decoration: none;
/* Animated underline: thin line di bawah, expand on hover */
```

**Hover:**  
Garis bawah expand dari 0% → 100%

### Navigation Link (`.m-link-2`)
```css
font-weight: 500;
/* Single underline animation */
```

**Prinsip:**  
Link tidak menggunakan garis bawah default. Hover state menampilkan underline animation smooth untuk feedback visual.

---

## 💬 Chat Bubbles

### Outgoing (`.m-caption`)
```css
padding: 0.625rem 1rem 0.625rem 0.8125rem;
border-radius: var(--radius-4) var(--radius-4) var(--radius-4) 0.3125rem;
background: var(--color-2);
color: var(--color-1);
```

### Incoming (`.m-caption-2`)
```css
border-radius: var(--radius-4) var(--radius-4) 0.3125rem var(--radius-4);
background: var(--color-4);
color: var(--color-1);
```

**Wave Indicator:**  
4 bar vertikal dengan tinggi berbeda untuk simulasi voice/typing.

---

## 📝 Form Inputs

### Input Field (`.m-field__input`)
```css
min-height: 3.25rem;
padding: 0.875rem 1rem;
border: 0.0625rem solid color-mix(in srgb, var(--color-1) 55%, transparent);
border-radius: 0.875rem;
background: var(--color-2);
font-size: 1rem;
```

**Focus:**  
Border menjadi solid `var(--color-1)`

**Invalid:**  
Border + outline amber `var(--color-4)`

### Label (`.m-field__label`)
```css
font-size: 0.9375rem;
font-weight: 600;
```

---

## 🃏 Cards

### Standard Card (`.m-card`)
```css
padding: 1.5rem 1.5rem 1.375rem;
border-radius: var(--radius-2);
background: var(--color-3);  /* cream */
color: var(--color-1);
gap: 0.875rem;
```

**Prinsip:**  
Card menggunakan background cream untuk kontras lembut dengan background putih. Spacing internal konsisten `0.875rem`.

---

## 🎭 Interactive States

### Focus
```css
:focus-visible {
  outline: 0.1875rem solid var(--color-1);
  outline-offset: 0.1875rem;
}

.on-dark :focus-visible {
  outline-color: var(--color-2);
}
```

### Selection
```css
::selection {
  background: var(--color-4);
  color: var(--color-1);
}
```

### Hover
- **Button**: label slide + wave animation
- **Link**: underline expand
- **Icon button**: amber fill scale

---

## 🎬 Motion & Animation

### Easing Curves
```css
cubic-bezier(0.2, 0.7, 0.2, 1)  /* Smooth, organic */
```

### Transition Duration
- **Quick feedback**: `0.3s` (opacity, color)
- **Movement**: `0.45s` (translate, scale)
- **Underline**: `0.5s` (background-size)

### Animation Principles
1. **Reduced motion support**: semua animasi dekoratif dibungkus `@media (prefers-reduced-motion: no-preference)`
2. **Scroll-triggered**: gunakan intersection observer + GSAP ScrollTrigger
3. **Micro-interactions**: button wave, link underline untuk feedback immediate
4. **Smooth scroll**: Lenis untuk scroll behavior natural

### Key Animations
- **Button wave**: 3 bar scale `1 0.3` → `1 1` dengan stagger
- **Caption fade-in**: words slide up `yPercent: 108` → `0`
- **Photo-to-poster**: scale + translate dengan ease `power1.inOut`

**Prinsip:**  
Motion menciptakan flow organik, bukan mekanis. Hindari animasi terlalu cepat atau bouncy.

---

## 📱 Responsive Breakpoints

```css
/* Mobile first */
@media (max-width: 47.99rem)   /* 767px — Mobile */
@media (max-width: 63.99rem)   /* 1023px — Tablet */
@media (min-width: 48rem)      /* 768px+ — Desktop */
@media (min-width: 90rem)      /* 1440px+ — Wide desktop */
```

### Mobile Adjustments
- Hero heading: `clamp(3.25rem, 14.375vw, 4.375rem)`
- Section padding: `clamp(5rem, 10vw, 9rem)` → smaller clamp range
- Grid → single column
- Sticky phone preview di atas konten (grid overlay)

**Prinsip:**  
Mobile-first dengan clamp() untuk fluid typography. Breakpoint hanya untuk layout struktur.

---

## 🌐 Accessibility

### WCAG Compliance
- **Contrast ratio**: Dark text (#292524) pada white (#ffffff) = 19.37:1 ✅ AAA
- **Amber (#f59e0b) pada white**: 3.43:1 ✅ AA untuk large text
- **Focus indicators**: 3px outline dengan offset
- **Skip link**: keyboard navigation
- **ARIA labels**: section, dialog, live region
- **Screen reader**: `.sr-only` class untuk context tersembunyi

### Keyboard Navigation
- Tab order logis
- Focus trap di modal menu
- Escape key menutup dialog

---

## 🖼️ Asset Guidelines

### Logo
- **Primary**: `assets/brand/logo-nav.svg` (horizontal, untuk navbar)
- **Footer**: `assets/brand/logo-footer.svg` (icon mark, untuk favicon dan footer besar)
- **Hero**: `assets/brand/hero-asset.svg` (illustration)

### Image Aspect Ratios
- **Poster preview**: `4:5` (Instagram post)
- **Phone mockup**: `9:19.5` (iPhone proportion)
- **Hero photo**: `16:9`

### Optimization
- **WebP** untuk foto
- **PNG** untuk screenshot dengan teks
- **SVG** untuk logo dan icon
- **Lazy loading**: `loading="lazy" decoding="async"` pada gambar di bawah fold

---

## 🛠️ Implementation Notes

### CSS Architecture
```
@layer tokens   /* Design tokens */
@layer base     /* Reset + base styles */
@layer atoms    /* Typography, buttons, form components */
@layer layout   /* Container, grid */
@layer sections /* Section-specific styles */
@layer scenes   /* Animation-related styles */
```

### Naming Convention
- **BEM-like**: `block__element--modifier`
- **Utility prefix**: `m-` untuk atoms (m-text, m-btn)
- **Section prefix**: `hero__`, `calls__`, `footer__`

### JavaScript
- **GSAP 3.13** untuk animasi
- **Lenis 1.3** untuk smooth scroll
- **Vanilla JS** untuk interaksi (no framework dependency)
- **Progressive enhancement**: core content berfungsi tanpa JS

---

## 📋 Checklist untuk SaaS App

Saat membangun aplikasi Kriya Mantra, pastikan:

- [ ] Gunakan palet Warm Amber (`#f59e0b`, `#292524`, `#fffbeb`)
- [ ] Host Grotesk sebagai primary font
- [ ] Tombol menggunakan pill shape (`border-radius: 62.5rem`)
- [ ] Button hover dengan wave animation
- [ ] Link menggunakan animated underline (bukan default)
- [ ] Card background cream (`#fffbeb`) bukan putih polos
- [ ] Form input dengan rounded corner `0.875rem`
- [ ] Focus state visible (3px outline)
- [ ] Reduced motion support untuk animasi
- [ ] Mobile-first responsive
- [ ] Shadow menggunakan `color-mix()` untuk konteks
- [ ] Spacing konsisten dengan `--space-1` dan `--space-2`
- [ ] Chat bubble dengan asymmetric border radius
- [ ] Selection style amber background

---

## 🔄 Updates & Maintenance

**Version**: 1.0  
**Last Updated**: 2 November 2026  
**Maintainer**: Kriya Mantra Design Team

**Change log:**  
- 2026-11-02: Initial design system documentation based on landing page

---

**Referensi:**  
- Landing page: `https://app-landing-page-template-one.vercel.app`
- Stylesheet: `styles.css`
- Design rationale: `DESIGNER_GUIDE_BALI.md`
