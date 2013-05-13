Braindead CI
============

Braindead CI is a self-hosted continuous integration and deployment
server written in Node.js. It can build and deploy your code
automatically upon a push on Github

## Screenshots


## Features
* Automatic build and deploy on a push to the Github repository
* Advertise build results on Hipchat
* Very fast (starts up in less than a second, page load typically less than 500ms)
* Easy to set up (create a job in 1 minute, set up hook to Github and Hipchat in 2)
* All-purpose: can build and deploy any type of project, whatever the technology used
  is
* Smart support for Node.js projects (only reinstall dependencies if
  needed to gain time). Smart support for other platforms will come
depending on use (if you need it for your stack, do submit an issue, or even better a PR!)


## Installation and tests
```javascript
// Install Braindead in two commands
git clone git@github.com:louischatriot/braindead-ci.git
npm install

// Now test it (dev dependencies need to be installed)
make test

// You're done, now launch it:
./braindead              // On default port (2008)
./braindead.js -p 2009   // On port 2009

// Check out possible command-line options
./braindead.js -h
```


## Going forward
We've been using Braindead CI for a few months at <a href="http://tldr.io" target="_blank">tldr.io</a> and it works very well (for our needs at least). That said, this is just the first release to the outside so some bolts may need tightening. Don't hesitate to submit issues or pull requests!


## License
MIT. Do whatever you want with the code.
(c) 2013 Louis Chatriot, louis@tldr.io
