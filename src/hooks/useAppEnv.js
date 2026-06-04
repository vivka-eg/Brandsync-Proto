export function useAppEnv() {
  const env = process.env.NEXT_PUBLIC_APP_ENV;

  return {
    env: env,
    isDev: env === "dev",
    isStage: env === "stage",
    isProd: env === "prod",
  };
}
