/* eslint-disable no-undef */
const loadOptions = (url) => {
  $.get(url, function(data) {
    console.log(data);
    for (choice of data) {
     let optionElement = createMovieOption(choice);
     $("#columns").append(optionElement);
    }
  })
};


const createMovieOption = (choice) => {
  const values = [choice.title, choice.description, choice.trailerurls];
  console.log(values[2]);
  const markup = `
  <div class="column" draggable="true">
    <header>${values[0]}</header>
    <p>${values[1]}</p>
    <p>${values[2]}</>
  </div><br><br>
  `;
  return markup;
};


$(document).ready(function() {

  let poll_id = $("#poll-id").text();
  let url = `/api/choices/${poll_id}`;



  loadOptions(url);

  //  this should take all the elements in orden from the vote page and send it to the data base
  // $("form").submit(function(event) {
  //   event.preventDefault();
  //
  //   const movieChoices = [];
  //   $(".column").each(function() {
  //     movieChoices.push($(this).val());
  //   });

  // $.post("/api/choices", { choices }, function(data) {
  //   const choicesObj = {
  //     movieChoices
  //   };

});



