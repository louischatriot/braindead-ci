Braindead CI
============

Braindead CI is a self-hosted continuous integration and deployment
server written in Node.js. It can build and deploy your code
automatically upon a push on Github


## Features
* Automatic build and deploy on a push to the Github repository
* Advertise build results on Hipchat
* Very fast (starts up in less than a second, page load typically less than 500ms)
* Can build and deploy any type of project (whatever the technology used
  is)
* Smart support for Node.js projects (only reinstall dependencies if
  needed to gain time). Smart support for other platforms will come
depending on use


## Installation and tests
```javascript
// Install it in two commands
git clone git@github.com:louischatriot/braindead-ci.git
npm install

// Now test it (dev dependencies need to be installed)
make test

// You're done, now to launch it:
node app.js -p 2009   // Launch Braindead on port 2009

// Check out possible command-line options
node app.js -h
```


## License
MIT. Do whatever you want with the code.
(c) 2013 Louis Chatriot, louis@tldr.io
