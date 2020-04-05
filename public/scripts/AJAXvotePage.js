/* eslint-disable no-undef */
const createMovieOption = () => {
  console.log('createMovieOption');
  const markup = `
  <div class="column" draggable="true"><header>Star Wars</header></div>
  <div class="column" draggable="true"><header>LOTR</header></div>
  <div class="column" draggable="true"><header>Pulp Fiction</header></div>
  <div class="column" draggable="true"><header>La La Land</header></div>
  `;
  return markup;
};


$(document).ready(function() {
  const $option = createMovieOption();
  $("#columns").append($option);
});



