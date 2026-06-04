# PostHog CI/CD Configuration

## Changes Made

### 1. Dockerfile Updates
Updated [frontend/Dockerfile](Dockerfile) to include PostHog environment variables:

**Added ARG declarations:**
```dockerfile
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
```

**Added ENV declarations:**
```dockerfile
ENV NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST
```

### 2. GitHub Actions Workflow Updates
Updated [.github/workflows/frontend.yml](../../.github/workflows/frontend.yml) to include PostHog secrets for all environments:

- Added PostHog variables to the **set-env** step for dev/stage/prod
- Added PostHog to build **env** section
- Added PostHog **--build-arg** flags to Docker build command

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository for each environment:

### Development Environment
```
DEV_NEXT_PUBLIC_POSTHOG_KEY=<your_dev_posthog_key>
DEV_NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

### Staging Environment
```
STAGE_NEXT_PUBLIC_POSTHOG_KEY=<your_stage_posthog_key>
STAGE_NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

### Production Environment
```
PROD_NEXT_PUBLIC_POSTHOG_KEY=<your_prod_posthog_key>
PROD_NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## How to Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the appropriate name and value

### Using Same PostHog Project
If you want to use the same PostHog project for all environments:
- Use the same `POSTHOG_KEY` value for all three environments
- All environments will report to the same PostHog project

### Using Separate PostHog Projects
For better data separation (recommended):
- Create separate PostHog projects for dev/stage/prod
- Use different `POSTHOG_KEY` values for each environment
- This allows you to:
  - Keep test data separate from production data
  - Set different retention policies
  - Configure environment-specific feature flags

## PostHog Project Setup

### Option 1: Single Project
1. Use your existing PostHog API key: `phc_fQuKKgcB4YG0q2aOn1gg5okeHGPvjtRIzT6HaDHgGQ9`
2. Set this key for all three environments

### Option 2: Multiple Projects (Recommended)
1. Go to PostHog dashboard
2. Create three separate projects:
   - **EG BrandSync - Dev**
   - **EG BrandSync - Stage**
   - **EG BrandSync - Prod**
3. Get the API key for each project
4. Set the appropriate key for each environment in GitHub secrets

## Deployment Flow

Once secrets are added, the deployment will:

1. **On push to dev/stage/main branches:**
   - Load environment-specific PostHog credentials
   - Build Docker image with PostHog env vars baked in
   - Push to AWS ECR
   - Deploy to ECS

2. **PostHog will be active on:**
   - ✅ Development (dev branch)
   - ✅ Staging (stage branch)
   - ✅ Production (main branch)

## Testing the Setup

### Before Deployment
1. Add the GitHub secrets (see above)
2. Verify secrets are correctly named
3. Test locally with `npm run dev` to ensure PostHog works

### After Deployment
1. Push to dev branch to trigger deployment
2. Check GitHub Actions logs to verify PostHog vars are set
3. Visit the deployed app
4. Check PostHog dashboard for events
5. Verify user identification and page views are tracked

## Troubleshooting

### Build Fails
- Check if all PostHog secrets are added to GitHub
- Verify secret names match exactly (case-sensitive)
- Check GitHub Actions logs for specific error

### PostHog Not Tracking
- Open browser console and look for PostHog debug logs
- Verify `NEXT_PUBLIC_POSTHOG_KEY` is set in the deployed app
- Check if the PostHog key is valid
- Verify PostHog host URL is correct (https://eu.i.posthog.com)

### Environment Variables Not Available
- Ensure variables start with `NEXT_PUBLIC_` (required for Next.js client-side access)
- Check that Docker build args are passed correctly
- Verify the variables are set in the GitHub Actions workflow

## Current Status

✅ Dockerfile configured
✅ GitHub Actions workflow updated
⚠️ GitHub secrets need to be added (see above)
✅ Local development environment configured

## Next Steps

1. **Add GitHub Secrets** (Required)
   - Add the 6 secrets listed above to GitHub repository settings

2. **Test Deployment** (Recommended)
   - Push to dev branch
   - Monitor GitHub Actions workflow
   - Verify PostHog is working in deployed app

3. **Configure PostHog** (Optional)
   - Set up feature flags
   - Configure custom events
   - Set up dashboards and insights
   - Configure user properties
