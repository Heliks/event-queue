import { EventQueue } from './event-queue';
import { Subscriber } from './subscriber';


describe('EventQueue', () => {
  // Mock event.
  enum TestEvent { A, B }

  let events: EventQueue<TestEvent>;

  beforeEach(() => {
    events = new EventQueue<TestEvent>();
  });

  it('should subscribe to the event queue', () => {
    expect(events.subscribe()).toBeInstanceOf(Subscriber);
  });

  it('should add events to subscribers', () => {
    const subscriber = events.subscribe();

    events.push(TestEvent.A);
    events.push(TestEvent.B);

    const size = subscriber.size();

    expect(size).toBe(2);
  });

  it('should no longer push events to unsubscribed subscribers', () => {
    const subscriber = events.subscribe();

    events.push(TestEvent.A);
    events.unsubscribe(subscriber);
    events.push(TestEvent.B);

    const unread = subscriber.read();

    expect(unread).toEqual([
      TestEvent.A
    ])
  });
});
