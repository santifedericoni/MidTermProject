/* eslint-disable no-undef */


const createMovieOption = (number) => {
  const markup = `
  <label>Option ${number}</label>
  <input type="text" name="option${number}"></input>
  <br><br>
  `;
  return markup;
};


$(document).ready(function() {
  let number = 3;

  $("#add-option").click(function(event) {
    event.preventDefault();
    const $option = createMovieOption(number);
    number += 1;
    $("container").append($option);

    // $.getJSON('/api/polls', function(result) {
    //   console.log(result);
    // });

  });

  $("form").submit(function(event) {
    event.preventDefault();

    const pollTitle = $("#poll-title").val();
    const movieChoices = [];
    $("container input").each(function() {
      movieChoices.push($(this).val());
    });


    $.post("/api/polls", { pollTitle }, function(data) {

      console.log(data);

      let JSONMovieChoices = JSON.stringify(movieChoices);

      $.post("/api/choices", { JSONMovieChoices });


    });

   });

});

