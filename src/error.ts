export class HTTPError extends Error {
  constructor(public status_code: number, public message: string) {
    super(message);
    // Set the prototype explicitly to maintain proper inheritance
    Object.setPrototypeOf(this, HTTPError.prototype);
  }

  toString(): string {
    return `${this.status_code} ${this.message}`;
  }
}
