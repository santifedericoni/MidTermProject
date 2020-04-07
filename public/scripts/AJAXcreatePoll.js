/* eslint-disable camelcase */
/* eslint-disable no-undef */



const createMovieOption = (number) => {
  const markup = `
  <label>Option ${number}</label>
  <input type="text" name="option${number}"></input>
  <br><br>
  `;
  return markup;
};

const createNewPoll = () => {
  const markup = `
  <title>Create Poll</title>
  <label>Poll Title</label>
  <input type="text" id="poll-title" name="fname"><br><br>
  <container class="option-container">
    <label>Option 1</label>
    <input type="text" name="option1"><br><br>
    <label>Option 2</label>
    <input type="text" name="option2"><br><br>
  </container>
  <button  class = 'submit' type="submit">Create Poll!</button>
  <img src="https://findicons.com/files/icons/1014/ivista/256/plus.png" id="add-option" style="width:40px;height:40px;">
`;
  return markup;
}

$(document).ready(function() {
  let number = 3;
  let user_id;

  $(".email-input button").click(function(event) {
    event.preventDefault();
    let email = $("#email").val();
    console.log(email);
    $.get("/api/users", {email: email}, function(data) {
      if (data.id) {
        user_id = data.id;
      } else {
        $.post("api/users", {email: email}, function(data) {
         user_id = data.id;
        });
      }
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
  })

  $("form").submit(function(event) {
    event.preventDefault();
    const pollTitle = $("#poll-title").val()
    const movieChoices = [];
    $("container input").each(function() {
      movieChoices.push($(this).val());
    });

    $.post("/api/polls", { pollTitle, user_id }, function(data) {
      const choicesObj = {
        poll_id: data.id,
        movieChoices
      };
      $.post("/api/choices", choicesObj, function(data) {
        console.log('Hello');
        window.location =`/results/${choicesObj.poll_id}`;


      });
    });

  });

});

