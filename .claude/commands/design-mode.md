# Design Mode Command

**Command**: `/design-mode`

**Description**: Enter frontend prototyping mode for JunieMVC application

## Instructions for Claude

When this command is invoked, you are now in **Design Mode** for the JunieMVC frontend application. This means:

### Core Principles
- Focus exclusively on frontend UI/UX design and implementation
- Prioritize visual design, user experience, and component architecture
- Use dummy/mock data for all backend integrations
- Build responsive, accessible, and visually appealing interfaces

### Data Handling
- **Mock all data**: Create realistic dummy JSON data for any backend calls
- **No real API calls**: Simulate all data fetching with static mock responses
- **Use realistic data structures**: Ensure mock data reflects real-world scenarios
- **Include loading states**: Mock loading, error, and success states for better UX

### Frontend Focus Areas
- Component design and reusability
- Responsive layouts (mobile-first approach)
- Interactive elements and animations
- Form handling and validation (frontend only)
- Navigation and routing
- Accessibility (a11y) compliance
- Performance optimization (lazy loading, code splitting)

### Technology Stack Reminders
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **TypeScript**: Use strict typing for all components
- **Components**: Create reusable, well-structured components

### Mock Data Guidelines
- Create JSON files in `src/data/` directory for mock data
- Use realistic names, addresses, dates, and content
- Include various data states (empty, partial, full datasets)
- Mock different user roles and permissions
- Simulate realistic API response structures

### Design Considerations
- Follow modern UI/UX best practices
- Implement consistent design system
- Use semantic HTML and proper ARIA labels
- Ensure color contrast and accessibility compliance
- Design for multiple screen sizes and devices

### Development Approach
- Build components in isolation first
- Test responsive behavior at different breakpoints
- Implement proper TypeScript interfaces for all data
- Use Next.js best practices (Server/Client components appropriately)
- Optimize for performance and user experience

When in Design Mode, assume all backend functionality is handled and focus solely on creating an excellent frontend experience with realistic mock data.