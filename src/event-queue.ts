import { Subscriber } from './subscriber';


/**
 * An event queue pushes events to {@link Subscriber subscribers}.
 *
 * In contrast to typical event emitters, event queues are pull based. Each event
 * must therefore be read manually & synchronously.
 *
 * This type of event processing is not meant for normal web-development, but rather,
 * niches like game development where we need to ensure a processing order of certain
 * systems (input -> rendering, etc.) for frame-perfect responsiveness.
 */
export class EventQueue<E = unknown> {

  /**
   * Contains all subscribers.
   *
   * @internal
   */
  private readonly subscribers: Subscriber<E>[] = [];

  /** Returns the total amount of subscribers. */
  public size(): number {
    return this.subscribers.length;
  }

  /** Subscribes to this queue. */
  public subscribe(): Subscriber<E> {
    const subscriber = new Subscriber<E>();

    this.subscribers.push(subscriber);

    return subscriber;
  }

  /**
   * Adds a new unread `event` to all {@link Subscriber subscribers} of
   * this queue.
   */
  public push(event: E): this {
    for (const subscriber of this.subscribers) {
      subscriber.push(event);
    }

    return this;
  }

}
