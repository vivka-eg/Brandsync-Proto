import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: process.env.NODE_ENV === 'development',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug(false)
      }
    }
  })
}
