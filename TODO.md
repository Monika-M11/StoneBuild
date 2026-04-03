# Navigation Error Fixes - Progress Tracker

## Plan Overview
- Fix WARN: Remove invalid route "r" from app/_layout.tsx
- Fix ERROR: Replace router.back() with router.push('/') in app/login.tsx back button
- Test navigation flow

## Steps (Mark as [x] when complete)

- [x] Step 1: Edit app/_layout.tsx - Remove <Stack.Screen name="r" />, add getting-started screen
- [x] Step 2: Edit app/login.tsx - Update back button onPress to router.push('/')

- [ ] Step 3: Test app - Run expo start, navigate index → getting-started → login → back/home, confirm no errors

**Next:** Will update this file after each step.

