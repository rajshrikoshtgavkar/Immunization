# Adding New Pages - Migration Guide

## For Future Development

Now that the persistent navbar is implemented, follow these guidelines when adding new pages:

---

## ✅ DO: Add Routes to App.js

### For Admin Pages
```javascript
// In App.js, inside the admin Route group
<Route element={<PrivateRoute allowedRoles={['admin']}><MainLayout /></PrivateRoute>}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/your-new-page" element={<YourNewPage />} /> // ← Add here
</Route>
```

### For Parent Pages
```javascript
// In App.js, inside the parent Route group
<Route element={<PrivateRoute allowedRoles={['parent']}><MainLayout /></PrivateRoute>}>
  <Route path="/parent/dashboard" element={<ParentDashboard />} />
  <Route path="/parent/your-new-page" element={<YourNewPage />} /> // ← Add here
</Route>
```

---

## ✅ DO: Use AdminLayout or ParentLayout for Styling

### Option 1: Use Layout Wrapper (Recommended)
```javascript
// YourNewPage.js
import AdminLayout from '../components/AdminLayout';

const YourNewPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1>Your Page Content</h1>
        {/* Your page content here */}
      </div>
    </AdminLayout>
  );
};
```

### Option 2: No Layout (Plain Page)
```javascript
// YourNewPage.js
const YourNewPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1>Your Page Content</h1>
      {/* Your page content here */}
    </div>
  );
};
```

---

## ❌ DON'T: Import or Render Navbar

### ❌ WRONG
```javascript
import Navbar from '../components/Navbar'; // DON'T DO THIS

const YourNewPage = () => {
  return (
    <div>
      <Navbar /> {/* DON'T DO THIS */}
      <div>Your content</div>
    </div>
  );
};
```

### ✅ CORRECT
```javascript
// No navbar import needed!

const YourNewPage = () => {
  return (
    <div>
      {/* Navbar is automatically rendered by MainLayout */}
      <div>Your content</div>
    </div>
  );
};
```

---

## ❌ DON'T: Create Inline Wrappers in App.js

### ❌ WRONG
```javascript
<Route path="/admin/new-page" element={
  <PrivateRoute>
    <div className="min-h-screen">
      <nav>...</nav> {/* DON'T DO THIS */}
      <YourNewPage />
    </div>
  </PrivateRoute>
} />
```

### ✅ CORRECT
```javascript
// Inside the MainLayout Route group
<Route path="/admin/new-page" element={<YourNewPage />} />
```

---

## Adding Navbar Menu Items

### For Admin Navbar
Edit: `src/components/Navbar.js`

```javascript
const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/parents', label: 'Parents' },
  { path: '/admin/your-new-page', label: 'Your New Page' }, // ← Add here
];
```

### For Parent Navbar
Edit: `src/components/ParentNavbar.js`

```javascript
const navItems = [
  { path: '/parent/dashboard', label: 'Dashboard' },
  { path: '/parent/children', label: 'My Children' },
  { path: '/parent/your-new-page', label: 'Your New Page' }, // ← Add here
];
```

---

## Public Pages (No Authentication)

For pages that don't need authentication (like landing page):

```javascript
// In App.js, outside the MainLayout groups
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/login" element={<Login />} />
  
  {/* Authenticated routes below */}
  <Route element={<PrivateRoute>...}>
    ...
  </Route>
</Routes>
```

Public pages can have their own navbar or no navbar at all.

---

## Quick Checklist for New Pages

- [ ] Create page component in `src/pages/` or `src/pages/admin/` or `src/pages/parent/`
- [ ] Add route to App.js inside appropriate MainLayout group
- [ ] Use AdminLayout or ParentLayout for consistent styling (optional)
- [ ] DO NOT import or render Navbar component
- [ ] Add menu item to Navbar.js or ParentNavbar.js if needed
- [ ] Test navigation - navbar should stay visible

---

## Example: Adding "Settings" Page

### 1. Create Component
```javascript
// src/pages/admin/Settings.js
import React from 'react';
import AdminLayout from '../../components/AdminLayout';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {/* Settings content */}
      </div>
    </AdminLayout>
  );
};

export default Settings;
```

### 2. Add Route
```javascript
// src/App.js
import Settings from './pages/admin/Settings';

// Inside admin Route group
<Route path="/admin/settings" element={<Settings />} />
```

### 3. Add Menu Item
```javascript
// src/components/Navbar.js
const navItems = [
  // ... existing items
  { path: '/admin/settings', label: 'Settings' }
];
```

### 4. Test
- Navigate to /admin/settings
- Navbar should be visible
- Settings page should render
- Navigation should work

---

## Need Help?

Refer to:
- `NAVBAR_FIX_DOCUMENTATION.md` - Full technical details
- `NAVBAR_FIX_VISUAL_GUIDE.md` - Visual diagrams
- `NAVBAR_FIX_SUMMARY.md` - Quick reference

Or check existing pages like:
- `src/pages/AdminDashboard.js`
- `src/pages/ParentDashboard.js`
- `src/pages/ParentAlerts.js`
