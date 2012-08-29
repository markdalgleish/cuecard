Reveal.initialize({
    // Display controls in the bottom right corner
    controls: true,

    // Display a presentation progress bar
    progress: true,

    // Push each slide change to the browser history
    history: false,

    // Enable keyboard shortcuts for navigation
    keyboard: true,

    // Loop the presentation
    loop: false,

    // Number of milliseconds between automatically proceeding to the 
    // next slide, disabled when set to 0
    autoSlide: 0,

    // Enable slide navigation via mouse wheel
    mouseWheel: true,

    // Apply a 3D roll to links on hover
    rollingLinks: true,

    // UI style
    theme: 'default', // default/neon/beige

    // Transition style
    transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/linear(2d)

    // Optional libraries used to extend on reveal.js
    dependencies: [
        { src: 'lib/js/highlight.js', async: true, callback: function() { window.hljs.initHighlightingOnLoad(); } },
        { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
        { src: 'lib/js/showdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
        { src: 'lib/js/data-markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } }//,
        //{ src: 'socket.io/socket.io.js', async: true, condition: function() { return window.location.host === 'localhost:1947'; } },
        //{ src: 'plugin/speakernotes/client.js', async: true, condition: function() { return window.location.host === 'localhost:1947'; } },
    ]
});