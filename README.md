# Boardify Pro

Boardify Pro is a modern Kanban-style productivity dashboard built with Angular 19, PrimeNG 19, and Tailwind CSS. It lets teams visualize work as interactive boards, drill into tabular and timeline views, and persist data locally via IndexedDB or JSON exports.

## Features
- **Responsive Kanban board** with drag-and-drop powered by Angular CDK and `app-board-list` components.
- **Multiple views**: Kanban board, tabular summary, and calendar-style timeline toggleable from the header toolbar.
- **Date-aware boards**: select any day via the PrimeNG `p-datepicker` to load or save snapshots for that date.
- **Card management**: quick-add sidebar (`app-add-card-accordion`) that supports task/report types and updates list status automatically.
- **Import / export**: download the current board as JSON or import an external JSON file through the header buttons.
- **Persistent storage**: boards are cached per-day in IndexedDB via `BoardService` and fall back to bundled JSON templates.
- **Dark, glassmorphism UI**: PrimeNG Dark theme + Tailwind classes for gradients, blur effects, and responsive layout.

## Technology Stack
- Angular 19 (standalone components, signals)
- PrimeNG 19 + PrimeIcons for UI widgets and icons
- Tailwind CSS 4 (via PostCSS) for utility-first styling
- RxJS 7 for reactive data flows
- IndexedDB (through `IndexedDbService`) for client-side persistence

## Prerequisites
- Node.js >= 18
- npm >= 9
- (Optional) Git for cloning the repository

## Getting Started

### 1. Clone and install dependencies
```bash
git clone https://github.com/your-org/boardify-pro.git
cd boardify-pro
npm install
```

### 2. Run the development server
```bash
npm start
```
Then open `http://localhost:4200/` in your browser. Angular’s dev server supports live reload; edits in `src/` update automatically.

### 3. Build for production
```bash
npm run build
```
The optimized bundle is emitted to `dist/boardify-pro/`. Deploy the contents of that folder to any static host (Netlify, Vercel, S3, Firebase Hosting, etc.).

### 4. Run tests (optional)
```bash
npm test
```
This starts Karma with Jasmine specs.

## Project Structure (highlights)
```
project/
├─ src/
│  ├─ app/
│  │  ├─ components/
│  │  │  ├─ board-container/     # Shell component, view toggles, date picker
│  │  │  ├─ board-list/          # Column rendering + drag and drop
│  │  │  ├─ board-card/          # Individual card view
│  │  │  └─ add-card-accordion/  # Sidebar to create cards
│  │  ├─ core/                   # Services (BoardService, IndexedDbService, etc.)
│  │  └─ models/                 # Type definitions for boards/cards
│  ├─ assets/apis/json/          # Source JSON snapshots (default + dated)
│  └─ styles.css                 # Global Tailwind + PrimeNG overrides
├─ angular.json
├─ package.json
└─ tailwind.config.ts
```

## Daily Board Workflow
1. **Pick a date** using the header date picker – Boardify loads the matching snapshot from IndexedDB, a date-specific JSON file in `assets/apis/json/`, or the default `board-data.json` if nothing exists.
2. **Switch views** from the header toggles:
   - Board (default Kanban)
   - Table (tabular summary with status/type badges)
   - Timeline (calendar grid inspired by Notion)
3. **Add cards** by opening the sidebar (menu button in the header). Newly created cards inherit the status of the list you choose.
4. **Drag & drop cards** between lists. Status updates automatically based on the destination list.
5. **Save or share** the current board:
   - Use the download icon to export JSON for the selected date.
   - Use the upload icon to import an external JSON file (must conform to the `Board` schema in `src/app/models/board.models.ts`).

## JSON Data Format
A board JSON file should include an `id`, `title`, `date`, and an array of `lists`. Each list contains its `id`, `title`, `status`, and a `cards` array. Example (shortened):
```json
{
  "id": "board-1",
  "title": "Boardify Pro",
  "date": "2025-10-04",
  "lists": [
    {
      "id": "list-1",
      "title": "To Do",
      "status": "todo",
      "cards": [
        {
          "id": "card-1",
          "title": "Design wireframes",
          "description": "Create low-fidelity wireframes for the main dashboard",
          "type": "task",
          "status": "todo"
        }
      ]
    }
  ]
}
```
When importing, Boardify validates the structure and merges it into the current state.

## Styling & Customization
- **Tailwind CSS** utilities are available globally in templates. Adjust tokens in `tailwind.config.ts` or extend component classes in their `.css` files.
- **PrimeNG Theme**: The app uses the PrimeNG dark theme (`@primeng/themes`). Swap themes or add overrides via `src/styles.css`.
- **Animations**: Header and card animations are driven by Tailwind utility classes such as `animate-[slideDown_0.5s_ease-out]`.
- **Date picker overlay**: The `p-datepicker` overlay is appended to `body` (see `board-container.component.html`) to avoid z-index clashes with board content.

## Troubleshooting
- **Date picker not updating**: Make sure browser blockers allow popups/overlays and that you are running the latest build (`npm start`). Clear IndexedDB data from DevTools > Application if cached boards conflict with new JSON.
- **Import errors**: Ensure the JSON matches the schema (`id`, `title`, `lists[]`, `cards[]`). The console will log structural issues.
- **Styling issues**: PrimeNG requires its CSS and PrimeIcons. Confirm they are imported in `src/styles.css` (already configured out of the box).

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "feat: add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
Specify your license here (e.g., MIT). Replace this line with the correct license information for your project.
