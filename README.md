Braindead CI
============

Yep, another continuous integration and deployment server. Why? Lots of reas

## Features
* Very fast (starts up in less than a second, page load typically less than 500ms)
* Automatic build and deploy on a push to the Github repository
* Advertise build results on Hipchat
* Intelligent dependency management for Node.js projects (Braindead only reinstalls them if needed, builds don't take too long that way)


## Installation and tests
```javascript
// Install it in two commands
git clone git@github.com:louischatriot/braindead-ci.git
npm install

// Now test it (dev dependencies need to be installed)
make test

// You're done, now to launch it:
node app.js -p 2009   // Launch Braindead on port 2009
```


## License
MIT. Do whatever you want with the code.
(c) 2013 Louis Chatriot, louis@tldr.io
