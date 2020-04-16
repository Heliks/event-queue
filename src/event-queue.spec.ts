import { EventQueue } from './event-queue';

describe('EventQueue', () => {
  // Mock event.
  enum TestEvent {
    A,
    B,
    C
  }

  let events: EventQueue<TestEvent>;

  beforeEach(() => {
    events = new EventQueue<TestEvent>();
  });

  it('should push events', () => {
    events.subscribe();

    events.push(TestEvent.A);
    events.push(TestEvent.B);

    // Since no one is listening, the event shouldn't really be pushed
    expect(events.size).toBe(2);
  });

  it('should not push events if there are no subscribers to consume them', () => {
    events.push(TestEvent.A);
    events.push(TestEvent.B);

    events.subscribe();

    events.push(TestEvent.C);

    expect(events.size).toBe(1);
  });

  it('should get the next event of a subscriber', () => {
    // This should be picked up by none of the subscribers.
    events.push(TestEvent.A);

    const sub1 = events.subscribe();
    events.push(TestEvent.B);

    const sub2 = events.subscribe();
    events.push(TestEvent.C);

    // #1 should consume 'B' & 'C'
    expect(events.next(sub1)).toBe(TestEvent.B);
    expect(events.next(sub1)).toBe(TestEvent.C);
    expect(events.next(sub1)).toBeUndefined();

    // #2 should consume only 'C'.
    expect(events.next(sub2)).toBe(TestEvent.C);
    expect(events.next(sub2)).toBeUndefined();
  });

  it('should shrink the queue', () => {
    // Unreachable.
    events.push(TestEvent.A);
    events.push(TestEvent.B);

    // Create a reader. All events afterwards should be reachable.
    events.subscribe();
    events.push(TestEvent.C);

    // Shrink.
    events.shrink();

    const queue = events.getEvents();

    expect(queue).toHaveLength(1);
    expect(queue).toContainEqual(TestEvent.C);
  });

  it('should clean-up consumed events', () => {
    const sub1 = events.subscribe();
    events.push(TestEvent.A);

    const sub2 = events.subscribe();

    events.push(TestEvent.B);
    events.push(TestEvent.C);

    // Let #1 consume event 'A' & 'B'.
    events.next(sub1);
    events.next(sub1);

    // Let #1 consume event 'B'.
    events.next(sub2);

    const queue = events.getEvents();

    // Only "C" should be left over as it was not consumed yet.
    expect(queue).toHaveLength(1);
    expect(queue).toContainEqual(TestEvent.C);
  });

  describe('read()', () => {
    it('should an iterator for all relevant events.', () => {
      const sub = events.subscribe();

      events.push(TestEvent.A);
      events.push(TestEvent.B);

      const items = Array.from(
        events.read(sub)
      );

      expect(items).toEqual([
        TestEvent.A,
        TestEvent.B
      ]);
    });

    it('should shrink the queue afterwards', () => {
      const sub = events.subscribe();
      const shrink = jest.spyOn(events, 'shrink');

      events.push(TestEvent.A);
      events.push(TestEvent.B);
      events.push(TestEvent.C);

      for (const event of events.read(sub)) {
        // Do nothing, we just want to iterate.
      }

      // The queue should be shrinked exactly once no matter how many
      // events were consumed.
      expect(shrink).toHaveBeenCalledTimes(1);
    });
  });
});
