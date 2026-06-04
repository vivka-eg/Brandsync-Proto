import posthog from 'posthog-js'

/**
 * Capture a custom event
 * @param {string} eventName - The name of the event
 * @param {object} properties - Optional properties to attach to the event
 */
export const captureEvent = (eventName, properties = {}) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

/**
 * Identify a user
 * @param {string} userId - Unique identifier for the user
 * @param {object} properties - User properties
 */
export const identifyUser = (userId, properties = {}) => {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties)
  }
}

/**
 * Reset user identity (useful for logout)
 */
export const resetUser = () => {
  if (typeof window !== 'undefined') {
    posthog.reset()
  }
}

/**
 * Set user properties
 * @param {object} properties - Properties to set
 */
export const setUserProperties = (properties) => {
  if (typeof window !== 'undefined') {
    posthog.people.set(properties)
  }
}

/**
 * Capture page view manually (if needed)
 * @param {string} pageName - Name of the page
 */
export const capturePageView = (pageName) => {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', { page: pageName })
  }
}

/**
 * Create feature flags check
 * @param {string} flagKey - Feature flag key
 * @returns {boolean} - Whether the feature is enabled
 */
export const isFeatureEnabled = (flagKey) => {
  if (typeof window !== 'undefined') {
    return posthog.isFeatureEnabled(flagKey)
  }
  return false
}

/**
 * Get feature flag variant
 * @param {string} flagKey - Feature flag key
 * @returns {string|boolean} - The variant of the feature flag
 */
export const getFeatureFlagVariant = (flagKey) => {
  if (typeof window !== 'undefined') {
    return posthog.getFeatureFlag(flagKey)
  }
  return false
}

export default posthog
