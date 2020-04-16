export interface Subscriber {

  /**
   * Points to the index of the next event that is consumed from
   * the event queue.
   */
  pointer: number;

}

export class EventQueue<T = unknown> {

  /** Returns the total amount of items currently in the queue. */
  public get size(): number {
    return this.events.length;
  }

  /** Contains all events that are currently in the queue. */
  protected readonly events: T[] = [];

  /** Contains all registered subscribers. */
  protected readonly subscribers: Subscriber[] = [];

  /** Pushes an event to the end of the queue. */
  public push(event: T): void {
    // No need to push the event if no one is listening since it won't
    // be consumed either way.
    if (this.subscribers.length > 0) {
      this.events.push(event);
    }
  }

  /**
   * Returns a `Subscriber` that later will be used to read from the queue.
   *
   * Note: All subscribers must consume their events or else the queue will
   * grow indefinitely which can lead to memory leaks.
   */
  public subscribe(): Subscriber {
    const subscriber = {
      pointer: this.events.length
    };

    this.subscribers.push(subscriber);

    return subscriber;
  }

  /** Shrinks the event queue down its lowest possible size. */
  public shrink(): void {
    // Determine by how much we need to shrink the queue by finding the event
    // subscriber with the lowest pointer.
    const shrinkBy = Math.min(...this.subscribers.map(item => item.pointer));

    this.events.splice(0, shrinkBy);

    // Shrink the other pointers by the size we shrunk the queue so that
    // they point to their correct events again.
    for (const item of this.subscribers) {
      item.pointer -= shrinkBy;
    }
  }

  /**
   * Returns an iterator that iterates over all un-consumed events of the given
   * `subscriber`. Automatically shrinks the queue afterwards.
   *
   * ```typescript
   * const events = new EventQueue<number>();
   *
   * queue.push(1);
   *
   * const subscription = queue.subscribe();
   *
   * queue.push(2);
   * queue.push(3);
   *
   * for (const event of events.read(subscription)) {
   *     console.log(event);
   * }
   * ```
   *
   * Will produce
   *
   * ```bash
   * $ 2
   * $ 3
   * ```
   */
  public *read(subscriber: Subscriber): IterableIterator<T> {
    for (let l = this.events.length; subscriber.pointer < l; subscriber.pointer++) {
      yield this.events[ subscriber.pointer ];
    }

    // Automatically shrink the queue.
    this.shrink();
  }

  /**
   * Consumes the next event in the queue for `subscriber` and returns it (if
   * possible). Automatically shrinks the queue afterwards.
   *
   * ```typescript
   * const events = new EventQueue<string>();
   * const subscriber = events.subscribe();
   *
   * events.push('foo');
   * events.push('bar');
   *
   * console.log(events.next(subscriber)); // "foo"
   * console.log(events.next(subscriber)); // "bar"
   * ```
   *
   * Subscribers can only consume events that were send to the queue *after*
   * they subscribed to the queue:
   *
   * ```typescript
   * const events = new EventQueue<string>();
   *
   * events.push('foo');
   *
   * const sub = events.subscribe();
   *
   * events.push('bar');
   *
   * // Logs "bar" because "foo" was added to the queue before we subscribed.
   * console.log(events.next(sub));
   * ```
   */
  public next(subscriber: Subscriber): T | undefined {
    const item = this.events[ subscriber.pointer ];

    subscriber.pointer += 1;

    // Make space by removing already consumed events.
    this.shrink();

    return item;
  }

  /** Completely empties the queue and resets all [[subscribers]]. */
  public clear(): this {
    for (const item of this.subscribers) {
      item.pointer = 0;
    }

    this.events.length = 0;

    return this;
  }

  /** Returns all events that are currently in the queue. */
  public getEvents(): readonly T[] {
    return this.events;
  }

}
