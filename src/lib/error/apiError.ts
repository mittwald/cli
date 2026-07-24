interface APIErrorBody {
  message?: string;
  type?: string;
}

interface APIErrorLike {
  response?: {
    data?: unknown;
    status?: number;
  };
}

export interface APIErrorDetails {
  body: APIErrorBody | undefined;
  status: number;
}

export function getAPIErrorDetails(err: unknown): APIErrorDetails | null {
  if (typeof err !== "object" || err === null) {
    return null;
  }

  const response = (err as APIErrorLike).response;
  if (typeof response?.status !== "number") {
    return null;
  }

  const body =
    typeof response.data === "object" && response.data !== null
      ? (response.data as APIErrorBody)
      : undefined;

  return {
    status: response.status,
    body,
  };
}

export function matchesAPIError(
  err: unknown,
  options: {
    keywords?: string[];
    status?: number;
  },
): boolean {
  const details = getAPIErrorDetails(err);
  if (details === null) {
    return false;
  }

  if (options.status !== undefined && details.status !== options.status) {
    return false;
  }

  if (!options.keywords || options.keywords.length === 0) {
    return true;
  }

  const signature = `${details.body?.type ?? ""} ${details.body?.message ?? ""}`
    .toLowerCase()
    .trim();

  return options.keywords.every((keyword) =>
    signature.includes(keyword.toLowerCase()),
  );
}
