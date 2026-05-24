export function getHttpStatus(err: unknown): number | undefined {
  if (!err || typeof err !== "object") return undefined;
  return (err as { response?: { status?: number } }).response?.status;
}

export function isAuthError(err: unknown): boolean {
  const status = getHttpStatus(err);
  return status === 401 || status === 403;
}

export function isNotFoundError(err: unknown): boolean {
  return getHttpStatus(err) === 404;
}

export function isAbortError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: string }).code;
  const name = (err as { name?: string }).name;
  return code === "ERR_CANCELED" || name === "CanceledError" || name === "AbortError";
}
