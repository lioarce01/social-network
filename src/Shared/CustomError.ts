class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public details?: any,
  ) {
    super(message);
  }
}
