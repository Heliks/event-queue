/**
 * A list of unread events, retrieved from a {@link EventQueue} {@link Subscriber}.
 *
 * This is a direct pointer to all unread events of a {@link Subscriber}. Therefore,
 * it should either be read instantly after it was retrieved or locally copied as it
 * becomes invalid as soon as the {@link Subscriber} is {@link Subscriber.read read}
 * for the next time.
 *
 * @see EventQueue
 * @see Subscriber
 */
export type Unread<E> = readonly E[];

/** A subscriber to a {@link EventQueue event queue}. */
export class Subscriber<E = unknown> {

  /**
   * Contains all unread events in this subscriber.
   *
   * @internal
   */
  private readonly unread: E[] = [];

  /** @internal */
  private readonly _unread: E[] = [];

  /** Returns the amount of unread events. */
  public size(): number {
    return this.unread.length;
  }

  /** Adds an unread event. */
  public push(event: E): this {
    this.unread.push(event);

    return this;
  }

  /** Removes all unread events. */
  public clear(): this {
    this.unread.length = 0;

    return this;
  }

  /** Returns all {@link Unread unread} events. */
  public read(): Unread<E> {
    this._unread.length = 0;

    if (this.unread.length > 0) {
      this._unread.push(...this.unread);
      this.unread.length = 0;
    }

    return this._unread;
  }

  /** Reads the next unread event, or `undefined` if there are none. */
  public next(): E | undefined {
    return this.unread.shift();
  }

}
