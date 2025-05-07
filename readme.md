A pull based event emitter.

In contrast to typical event emitters, event queues don't invoke callbacks or other
event logic when the event occurs. Instead, events are pushed down to a queues
subscribers, where they can be read manually.

This type of event processing is counterproductive for normal web development and is
mainly meant for game development, where processing order and frame precision need to
be ensured.
