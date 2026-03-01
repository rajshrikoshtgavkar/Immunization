# Module 4: Vaccine Alerts & Smart Notifications

## Overview
Module 4 implements an intelligent notification system that automatically identifies eligible children for vaccines and sends targeted alerts to their parents. Features a calm, medical-themed UI with unread indicators and mark-as-read functionality.

## Backend Implementation

### New Model

#### Alert Model (`models/Alert.js`)
```javascript
{
  title: String (required),
  message: String (required),
  vaccine: ObjectId → Vaccine (required),
  eligibleChildren: [ObjectId → Child],
  createdBy: ObjectId → User (admin),
  isActive: Boolean (default: true),
  readBy: [{
    parent: ObjectId → User,
    readAt: Date
  }],
  createdAt: Date (auto)
}
```

### API Endpoints

#### Admin Endpoints (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/alerts` | Create alert for eligible children |
| GET | `/api/admin/alerts` | List all alerts |
| GET | `/api/admin/alerts/:id` | Get alert details |
| GET | `/api/admin/alerts/preview/:vaccineId` | Preview eligible children count |

#### Parent Endpoints (Parent Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parent/alerts` | Get alerts for parent's children only |
| PATCH | `/api/parent/alerts/:id/read` | Mark alert as read |

### Business Logic

**Alert Creation Flow:**
1. Admin selects vaccine
2. System fetches all children from database
3. System uses eligibility engine (Module 3) to filter eligible children
4. Alert created with eligible children IDs
5. Parents see alerts only for their own children

**Security:**
- Admins can create alerts for any vaccine
- Parents only see alerts for their own children
- Read status tracked per parent
- Role-based access control enforced

## Frontend Implementation

### Admin Pages

#### 1. Create Alert (`/admin/alerts/create`)

**Features:**
- Vaccine selection dropdown
- Auto-preview of eligible children count
- Title input field
- Message textarea
- Confirmation modal before sending
- Blue/cyan gradient theme

**UI Flow:**
1. Select vaccine → Shows eligible count
2. Enter title and message
3. Click "Send Alert" → Confirmation modal
4. Confirm → Alert sent to parents

#### 2. Alerts List (`/admin/alerts`)

**Features:**
- Card-based grid layout
- Each card shows:
  - Vaccine name with icon
  - Alert title
  - Message preview (2 lines)
  - Number of children notified
  - Date created
  - Active/Inactive status badge
- "Create Alert" button
- Empty state with helpful message

**UI Highlights:**
- Blue gradient theme
- Vaccine shield icon
- Hover effects on cards
- Responsive grid (1→2→3 columns)

### Parent Pages

#### 3. Parent Alerts (`/parent/alerts`)

**Features:**
- Timeline-style alert cards
- Unread count badge in header
- Each alert shows:
  - Vaccine name
  - Alert title and message
  - Child names (with icons)
  - Date received
  - "New" badge for unread
  - "Mark as read" button
- Unread alerts highlighted (blue background)
- Read alerts in normal white background
- Empty state

**UI Highlights:**
- Calm blue/green medical colors
- Clear unread vs read distinction
- Child name badges
- Smooth mark-as-read animation
- Responsive layout

## Alert Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  1. Admin Creates Alert                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. Select Vaccine (e.g., DPT)                          │
│     System shows: "42 eligible children"                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Enter Title & Message                               │
│     Title: "Time for DPT Vaccination"                   │
│     Message: "Your child is now eligible..."            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. Backend Eligibility Check                           │
│     - Fetch all children                                │
│     - For each child:                                   │
│       • Calculate age in days                           │
│       • Check if age >= vaccine min age                 │
│       • Add to eligible list if true                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  5. Alert Created in Database                           │
│     eligibleChildren: [child1, child2, child3...]       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  6. Parents Login & View Alerts                         │
│     - Parent A sees alerts for their children only      │
│     - Parent B sees alerts for their children only      │
│     - Unread alerts highlighted                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  7. Parent Marks Alert as Read                          │
│     - Alert background changes to white                 │
│     - "New" badge removed                               │
│     - Unread count decreases                            │
└─────────────────────────────────────────────────────────┘
```

## Eligibility-Based Alert Generation

**Example Scenario:**

```
Vaccine: DPT (Min Age: 6 weeks = 42 days)

Database Children:
- Child A (30 days old) → NOT ELIGIBLE ✗
- Child B (50 days old) → ELIGIBLE ✓
- Child C (100 days old) → ELIGIBLE ✓
- Child D (20 days old) → NOT ELIGIBLE ✗

Alert Created:
eligibleChildren: [Child B, Child C]

Parent 1 (has Child A & B):
  - Sees alert for Child B only

Parent 2 (has Child C & D):
  - Sees alert for Child C only
```

## Security & Privacy

**Parent Isolation:**
- Parents ONLY see alerts for their own children
- Backend filters alerts by parent's children IDs
- No cross-parent data leakage

**Read Status:**
- Tracked per parent (not globally)
- Parent A marking as read doesn't affect Parent B
- Stored in `readBy` array with parent ID and timestamp

## File Structure

```
backend/
├── models/
│   └── Alert.js                      ✨ NEW
├── controllers/
│   ├── adminController.js            🔄 UPDATED (added alert endpoints)
│   └── parentController.js           ✨ NEW
├── routes/
│   ├── adminRoutes.js                🔄 UPDATED (added alert routes)
│   └── parentRoutes.js               ✨ NEW
└── server.js                         🔄 UPDATED (added parent routes)

frontend/src/
├── pages/
│   ├── admin/
│   │   ├── AlertsList.js             ✨ NEW
│   │   └── CreateAlert.js            ✨ NEW
│   ├── ParentAlerts.js               ✨ NEW
│   ├── AdminDashboard.js             🔄 UPDATED (added Alerts nav)
│   └── ParentDashboard.js            🔄 UPDATED (added Notifications nav)
└── App.js                            🔄 UPDATED (added alert routes)
```

## UI Color Scheme

**Module 4 Colors:**
- **Primary**: Blue → Cyan gradient (`from-blue-500 to-cyan-500`)
- **Unread**: Blue background (`bg-blue-50`, `border-blue-200`)
- **Read**: White background (`bg-white`, `border-gray-100`)
- **New Badge**: Red (`bg-red-500`)
- **Success**: Green (for mark as read)

## Testing the Features

### Test Flow

1. **Create Sample Vaccines** (if not done):
   - BCG (0 days)
   - DPT (6 weeks)
   - MMR (9 months)

2. **Create Sample Children** (with different ages):
   - Child A: Born today
   - Child B: Born 2 months ago
   - Child C: Born 1 year ago

3. **Create Alert as Admin**:
   - Login as admin
   - Navigate to "Alerts"
   - Click "Create Alert"
   - Select "DPT" vaccine
   - See eligible count (should show children >= 6 weeks)
   - Enter title: "DPT Vaccination Due"
   - Enter message: "Your child is now eligible for DPT vaccine"
   - Click "Send Alert" → Confirm

4. **View Alerts as Parent**:
   - Logout admin
   - Login as parent
   - Navigate to "Notifications"
   - See alerts for your children only
   - Notice unread alerts highlighted in blue
   - Click "Mark as read"
   - See alert change to white background

## Key Features

### Admin Features
- ✅ Create targeted alerts for specific vaccines
- ✅ Auto-preview eligible children count
- ✅ View all sent alerts
- ✅ See notification statistics

### Parent Features
- ✅ View alerts for own children only
- ✅ See unread count badge
- ✅ Distinguish unread vs read alerts
- ✅ Mark alerts as read
- ✅ See which children are affected

### Smart Features
- ✅ Automatic eligibility calculation
- ✅ Reuses Module 3 eligibility engine
- ✅ Privacy-preserving (parent isolation)
- ✅ Read status tracking
- ✅ Real-time unread count

## Module 4 Complete! ✅

All requirements delivered:
- ✅ Alert model with vaccine and children references
- ✅ Admin-only alert creation APIs
- ✅ Parent-only alert viewing APIs
- ✅ Eligibility-based alert generation
- ✅ Admin alert creation UI with preview
- ✅ Admin alerts list page
- ✅ Parent notifications page
- ✅ Unread/read distinction
- ✅ Mark-as-read functionality
- ✅ Calm medical color scheme
- ✅ Responsive design
- ✅ Privacy & security enforced

**Ready for Module 5: Vaccination Records & Tracking!** 🚀
