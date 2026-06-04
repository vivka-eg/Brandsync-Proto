// Frontend-only sidebar tree. Patterns are fetched from the real API.
export const DUMMY_CATEGORIES = [
  {
    id: "dashboard",
    name: "Dashboard",
    subCategories: [
      { id: "tabular-dashboard",    name: "Tabular Dashboard" },
      { id: "analytical-dashboard", name: "Analytical Dashboard" },
      { id: "grid-based-dashboard", name: "Grid Based Dashboard" },
    ],
  },
  {
    id: "form",
    name: "Form",
    subCategories: [
      { id: "login-form",        name: "Login Form" },
      { id: "registration-form", name: "Registration Form" },
      { id: "contact-form",      name: "Contact Form" },
      { id: "multi-step-form",   name: "Multi Step Form" },
      { id: "search-form",       name: "Search Form" },
    ],
  },
  {
    id: "cards",
    name: "Cards",
    subCategories: [
      { id: "product-card", name: "Product Card" },
      { id: "profile-card", name: "Profile Card" },
      { id: "stats-card",   name: "Stats Card" },
      { id: "info-card",    name: "Info Card" },
    ],
  },
  {
    id: "navigation",
    name: "Navigation",
    subCategories: [
      { id: "top-nav",     name: "Top Navigation" },
      { id: "sidebar-nav", name: "Sidebar Navigation" },
      { id: "breadcrumb",  name: "Breadcrumb" },
      { id: "tabs",        name: "Tabs" },
    ],
  },
  {
    id: "tables",
    name: "Tables",
    subCategories: [
      { id: "data-table",     name: "Data Table" },
      { id: "sortable-table", name: "Sortable Table" },
      { id: "editable-table", name: "Editable Table" },
    ],
  },
  {
    id: "modals",
    name: "Modals",
    subCategories: [
      { id: "confirmation-modal", name: "Confirmation Modal" },
      { id: "form-modal",         name: "Form Modal" },
      { id: "info-modal",         name: "Info Modal" },
    ],
  },
  {
    id: "graphs",
    name: "Graphs",
    subCategories: [
      { id: "bar-chart",  name: "Bar Chart" },
      { id: "line-chart", name: "Line Chart" },
      { id: "pie-chart",  name: "Pie Chart" },
      { id: "area-chart", name: "Area Chart" },
    ],
  },
];
