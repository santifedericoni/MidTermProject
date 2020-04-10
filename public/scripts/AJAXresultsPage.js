/* eslint-disable camelcase */
/* eslint-disable no-undef */
const createMovieOption = (choice) => {
  const values = [choice.title, choice.points];
  console.log(values[2]);
  const markup = `
  <div class="column col-lg-8 col-sm-10">
    <div class="card text-center mb-3">
      <h3 class="card-header">${values[0]}</h3>
      <div class="card-body">
        <div class="right">
          <p>Points: ${values[1]}</p>
          <i></i>
        </div>
      </div>
    </div>
</div>
  `;
  return markup;
};

const loadOptions = (url) => {
  $.get(url, function(data) {
    $(".column").remove();
    for (choice of data) {
      let optionElement = createMovieOption(choice);
      $("#columns").append(optionElement);
    }
  });
};

$(document).ready(function() {

  let poll_id = $("#poll-id").text();
  let url = `/api/choices/${poll_id}`;

  loadOptions(url);

  //setInterval(loadOptions(url), 5000);
  let intervalVar = setInterval(function() {
    loadOptions(url);
  }, 10000);


  $("button").click(function(event) {
    event.preventDefault();
    clearInterval(intervalVar);
    $(".column").not(':first').remove();
    $(".submit").remove();
    $("h1").text('The winner is:');
    $.post(`/api/polls/${poll_id}`, function(data) {
      console.log(data);
    });
  });
});
