# PostHog Analytics Usage Guide

PostHog is now integrated into the EG BrandSync frontend application.

## What's Been Set Up

1. **Package Installation**: `posthog-js` has been installed
2. **Environment Variables**: Added to `.env` and `.env.example`
3. **Instrumentation**: Created `instrumentation-client.ts` for automatic initialization
4. **Provider**: `PostHogProvider` automatically tracks page views and identifies users
5. **Utility Functions**: Helper functions in `src/lib/analytics/posthog.js`

## Configuration

The PostHog client is initialized in `instrumentation-client.ts` with:
- Automatic page view tracking
- Automatic page leave tracking
- Debug mode in development
- User identification integration with AuthContext

## Usage Examples

### Basic Event Tracking

```javascript
'use client'

import { captureEvent } from '@/lib/analytics/posthog'

export default function DownloadButton() {
  const handleDownload = (assetId) => {
    captureEvent('asset_downloaded', {
      asset_id: assetId,
      asset_type: 'icon',
      download_format: 'svg'
    })
  }

  return <button onClick={() => handleDownload('123')}>Download</button>
}
```

### User Actions

```javascript
import { captureEvent } from '@/lib/analytics/posthog'

// Track button clicks
captureEvent('button_clicked', { button_name: 'create_brand' })

// Track form submissions
captureEvent('form_submitted', {
  form_name: 'brand_settings',
  success: true
})

// Track feature usage
captureEvent('feature_used', {
  feature_name: 'theme_builder',
  action: 'export_tokens',
  format: 'css'
})
```

### Using Direct Import (Alternative)

```javascript
'use client'

import posthog from 'posthog-js'

export default function CheckoutPage() {
  function handlePurchase() {
    posthog.capture('purchase_completed', {
      amount: 99,
      currency: 'DKK'
    })
  }

  return <button onClick={handlePurchase}>Complete purchase</button>
}
```

### Feature Flags

```javascript
import { isFeatureEnabled, getFeatureFlagVariant } from '@/lib/analytics/posthog'

// Check if a feature is enabled
if (isFeatureEnabled('new_ui_design')) {
  // Show new UI
}

// Get feature flag variant
const variant = getFeatureFlagVariant('pricing_test')
if (variant === 'variant_a') {
  // Show pricing A
} else if (variant === 'variant_b') {
  // Show pricing B
}
```

### Manual User Identification (if needed)

User identification is automatically handled by `PostHogProvider` using AuthContext, but you can manually identify users if needed:

```javascript
import { identifyUser, setUserProperties } from '@/lib/analytics/posthog'

// Identify a user
identifyUser('user_123', {
  email: 'user@example.com',
  name: 'John Doe',
  role: 'ADMIN'
})

// Update user properties
setUserProperties({
  company: 'Egmont',
  subscription_tier: 'premium'
})
```

### Logout/Reset

```javascript
import { resetUser } from '@/lib/analytics/posthog'

function handleLogout() {
  resetUser() // Clear PostHog user data
  // ... rest of logout logic
}
```

## Common Events to Track

Consider tracking these events:

### Asset Management
- `asset_viewed`, `asset_downloaded`, `asset_uploaded`, `asset_deleted`
- `asset_search`, `asset_filtered`, `asset_favorited`

### Design System
- `component_viewed`, `token_exported`, `theme_created`
- `color_palette_modified`, `typography_changed`

### User Actions
- `user_login`, `user_logout`, `user_registered`
- `settings_updated`, `profile_edited`

### Navigation
- `navigation_clicked`, `breadcrumb_clicked`
- `external_link_clicked`

### Forms
- `form_started`, `form_completed`, `form_abandoned`
- `form_validation_error`

## Environment Variables

Make sure these are set in your deployment environment:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_actual_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Development vs Production

- In **development**: PostHog runs in debug mode (check browser console)
- In **production**: Events are sent to PostHog servers

## Privacy Considerations

PostHog automatically captures:
- Page views
- User interactions (clicks, form submissions)
- User identity (from AuthContext)

To disable automatic tracking for sensitive pages, you can conditionally render the PostHogProvider or use PostHog's privacy features.

## Resources

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog JS SDK](https://posthog.com/docs/libraries/js)
- [Feature Flags Guide](https://posthog.com/docs/feature-flags)
