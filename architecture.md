# Architecture Document

## 1. Tech Stack
*   **Frontend Framework:** React.js initialized via Vite for fast development and optimized production builds.
*   **Styling:** Vanilla CSS utilizing CSS Variables for a centralized, highly customizable design system.
*   **Deployment Target:** Static hosting (e.g., Vercel, Netlify, or standard web hosting).

## 2. Application Structure
The application follows a modular, component-based architecture within a Single Page Application (SPA) paradigm.

```
d:\Ankita\
├── public/
│   └── assets/             # Static assets (images, logos)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.jsx      # Generic button component
│   │   ├── Footer.jsx      # Site footer
│   │   ├── Navbar.jsx      # Sticky top navigation
│   │   └── ProjectCard.jsx # Portfolio item display
│   ├── App.jsx             # Main application layout & sections
│   ├── App.css             # Section-specific styles
│   ├── index.css           # Global design system & variables
│   └── main.jsx            # React entry point
├── prd.md                  # Requirements
├── architecture.md         # This file
└── rules.md                # Development guidelines
```

## 3. State Management
*   **Local State:** Managed via React Hooks (`useState`, `useEffect`). Used primarily for UI interactions (e.g., Navbar scroll effect).
*   **Global State:** Not currently required due to the static portfolio nature of the app. If required later, Context API will be used.

## 4. Navigation & Routing
*   Currently utilizes smooth-scrolling anchor links for a seamless single-page experience.
*   If multiple distinct pages are added in the future, `react-router-dom` will be introduced.
