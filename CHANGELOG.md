# Changelog

## 1.0.1 - 2026-09-08

- HACS runtime converted to one fully standalone `Bambulab-Dashboard.js` file.
- Fixed `Custom element doesn't exist: bambu-lab-dashboard` caused by relative module imports.
- Added automatic per-model printer artwork using the existing images from `greghesp/ha-bambulab-cards`.
- Added graceful printer-image fallback when an upstream image is unavailable.
- Expanded the hero design with printer visual, print thumbnail, progress ring and responsive layout.
- Added periodic registry rediscovery so printers/AMS added later appear without editing the card configuration.
- Added a browser-registration smoke test in addition to discovery tests.

## 1.0.0 - 2026-09-08

- Initial preview.
