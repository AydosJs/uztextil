# Color System Documentation

## Overview
This document describes the new color system implemented in the uztextil project. All hardcoded colors have been replaced with Tailwind CSS variables for better maintainability and consistency.

## Color Variables

### Brand Colors
- `brand-primary`: `#FCE803` (Main brand yellow)
- `brand-primary-foreground`: `#000000` (Black text on brand primary)
- `brand-secondary`: `#37393E` (Secondary brand color)
- `brand-secondary-foreground`: `#FFFFFF` (White text on brand secondary)

### Background Colors
- `background-primary`: `#181B20` (Main background)
- `background-secondary`: `#1D1F24` (Secondary background)
- `background-tertiary`: `#272B32` (Tertiary background)
- `background-card`: `rgba(255, 255, 255, 0.05)` (Card background)
- `background-card-hover`: `rgba(255, 255, 255, 0.08)` (Card hover state)

### Text Colors
- `text-primary`: `#FFFFFF` (Primary text)
- `text-secondary`: `#ACADAF` (Secondary text)
- `text-tertiary`: `#9FA0A1` (Tertiary text)
- `text-muted`: `#707579` (Muted text)

### Border Colors
- `border-primary`: `rgba(255, 255, 255, 0.1)` (Primary borders)
- `border-secondary`: `rgba(255, 255, 255, 0.05)` (Secondary borders)
- `border-tertiary`: `rgba(255, 255, 255, 0.04)` (Tertiary borders)
- `border-focus`: `#FCE803` (Focus state borders)

### Status Colors
- `status-success`: `#10B981` (Success states)
- `status-success-foreground`: `#000000` (Text on success)
- `status-error`: `#EF4444` (Error states)
- `status-error-foreground`: `#000000` (Text on error)
- `status-warning`: `#F59E0B` (Warning states)
- `status-warning-foreground`: `#000000` (Text on warning)
- `status-info`: `#3B82F6` (Info states)
- `status-info-foreground`: `#000000` (Text on info)

### Shadow Colors
- `shadow-primary`: `rgba(252, 232, 3, 0.32)` (Brand shadow)
- `shadow-secondary`: `rgba(255, 255, 255, 0.08)` (Card shadow)

## Usage Examples

### Tailwind Classes
```tsx
// Text colors
<p className="text-text-primary">Primary text</p>
<p className="text-text-secondary">Secondary text</p>
<p className="text-text-tertiary">Tertiary text</p>
<p className="text-text-muted">Muted text</p>

// Background colors
<div className="bg-background-primary">Main background</div>
<div className="bg-background-secondary">Secondary background</div>
<div className="bg-background-card">Card background</div>

// Border colors
<div className="border border-border-primary">Primary border</div>
<div className="border border-border-secondary">Secondary border</div>
<div className="focus:border-border-focus">Focus border</div>

// Brand colors
<button className="bg-brand-primary text-brand-primary-foreground">
  Brand button
</button>

// Status colors
<div className="text-status-success">Success message</div>
<div className="text-status-error">Error message</div>
<div className="text-status-warning">Warning message</div>
<div className="text-status-info">Info message</div>

// Shadows
<div className="shadow-brand">Brand shadow</div>
<div className="shadow-brand-lg">Large brand shadow</div>
<div className="shadow-card">Card shadow</div>
<div className="shadow-card-inset">Inset card shadow</div>
```

### CSS Variables (for custom styles)
```css
.custom-element {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-brand);
}
```

## Migration Summary

### Before (Hardcoded)
```tsx
<div className="bg-[#181B20] text-[#ACADAF] border-[#FFFFFF0A]">
  Content
</div>
```

### After (CSS Variables)
```tsx
<div className="bg-background-primary text-text-secondary border-border-primary">
  Content
</div>
```

## Benefits

1. **Consistency**: All colors are centralized and consistent across the application
2. **Maintainability**: Easy to update colors by changing CSS variables
3. **Theme Support**: Easy to implement light/dark themes in the future
4. **Developer Experience**: Clear, semantic color names
5. **Performance**: Tailwind CSS optimizes unused styles

## Files Modified

- `tailwind.config.js` - Added custom color variables
- `src/index.css` - Added CSS variable definitions
- All component files - Replaced hardcoded colors with Tailwind classes

## Future Enhancements

1. **Light Theme**: Add light theme color variables
2. **Color Variants**: Add lighter/darker variants of each color
3. **Accessibility**: Ensure proper contrast ratios
4. **Design Tokens**: Consider using a design token system for even better organization
