import Duration from "../../units/Duration.js";

const maxDuration = Duration.fromString("24h");
export function checkTimeout(timeout: Duration) {
  if (timeout.compare(maxDuration) > 0) {
    throw new Error(
      "The timeout for Cronjob executions can not be higher than 24 hours.",
    );
  }
}
