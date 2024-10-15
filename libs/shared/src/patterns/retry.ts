class RetryError extends Error {
  constructor(
    public readonly lastError: Error,
    message?: string,
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export async function retry<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  backoff: number = 2,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw new RetryError(error, `All retries failed: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(operation, retries - 1, delay * backoff, backoff);
  }
}
