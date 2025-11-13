# ATS Status Badge Color System

This document defines the consistent color scheme for all status badges across the ATS module to ensure visual consistency and proper semantic meaning.

## Color Mapping by Context

### Interview Status Colors
| Status | Color | RGB | Meaning |
|--------|-------|-----|---------|
| **Scheduled** | Blue | bg-blue-100 / text-blue-800 | Information - Interview is pending/planned |
| **Completed** | Green | bg-green-100 / text-green-800 | Success - Interview finished successfully |
| **Cancelled** | Red | bg-red-100 / text-red-800 | Error/Danger - Interview cancelled |
| **No Show** | Amber | bg-amber-100 / text-amber-800 | Warning - Candidate didn't show up |

### Application Status Colors
| Status | Color | RGB | Meaning |
|--------|-------|-----|---------|
| **Submitted** | Blue | bg-blue-100 / text-blue-800 | Information - Initial state |
| **Shortlisted** | Green | bg-green-100 / text-green-800 | Success - Candidate moved forward |
| **Interviewed** | Purple | bg-purple-100 / text-purple-800 | Primary - Interview stage |
| **Offered** | Cyan | bg-cyan-100 / text-cyan-800 | Alternative - Offer extended |
| **Hired** | Emerald | bg-emerald-100 / text-emerald-800 | Strong Success - Final positive |
| **Rejected** | Red | bg-red-100 / text-red-800 | Error - Negative outcome |
| **Withdrawn** | Gray | bg-gray-100 / text-gray-800 | Neutral - Inactive state |

### Candidate Status Colors
| Status | Color | RGB | Meaning |
|--------|-------|-----|---------|
| **New** | Blue | bg-blue-100 / text-blue-800 | Information - Recently added |
| **In Process** | Yellow | bg-yellow-100 / text-yellow-800 | Warning - Active screening |
| **Interviewed** | Purple | bg-purple-100 / text-purple-800 | Primary - Interview stage |
| **Offered** | Green | bg-green-100 / text-green-800 | Success - Offer extended |
| **Hired** | Emerald | bg-emerald-100 / text-emerald-800 | Strong Success - Onboarded |
| **Rejected** | Red | bg-red-100 / text-red-800 | Error - Not selected |

## Color Meanings (Universal)

### Semantic Colors
- **Blue** (bg-blue-100 / text-blue-800): Information, Initial, Pending, Scheduled
- **Green** (bg-green-100 / text-green-800): Success, Positive, Completed, Shortlisted
- **Red** (bg-red-100 / text-red-800): Error, Danger, Cancelled, Rejected
- **Amber** (bg-amber-100 / text-amber-800): Warning, Attention needed, No Show
- **Purple** (bg-purple-100 / text-purple-800): Primary action, Interview/Process stage
- **Cyan** (bg-cyan-100 / text-cyan-800): Alternative, Offer, Secondary positive
- **Emerald** (bg-emerald-100 / text-emerald-800): Strong success, Final positive, Hired
- **Yellow** (bg-yellow-100 / text-yellow-800): Warning, In process, Active screening
- **Gray** (bg-gray-100 / text-gray-800): Neutral, Inactive, Withdrawn

## Implementation Rules

1. **Never use Badge component variants** - Always use direct Tailwind classes for status badges
2. **Always include border color** - Use matching border-{color}-300 for visual separation
3. **Consistent dot colors** - Use saturated colors (500-600) for indicator dots
4. **Icon usage** - Include semantic icons:
   - Clock (Scheduled)
   - CheckCircle (Completed)
   - XCircle (Cancelled)
   - AlertCircle (No Show)
   
5. **Typography** - All badges use:
   - `text-xs` for font size
   - `font-medium` for weight
   - `px-3 py-1` for padding (main badge)
   - `px-2.5 py-0.5` for compact indicator

## Usage Examples

```tsx
// Interview Status Badge
<InterviewStatusBadge status="scheduled" /> // Blue badge with Clock icon
<InterviewStatusBadge status="completed" /> // Green badge with CheckCircle icon

// Application Status Badge
<ApplicationStatusBadge status="shortlisted" /> // Green badge
<ApplicationStatusBadge status="rejected" /> // Red badge

// Candidate Status Badge
<CandidateStatusBadge status="hired" /> // Emerald badge
<CandidateStatusBadge status="in_process" /> // Yellow badge

// Status Indicator (Compact)
<InterviewStatusIndicator status="no_show" /> // Amber compact badge

// Status Dot (Minimal)
<InterviewStatusDot status="scheduled" /> // Blue dot indicator
```

## DO's and DON'Ts

### ✅ DO
- Use explicit bg and text colors (never rely on Badge variants)
- Include borders for better visual separation
- Use semantic colors that match their meaning
- Update this file when adding new statuses
- Test colors in both light and dark themes

### ❌ DON'T
- Use `<Badge variant="something">` for status badges
- Mix color meanings (e.g., don't use green for error)
- Forget to include borders
- Use orange for warnings (use amber instead for consistency)
- Override colors with arbitrary classes

## Future Considerations

- When adding new status types, maintain this color scheme
- If dark theme support is needed, define dark mode colors
- Consider accessibility contrast ratios (WCAG AA minimum)
- All current colors pass WCAG AA for text contrast
