npm install movie-trailer

const movieTrailer = require( 'movie-trailer' )

movieTrailer( 'Oceans Eleven', ( error, response ) => {
    console.log( response ); 
    //=> http://path/to/trailer
} )
 
Playing a YouTube Video in HTML
To play your video on a web page, do the following:

Define an <iframe> element in your web page
Let the src attribute point to the video URL
Use the width and height attributes to specify the dimension of the player

 <iframe width="420" height="315"
src="https://www.youtube.com/embed/tgbNymZ7vqY">
</iframe>
