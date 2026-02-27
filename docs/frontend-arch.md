# Document 1: Frontend Architecture & Landing Page Design

## Tech Stack

* **Framework:** Next.js (App Router for optimized routing and Server Components)
* **Styling:** Tailwind CSS
* **Component Libraries:** * **Shadcn UI:** For robust, accessible core components (Buttons, Inputs, Forms, Dialogs, Cards).
  * **Magic UI:** For visually appealing sections (Bento grids, Marquee reviews, Animated Backgrounds).
  * **React Bits:** For micro-interactions and animated text/elements.

## Landing Page Structure (8 Sections)

The landing page (`/`) will serve as the entry point for both guest users and returning users.

1. **Hero Section (Interactive & Animated)**
   * *Visuals:* Magic UI animated background (e.g., Particles or Retro Grid) with a dynamic headline using React Bits text animations.
   * *Core Functionality:* The primary Search Bar. Users can type natural language queries:  *"Plan a 3-day trip to northern Pakistan under 25,000 PKR"* .
   * *Action:* Search button triggers a loading state and redirects to the results/planner page.
2. **How It Works (Process Steps)**
   * A simple 3-step timeline: 1. Tell us your preferences -> 2. AI curates your trip -> 3. Pack your bags.
3. **Real-Time "Travel Suggestions" (Dynamic)**
   * Use Shadcn Cards to display dynamically fetched generic suggestions:
     * "Top Adventure Spots under 20,000 PKR"
     * "Best Weekend Destinations Near You"
4. **Trending Recommended Destinations**
   * A grid (Magic UI Bento Grid) showcasing top-rated destinations from the database (e.g., Hunza, Gwadar) with images, average costs, and weather badges.
5. **Travel Styles & Categories**
   * Clickable category pills/cards (Adventure, Relaxation, Family, Historical, Cultural). Clicking these acts as a quick filter for guest browsing.
6. **Social Proof / User Testimonials**
   * Magic UI `Marquee` component displaying scrolling reviews from happy travelers who saved money using the app.
7. **Interactive Budget Estimator Teaser**
   * A small interactive widget where users drag a budget slider, and the background image shifts to a destination that fits that budget.
8. **Footer & Call-To-Action (CTA)**
   * *CTA:* "Save your preferences for personalized trips. Sign up now!" (Leads to registration).
   * *Footer Links:* About, Contact, Privacy Policy, Admin Login link.

## State Management

* **Zustand** or **React Context** to handle the user's current session, saved trips, and the active search query state across the app.
