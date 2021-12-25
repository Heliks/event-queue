A pull based event emitter, or event queue.

The difference to traditional event emitters is that this one is not reacting to events
but is instead is storing them in a queue until they are consumed. 

### Install

```bash
$ npm install --save @heliks/event-queue
```

### Example

When subscribing to a queue a `Subscriber` is returned which can be used to read 
future events from the queue. 

```ts
import { EventQueue } from '@heliks/event-queue';

const events = new EventQueue<string>();

// The event handle that is used to consume the event queue.
const subscriber = events.subscribe();

events.push('foo');
events.push('bar');

// Read events from the queue
for (const event of events.read(subscriber)) {
  console.log('consumed ' + event);
}
```

You can subscribe to a queue as often as you want, but it is important that all 
subscribers consume the queue. Otherwise, it will grow indefinitely.

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


