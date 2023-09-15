import { Subscriber } from './subscriber';


describe('Subscriber', () => {
  // Noop Event used for testing.
  enum TestEvent { A, B, C }


  it('should read the first unread event', () => {
    const subscriber = new Subscriber();

    subscriber.push(TestEvent.A);
    subscriber.push(TestEvent.B);
    subscriber.push(TestEvent.C);

    // Call next twice to make sure that the unread message is "read".
    subscriber.next();

    const result = subscriber.next();

    expect(result).toBe(TestEvent.B);
  });

  it('should read all unread events', () => {
    const subscriber = new Subscriber();

    subscriber.push(TestEvent.A);

    // Read events for the first time here.
    subscriber.read();

    subscriber.push(TestEvent.B);
    subscriber.push(TestEvent.C);

    const events = subscriber.read();

    // TestEvent.A is no longer "unread" because it was read before.
    expect(events).toEqual([
      TestEvent.B,
      TestEvent.C
    ]);
  });
});
