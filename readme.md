A pull based event emitter, or event queue.

The difference to traditional event emitters is that it is not reacting to events, but 
is instead is storing them in a queue until they are consumed. 

### Example

When subscribing to a queue a `Subscriber` is returned, which then can be used to read
future events. 

```ts
import { EventQueue } from '@heliks/event-queue';

const events = new EventQueue<string>();

// The event handle that is used to consume the event queue.
const subscriber = events.subscribe();

events.send('foo');
events.send('bar');

// Read events from the queue
for (const event of events.read(subscriber)) {
    console.log('consumed ' + event);
}
```

You can subscribe to queues as often but you want, but it is important that all subscribers 
will consume the queue or else it will continue to grow indefinitely.

```ts
const subscriber1 = events.subscribe();
const subscriber2 = events.subscribe();

events.send('foo');
events.send('bar');

// Consume events with subscriber1
events.next(subscriber1);
events.next(subscriber1);
 
// This will log "2" since subscriber1 has yet to consume any events. This prevents
// the queue from shrinking, which can lead to potential memory leaks.
console.log(events.size);
```


