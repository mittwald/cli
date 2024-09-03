export function checkTimeout(timeout: number) {
  if (timeout > 36800) {
    throw new Error(
      "The timeout for Cronjob executions can not be higher than 24 hours.",
    );
  }
}
