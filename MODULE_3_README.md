# Module 3: Vaccine Master & DOB-Based Eligibility Engine

## Overview
Module 3 implements a comprehensive vaccine management system with intelligent age-based eligibility calculation. Features a beautiful medical-themed UI with modern table design and visual eligibility indicators.

## Backend Implementation

### New Model

#### Vaccine Model (`models/Vaccine.js`)
```javascript
{
  name: String (required),
  description: String (required),
  totalDoses: Number (required, min: 1),
  gapBetweenDoses: Number (required, min: 0, in days),
  minAgeValue: Number (required, min: 0),
  minAgeUnit: Enum ['days', 'weeks', 'months', 'years'] (required),
  isActive: Boolean (default: true),
  createdAt: Date (auto)
}
```

### Eligibility Engine (`utils/eligibility.js`)

**Core Functions:**

1. **convertToDays(value, unit)**
   - Converts any age unit to days
   - Conversions: days=1, weeks=7, months=30, years=365
   
2. **calculateAgeInDays(dateOfBirth)**
   - Calculates child's current age in days
   - Uses current date minus DOB
   
3. **isEligible(childDOB, vaccine)**
   - Determines if child meets minimum age requirement
   - Returns boolean: true if eligible, false otherwise
   
4. **formatAge(value, unit)**
   - Formats age for display (e.g., "6 weeks")

**Eligibility Logic:**
```
Child Age (days) >= Vaccine Min Age (days) = ELIGIBLE
Child Age (days) < Vaccine Min Age (days) = NOT ELIGIBLE
```

**Example:**
```javascript
Child DOB: 2024-01-01
Today: 2024-06-01
Child Age: ~150 days

Vaccine: BCG (min age: 0 days) → ELIGIBLE ✓
Vaccine: MMR (min age: 9 months = 270 days) → NOT ELIGIBLE ✗
```

### API Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/vaccines` | Create new vaccine |
| GET | `/api/admin/vaccines` | List all vaccines |
| PUT | `/api/admin/vaccines/:id` | Update vaccine |
| DELETE | `/api/admin/vaccines/:id` | Soft delete (set isActive=false) |
| GET | `/api/admin/eligible-vaccines/:childId` | Get vaccines with eligibility for child |

### Security
- All routes protected with `protect` middleware
- All routes restricted to admin role
- Input validation on all fields
- Soft delete preserves data integrity

## Frontend Implementation

### New Pages

#### 1. Vaccines List (`/admin/vaccines`)

**Features:**
- Modern table design with soft borders
- Gradient header (purple → indigo)
- Columns:
  - Vaccine name & description
  - Minimum age (with icon badge)
  - Total doses
  - Gap between doses
  - Active/Inactive toggle
  - Edit action
- Add/Edit vaccine modal
- Loading skeleton
- Empty state

**UI Highlights:**
- Purple/indigo gradient theme
- Age displayed with clock icon
- Active/Inactive toggle button
- Hover effects on rows
- Responsive table design

#### 2. Add/Edit Vaccine Modal

**Form Fields:**
- Vaccine name (text input)
- Description (textarea)
- Total doses (number, min: 1)
- Gap between doses in days (number, min: 0)
- Minimum age value (number, min: 0)
- Age unit (dropdown: days/weeks/months/years)

**Features:**
- Dual-purpose (add new or edit existing)
- Grid layout for organized fields
- Validation on all inputs
- Smooth scale-in animation
- Gradient submit button

#### 3. Child Eligibility View (`/admin/child-eligibility/:childId`)

**Features:**
- Large gradient child info card
  - Child name, DOB, calculated age
  - Purple → indigo gradient
- Two sections:
  - **Eligible Vaccines** (green theme)
    - Green border cards
    - Check icon
    - "Eligible" badge
  - **Not Yet Eligible** (gray theme)
    - Gray/disabled appearance
    - Lock icon
    - "Not Yet" badge
- Each vaccine card shows:
  - Name & description
  - Min age requirement
  - Total doses
  - Gap between doses
- Back navigation
- Empty states for both sections

**UI Highlights:**
- Clear visual distinction (green vs gray)
- Icon-based status indicators
- Responsive grid layout
- Detailed vaccine information

#### 4. Updated Parent Detail Page

**New Feature:**
- "Vaccines" button added to each child card
- Navigates to child eligibility view
- Purple theme to match vaccine module

### Color Scheme

**Module 3 Colors:**
- **Primary**: Purple → Indigo gradient (`from-purple-500 to-indigo-500`)
- **Eligible**: Green (`green-500`, `green-100`)
- **Not Eligible**: Gray (`gray-400`, `gray-200`)
- **Age Badge**: Blue (`blue-50`, `blue-700`)

## Eligibility Calculation Flow

```
┌─────────────────────────────────────────────────────────┐
│  1. User clicks "Vaccines" on child card                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. Frontend requests: GET /api/admin/eligible-vaccines │
│     /childId                                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Backend fetches child DOB from database             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. Backend fetches all active vaccines                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  5. For each vaccine:                                   │
│     a. Calculate child age in days                      │
│     b. Convert vaccine min age to days                  │
│     c. Compare: childAge >= vaccineMinAge               │
│     d. Set eligible: true/false                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  6. Return vaccines array with eligibility flags        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  7. Frontend separates into eligible/not eligible       │
│     and displays in respective sections                 │
└─────────────────────────────────────────────────────────┘
```

## Eligibility Examples

### Example 1: Newborn (10 days old)
```
Child Age: 10 days

BCG (0 days) → ELIGIBLE ✓
OPV-0 (0 days) → ELIGIBLE ✓
Hepatitis B (0 days) → ELIGIBLE ✓
DPT-1 (6 weeks = 42 days) → NOT ELIGIBLE ✗
MMR (9 months = 270 days) → NOT ELIGIBLE ✗
```

### Example 2: 3-month-old (90 days)
```
Child Age: 90 days

BCG (0 days) → ELIGIBLE ✓
DPT-1 (6 weeks = 42 days) → ELIGIBLE ✓
DPT-2 (10 weeks = 70 days) → ELIGIBLE ✓
DPT-3 (14 weeks = 98 days) → NOT ELIGIBLE ✗
MMR (9 months = 270 days) → NOT ELIGIBLE ✗
```

### Example 3: 1-year-old (365 days)
```
Child Age: 365 days

All vaccines → ELIGIBLE ✓
(Assuming max min age is 12 months)
```

## Technical Highlights

### Backend
- Reusable eligibility utility functions
- Efficient age conversion algorithm
- Soft delete for data preservation
- Active/inactive toggle for vaccine management
- Clean separation of concerns

### Frontend
- Real-time eligibility calculation
- Visual status indicators (icons, colors, badges)
- Responsive grid layouts
- Loading states and error handling
- Smooth animations
- Medical/healthcare color palette

## File Structure

```
backend/
├── models/
│   └── Vaccine.js                    ✨ NEW
├── utils/
│   └── eligibility.js                ✨ NEW
├── controllers/
│   └── adminController.js            🔄 UPDATED (added vaccine endpoints)
└── routes/
    └── adminRoutes.js                🔄 UPDATED (added vaccine routes)

frontend/src/
├── pages/admin/
│   ├── VaccinesList.js               ✨ NEW
│   ├── ChildEligibility.js           ✨ NEW
│   └── ParentDetail.js               🔄 UPDATED (added Vaccines button)
├── pages/
│   └── AdminDashboard.js             🔄 UPDATED (added Vaccines nav)
└── App.js                            🔄 UPDATED (added vaccine routes)
```

## Setup & Testing

### No Additional Dependencies
Module 3 uses existing packages - no new installations needed!

### Testing Flow

1. **Add Vaccines:**
   - Login as admin
   - Navigate to "Vaccines" in menu
   - Click "Add Vaccine"
   - Fill form:
     - Name: "BCG"
     - Description: "Bacillus Calmette-Guérin vaccine"
     - Total Doses: 1
     - Gap: 0 days
     - Min Age: 0 days
   - Submit

2. **Add More Vaccines:**
   - DPT (6 weeks, 3 doses, 28 days gap)
   - MMR (9 months, 2 doses, 90 days gap)
   - Hepatitis B (0 days, 3 doses, 30 days gap)

3. **Check Eligibility:**
   - Go to Parents → Select Parent → View Children
   - Click "Vaccines" on any child card
   - See eligible vaccines (green) and not eligible (gray)
   - Verify age-based logic

4. **Test Edge Cases:**
   - Child born today → Only 0-day vaccines eligible
   - Child 1 year old → All vaccines eligible
   - Toggle vaccine active/inactive → Affects eligibility list

## UI/UX Design Principles

### Medical Theme
- Purple/indigo for vaccine module (medical/pharmaceutical)
- Green for eligible (healthy, go-ahead)
- Gray for not eligible (waiting, not ready)
- Clean, professional aesthetic

### Visual Hierarchy
1. Child info card (large, gradient, prominent)
2. Eligible vaccines section (green accent)
3. Not eligible vaccines section (subdued gray)

### Information Architecture
- Most important info first (eligible vaccines)
- Clear visual separation between sections
- Consistent card-based design
- Icon-based status indicators

### Accessibility
- High contrast colors
- Clear labels and badges
- Icon + text for status
- Keyboard navigable
- Screen reader friendly

## Module 3 Complete! ✅

All requirements delivered:
- ✅ Vaccine model with age eligibility fields
- ✅ Admin-only vaccine CRUD APIs
- ✅ Eligibility calculation engine
- ✅ DOB-based age calculation
- ✅ Reusable utility functions
- ✅ Modern table UI for vaccines
- ✅ Add/Edit vaccine modal
- ✅ Child eligibility view with visual indicators
- ✅ Eligible/Not eligible separation
- ✅ Medical color palette
- ✅ Responsive design
- ✅ Loading states & error handling

**Ready for Module 4: Vaccination Records & Scheduling!** 🚀
