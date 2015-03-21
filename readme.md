# MongoOverflow Api
Provides REST based endpoints for multiple **MongoOverflow** clients

Built with these awesome tools:

* [** Node.js **](http://nodejs.org/)
* [** Express **](http://expressjs.com/)
* [** MongoDB **](http://www.mongodb.org/)
* [** Socket.IO **](http://socket.io/)
* [** Passport **](http://passportjs.org/)
* [** Istanbul **](https://gotwarlost.github.io/istanbul/)

Installation
============

```bash
$ npm install -g nodemon
$ npm start
```

Running the Unit Tests
======================

```bash
$ npm install -g mocha
$ cd /path/to/your/source/root
$ npm test
```
Code Coverage with Istanbul
===========================

```bash
$ npm install -g istanbul
$ cd /path/to/your/source/root
$ istanbul cover node_modules/mocha/bin/_mocha -- -R spec
```

License
=======
MongoOverflow is released under the [**MIT License**](http://www.opensource.org/licenses/MIT).