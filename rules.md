# Project Rules & Guidelines

## 1. Styling & CSS Rules
*   **Use CSS Variables:** All colors, fonts, spacing, and transition speeds MUST be referenced from the CSS variables defined in `src/index.css` (e.g., `var(--color-primary)`).
*   **No Inline Styles:** Avoid inline styling (`style={{...}}`) unless dynamically calculating a value that cannot be handled by CSS.
*   **Vanilla CSS:** Stick to standard CSS. Do not introduce Tailwind CSS or styled-components to maintain consistency.
*   **Responsive First:** Ensure all components are responsive using media queries. Avoid fixed pixel widths where possible; prefer percentages or `rem`.

## 2. Component Guidelines
*   **Functional Components:** Use React functional components and Hooks. Avoid class-based components.
*   **Reusability:** If a UI element is used more than twice, extract it into a component in `src/components/`.
*   **Naming Conventions:**
    *   Components: PascalCase (e.g., `ProjectCard.jsx`).
    *   CSS Files: Match the component name exactly (e.g., `ProjectCard.css`).
    *   CSS Classes: kebab-case (e.g., `.project-card-title`).

## 3. Asset Management
*   **Images:** All static images and logos must be stored in the `public/assets/` directory.
*   **Optimization:** Ensure images are optimized for web (compressed) before pushing to production to maintain fast load times.

## 4. Code Quality
*   Keep functions small and focused on a single responsibility.
*   Maintain clear and concise comments for complex logic.
*   Ensure there are no console errors or warnings in the development environment.
