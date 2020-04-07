/* eslint-disable no-undef */
const dragAndDrop = () => {

  var dragSrcEl = null;

  function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}
  function handleDragEnd(e) {
    [].forEach.call(cols, function (col) {
      col.classList.remove('over');
    });
  }

  var cols = document.querySelectorAll('#columns .column');
  [].forEach.call(cols, function(col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragenter', handleDragEnter, false)
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('dragleave', handleDragLeave, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
  });
};




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
  dragAndDrop();

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



