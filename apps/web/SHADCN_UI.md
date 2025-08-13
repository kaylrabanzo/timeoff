# shadcn/ui Integration

This project now uses [shadcn/ui](https://ui.shadcn.com/) for all UI components, providing a beautiful, accessible, and customizable component library built on top of Radix UI and Tailwind CSS.

## What's Included

### Core Components
- **Button** - Various button styles and sizes
- **Card** - Content containers with header, content, and footer
- **Input** - Form input fields
- **Label** - Form labels
- **Badge** - Status indicators and tags
- **Progress** - Progress bars for leave balance visualization
- **Avatar** - User profile pictures with fallbacks
- **Separator** - Visual dividers

### Form Components
- **Form** - Complete form handling with react-hook-form and zod validation
- **Select** - Dropdown selections
- **Switch** - Toggle switches
- **Textarea** - Multi-line text inputs
- **Calendar** - Date picker component
- **Popover** - Floating content containers

### Layout Components
- **Dialog** - Modal dialogs
- **Sheet** - Slide-out panels
- **Tabs** - Tabbed content
- **Table** - Data tables
- **Skeleton** - Loading placeholders

### Feedback Components
- **Toast** - Notification system
- **Alert** - Status messages

## Usage Examples

### Leave Request Form
The `LeaveRequestForm` component demonstrates comprehensive form usage with:
- Form validation using Zod schemas
- Date picker with calendar
- Conditional form fields
- Toast notifications
- Proper accessibility

### Dashboard Components
All dashboard components have been updated to use shadcn/ui:
- `DashboardView` - Main dashboard layout
- `LeaveBalanceCard` - Progress bars for leave balance
- `RecentRequestsCard` - Badge components for status
- `QuickActionsCard` - Button variants
- `TeamAvailabilityCard` - Avatar components

### Examples Page
Visit `/examples` to see all components in action within the context of a timeoff management system.

## Adding New Components

To add new shadcn/ui components:

```bash
cd apps/web
npx shadcn@latest add [component-name]
```

## Customization

### Colors
The color scheme is defined in `src/app/globals.css` using CSS custom properties. You can customize:
- Primary colors
- Background colors
- Border colors
- Text colors

### Styling
All components use Tailwind CSS classes and can be customized by:
- Modifying the component variants
- Adding custom CSS classes
- Overriding the default styles

## Benefits

1. **Consistency** - All components follow the same design system
2. **Accessibility** - Built on Radix UI primitives with proper ARIA attributes
3. **Customizable** - Easy to modify colors, spacing, and behavior
4. **Type Safe** - Full TypeScript support
5. **Performance** - Only includes the components you use
6. **Modern** - Built with the latest React patterns and best practices

## Migration Notes

The existing UI components in `packages/ui` have been kept for backward compatibility, but new development should use the shadcn/ui components in `src/components/ui/`.

## Next Steps

1. Gradually migrate existing components to use shadcn/ui
2. Add more specialized components as needed
3. Create custom variants for specific use cases
4. Implement dark mode support
5. Add more form validation patterns 