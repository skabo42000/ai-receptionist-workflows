# Third-party assets

- `assets/photos/`: illustrative Unsplash stock photos; see the [Unsplash license](https://unsplash.com/license). These are not customer photos or result screenshots.
- `assets/fonts/InstrumentSerif-*.ttf`: Instrument Serif, distributed under SIL Open Font License 1.1; accompanying license in `assets/fonts/OFL.txt`.
- UI components and npm dependencies retain their respective licenses.
- `styles/shadcn.css` is the static Tailwind utility stylesheet from shadcn 4.21.1. Its MIT license is preserved in `styles/LICENSE-shadcn.md`. Vendoring this stylesheet avoids installing the component-generation CLI and its vulnerable dependency chain; existing component source remains in `components/ui/`.
