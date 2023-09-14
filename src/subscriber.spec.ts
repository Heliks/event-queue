import { Subscriber } from './subscriber';


describe('Subscriber', () => {
  // Noop Event used for testing.
  enum TestEvent { A, B, C }

  it('should read events', () => {
    console.time('foo')
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
