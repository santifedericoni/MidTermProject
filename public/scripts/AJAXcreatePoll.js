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
  });

  $("form").submit(function(event) {
    event.preventDefault();

    const pollTitle = $("#poll-title").val();
    const movieChoices = [];
    $("container input").each(function() {
      movieChoices.push($(this).val());
    });

    $.post("/api/polls", { pollTitle }, function(data) {


      console.log(data.id);
      console.log(movieChoices);

      const choicesObj = {
        poll_id: data.id,
        movieChoices
      };

      $.post("/api/choices", choicesObj);

    });

  });

});

