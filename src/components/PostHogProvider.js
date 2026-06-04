'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { useAuthContext } from '@/context/auth/AuthContext'

export function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogIdentifier() {
  const { user, role } = useAuthContext()

  useEffect(() => {
    if (user?.id) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.fullName,
        role: role,
      })
    }
  }, [user, role])

  return null
}

export default function PostHogProvider({ children }) {
  return (
    <>
      <PostHogPageView />
      <PostHogIdentifier />
      {children}
    </>
  )
}
