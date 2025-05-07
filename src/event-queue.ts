import { Subscriber } from './subscriber';


/**
 * A pull based event emitter.
 *
 * In contrast to typical event emitters, event queues don't invoke callbacks or other
 * event logic when the event occurs. Instead, events are pushed down to a queues
 * subscribers, where they can be read manually.
 *
 * This type of event processing is counterproductive for normal web development and is
 * mainly meant for game development, where processing order and frame precision need to
 * be ensured.
 */
export class EventQueue<E = unknown> {

  /** @internal */
  private readonly subscribers = new Set<Subscriber<E>>();

  /** Returns the total amount of subscribers. */
  public size(): number {
    return this.subscribers.size;
  }

  /**
   * Subscribes to this queue.
   *
   * Each subscriber must at some point read the events that it has subscribed to or
   * otherwise, their backlog of unread events can grow indefinitely and cause memory
   * leaks.
   */
  public subscribe(): Subscriber<E> {
    const subscriber = new Subscriber<E>();

    this.subscribers.add(subscriber);

    return subscriber;
  }

  /** Unsubscribes the given `subscriber` from the event queue. */
  public unsubscribe(subscriber: Subscriber<E>): void {
    this.subscribers.delete(subscriber);
  }

  /** Adds a new unread `event` to all {@link Subscriber subscribers} of this queue. */
  public push(event: E): this {
    for (const subscriber of this.subscribers) {
      if (subscriber.valid) {
        subscriber.push(event);
      }
      else {
        this.unsubscribe(subscriber);
      }
    }

    return this;
  }

}
