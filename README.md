# cuecard [![Build Status](https://secure.travis-ci.org/markdalgleish/cuecard.png)](http://travis-ci.org/markdalgleish/cuecard)

iPad-powered presentation tool for Node.js

## Getting Started

Install the module with: `npm install https://github.com/markdalgleish/cuecard/tarball/master`

```javascript
var cuecard = require('cuecard');

cuecard.create({
	port: 3000,
	remoteUrl: '/remote',
	title: 'My Cuecard Presentation',
	slides: __dirname + '/slides.html',
	styles: __dirname + '/slides.css'
});
```

## Slideshow Content and Pre-Processors

Native HTML and CSS are supported:

```javascript
cuecard.create({
	title: 'My Cuecard Presentation',
	slides: __dirname + '/slides.html',
	styles: __dirname + '/slides.css'
});
```

Cuecard also ships with Jade and Stylus for HTML and CSS pre-processing.

To use these pre-processors, simply use the appropriate file extensions:

```javascript
cuecard.create({
	title: 'My Cuecard Presentation',
	slides: __dirname + '/slides.jade',
	styles: __dirname + '/slides.styl'
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## License
Copyright (c) 2012 Mark Dalgleish  
Licensed under the MIT license.
