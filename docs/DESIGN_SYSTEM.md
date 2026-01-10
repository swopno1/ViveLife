# ViveLife Design System Baseline (Tamagui)

This document defines the baseline design tokens for the ViveLife app using Tamagui.

## 1. Colors

We will use a simple, clean color palette.

```javascript
// A simple, modern color palette
export const color = {
  // Brand colors
  primary: '#007AFF', // A standard, accessible blue
  primaryLight: '#EBF5FF',
  accent: '#FF3B30', // For destructive actions or highlights

  // Neutral palette
  background: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#6E6E73',
  border: '#E5E5EA',
  card: '#F2F2F7',

  // Semantic colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};
```

## 2. Typography

A clean, sans-serif font will be used for readability. We'll use system fonts to keep the app lightweight.

```javascript
// Using Tamagui's built-in font size tokens
// We can define custom fonts if needed, but for MVP, defaults are fine.
// Sizes from $1 (xs) to $10 (xxl) can be used.

// Example usage in a component:
// <Text fontSize="$4" />
```

## 3. Spacing

Consistent spacing is key to a clean UI. We will use a 4-point grid system.

```javascript
// Tamagui's default spacing tokens are based on a 4-point grid.
// $1 = 4px, $2 = 8px, $3 = 12px, etc.
// We will stick to these defaults for consistency.

// Example usage:
// <View padding="$3" />
```

## 4. Radii

Consistent border radii for all elements.

```javascript
// Consistent border radius for cards, buttons, etc.
export const radius = {
  s: 4,
  m: 8,
  l: 16,
};
```

## 5. Z-Index

Manage stacking levels for modals, popovers, etc.

```javascript
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  modal: 10,
  popover: 20,
  toast: 30,
};
```

## 6. Component Styling

Components will be styled using Tamagui's styled() function or inline props.

- **Buttons**: Will have variants for `primary`, `secondary`, and `destructive` actions.
- **Inputs**: Simple, clean text inputs with clear focus states.
- **Cards**: Used for transactions, list items, etc., with a consistent shadow and padding.

This baseline provides a solid foundation for building a visually consistent and professional-looking MVP.
