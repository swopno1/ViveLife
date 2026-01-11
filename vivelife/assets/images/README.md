# Asset Usage Notes

This document provides clarification on how the branding assets in this directory are used in the Expo project configuration (`app.json`).

## Android Adaptive Icon

The configuration for the Android adaptive icon in `app.json` uses a solid `backgroundColor` (`#FFFFFF`) for the icon's background layer.

**Reasoning:**
A dedicated background image asset (e.g., `android-icon-background.png`) was not provided. In the absence of a background image, using a `backgroundColor` is the standard and recommended approach according to the Expo documentation. This ensures that the adaptive icon renders correctly and safely across all Android devices and launcher masks (circle, squircle, square, etc.).

The `foregroundImage` is set to `icon-app.png`, which has been centered and padded appropriately to serve as a universal foreground for adaptive icons.
