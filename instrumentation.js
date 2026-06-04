export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { OTLPLogExporter } = await import(
      '@opentelemetry/exporter-logs-otlp-http'
    )
    const { LoggerProvider, SimpleLogRecordProcessor } = await import(
      '@opentelemetry/sdk-logs'
    )
    const { resourceFromAttributes } = await import('@opentelemetry/resources')
 
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
 
    if (!posthogHost || !posthogKey) return
 
    const loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': 'eg-brandsync-frontend',
      }),
      processors: [
        new SimpleLogRecordProcessor(
          new OTLPLogExporter({
            url: `${posthogHost}/v1/logs`,
            headers: {
              Authorization: `Bearer ${posthogKey}`,
              'Content-Type': 'application/json',
            },
          })
        ),
      ],
    })
  }
}
 
 