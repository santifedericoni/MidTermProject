/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-undef */

const createMovieOption = (number) => {
  const markup = `
  <label class="deletable">Option ${number}:</label>
  <input class="options" type="text" name="option${number}">
  `;
  return markup;
};

const createNewPoll = () => {
  const markup = `
  <container class="option-container">
    <h1>Poll Title</h1>
    <input type="text" id="poll-title" name="fname">
    <label class="deletable">Option 1:</label>
    <input class="options" type="text" name="option1">
    <label class="deletable">Option 2:</label>
    <input class="options" type="text" name="option2">
  </container>
  <div id="options">
  <button class ='submit' type="submit">Create Poll!</button>
  <i class="far fa-plus-square fa-3x" id="add-option"></i><br>
  <i class="far fa-minus-square fa-3x" id="delete-option"></i><br>
  </div>
`;
  return markup;
};

$(document).ready(function() {
  let number = 3;
  let user_id;

  $(".email-input button").click(function(event) {
    event.preventDefault();
    let email = $("#email").val();
    $.get("/api/users", {email: email}, function(data) {
        user_id = data.id;
      });

    const $pollForm = createNewPoll();
    $('form').append($pollForm);
    $(".email-input").remove();
    $("#add-option").click(function(event) {
      event.preventDefault();
      const $option = createMovieOption(number);
      number += 1;
      $("container").append($option);
    });
    $("#delete-option").click(function(event) {
      event.preventDefault();
      if (number === 1) {
        return;
      } else {
        number--;
        $( ".options").last().remove();
        $( ".deletable").last().remove();
      }
    });
  });


  $("form").submit(function(event) {
    event.preventDefault();
    const pollTitle = $("#poll-title").val();
    const movieChoices = [];
    $("container input.options").each(function() {
      movieChoices.push($(this).val());
    });

    $.post("/api/choices", { pollTitle, user_id, movieChoices }, function(data) {
        window.location = `/results/${data.id}`;

    });

  });

});

