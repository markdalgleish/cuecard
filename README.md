# cuecard [![Build Status](https://secure.travis-ci.org/markdalgleish/cuecard.png)](http://travis-ci.org/markdalgleish/cuecard)

iPad-controlled presentation framework for Node.js

Any browser can control it, but an iPad or Android device works best.

## Getting Started

Install the module with: `npm install https://github.com/markdalgleish/cuecard/tarball/master`

```javascript
var cuecard = require('cuecard');

cuecard.create({
	port: 3000,
	remoteUrl: '/remote',
	title: 'My Cuecard Presentation',
	slides: __dirname + '/slides.html',
	styles: __dirname + '/slides.css',
	static: __dirname + '/static'
});
```

In this example you can now visit `http://localhost:3000` to view the presentation (visit this URL on the projector).

Visit `http://localhost:3000/remote` to view and control it remotely (visit this URL on your iPad).

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

## Sample Slide Markup

If using the default Fathom.js adapter, your slide markup should look like this:

```html
<div class="slide">
	<h1>Slide One</h1>
	<p>This is a slide</p>
	<ul>
		<li>First bullet point</li>
		<li>Second bullet point</li>
	</ul>
</div>

<div class="slide">
	<h1>Slide Two</h1>
	<p>This slide has some code</p>
	<pre>var cuecard = require('cuecard');<pre>
</div>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## License
Copyright (c) 2012 Mark Dalgleish  
Licensed under the MIT license.
