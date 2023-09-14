Pull based event emitter (event queue). 


In contrast to typical event emitters, event queues are pull based. Each event
must therefore be read manually & synchronously.

This type of event processing is not meant for normal web-development, but rather,
niches like game development where we need to ensure a processing order of certain
systems (input -> rendering, etc.) for frame-perfect responsiveness. 
