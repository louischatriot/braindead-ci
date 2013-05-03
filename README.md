braindead-ci
============

I couldn't find a hosted CI I like, so I'm making my own with Nodejs.
The goal is to make something super simple (you can see what I mean by
that with my other project [Mongo Edit](https://github.com/tldrio/mongo-edit))
and fast (i.e. unlike Jenkins for example).

Current state: still needs some work on the code to be usable on other people's projects but
It is already much, much better than Jenkins (for our use). It's much faster (pages load < 300ms,
start time < 100ms), much cleaner (no fluff, just stuff) and has a much lower memory
footprint (1/10th, even though with modern servers this is not so useful).
