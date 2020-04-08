/* eslint-disable camelcase */
/* eslint-disable func-style */
/* eslint-disable no-undef */
const dragAndDrop = () => {

  let dragSrcEl = null;

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

  let cols = document.querySelectorAll('#columns .column');
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
    for (choice of data) {
      let optionElement = createMovieOption(choice);
      $("#columns").append(optionElement);
    }
    dragAndDrop();
  });
};

const createMovieOption = (choice) => {
  const values = [choice.title, choice.description, choice.trailerurls, choice.id];
  const markup = `
  <div class="column" draggable="true">
    <title>${values[3]}</title>
    <header>${values[0]}</header>
    <p>${values[1]}</p>
    <p>${values[2]}</>
  </div><br><br>
  `;
  return markup;
};

const isFinish = (url, poll_id) => {
  $.get(url, function(data) {
    realPollId = poll_id - 1;
    const status = data.polls[realPollId].completed;
    if (!status) {
      let poll_id = $("#poll-id").text();
      let url = `/api/choices/${poll_id}`;
      loadOptions(url);
      $("button").click(function(event) {
        event.preventDefault();
        const choiceRank = [];
        $(".column").each(function() {
          choiceRank.push($(this).find("title").text());
        });
        $.post(url, { choiceRank }, function(data) {
          $("#columns").remove();
          $("button").remove();
          $("h1").text('Thanks for Voting!');
        });
      });
    } else {
      $("h1").text('The poll is finish');
      $("#columns").remove();
      $("button").remove();
    }
  });
};

$(document).ready(function() {
  let poll_id = $("#poll-id").text();
  let urlpolls = `/api/polls/`;
  isFinish(urlpolls, poll_id);

});


