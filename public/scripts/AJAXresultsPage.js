const createMovieOption = (choice) => {
  const values = [choice.title, choice.points];
  console.log(values[2]);
  const markup = `
  <div class="column">
    <header>${values[0]}</header>
    <p> Points: ${values[1]}</p>
    <br><br>
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
  });
});
