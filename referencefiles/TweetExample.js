/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

$(document).ready(function() {
  const $form = $('form');

  const renderTweets = function(tweets) {
    // loops through tweets
    for (tweet of tweets) {
      $('#tweets-container').prepend(createTweetElement(tweet));
    }
  };

  const createTweetElement = function(tweetData) {
    const $article = $('<article>');
    const $sectionProfile = $('<section>');
    const $divProfile = $('<div>');
    const $imgProfile = $('<img>');
    const $labelName = $('<label>');
    const $divTag = $('<div>');
    const $labelTag = $('<label>').addClass('tag');
    const $sectionTweet = $('<section>').addClass('old-tweet-text');
    const $labelTweet = $('<label>');
    const $sectionBelow = $('<section>').addClass('below');
    const $labelTimeAgo = $('<label>');
    const $sectionIcons = $('<section>');
    const $flag = $('<i>').addClass('fas fa-flag');
    const $share = $('<i>').addClass('fas fa-retweet');
    const $like = $('<i>').addClass('fas fa-heart');


    $labelName.text(tweetData.user.name);
    $imgProfile.attr("src", tweetData.user.avatars);
    $labelTag.text(tweetData.user.handle);
    $labelTweet.text(tweetData.content.text);
    $labelTimeAgo.text(moment(new Date(tweetData.created_at)).fromNow());

    $divTag.append($labelTag);

    $divProfile.append($imgProfile, $labelName);

    $sectionProfile.append($divProfile, $divTag);

    $sectionTweet.append($labelTweet);

    $sectionIcons.append($flag, $share, $like);
    $sectionBelow.append($labelTimeAgo, $sectionIcons);

    $article.append($sectionProfile, $sectionTweet, $sectionBelow);

    return $article;
  };

  $form.on('submit', (event) => {
    $('.error').css('display','none');
    $('.error2').css('display','none');
    event.preventDefault();
    const formData = $form.serialize();
    const text = replaceUnexpectedCharactersForSpaces(formData);
    if (text.length === 0) {
      console.log(text);
      $('.error').css('display','contents');
    } else if (text.length > 140) {
      $('.error2').css('display','contents');
    } else {
      console.log(text);
      $('.error').css('display','none');
      $.post('/tweets', formData)
        .then((res) => {
          $('#tweet-text').val('');
          $('#tweets-container').empty();
          loadTweets();
        });
    }
  });

  //Show or hide the create a new tweet
  const showNewTweet = function(position) {
    $("#write-a-tweet").click(function() {
      if (position === 'up') {
        $(".tweet").slideDown();
        position = 'down';
      } else {
        $(".tweet").slideUp();
        position = 'up';
      }
      console.log(position);
    });
  };
  //formData have %20 when the user input was an space, this function solve that problem.
  const replaceUnexpectedCharactersForSpaces = function(data) {
    let result = [];
    for (let i = 5; i < data.length; i ++) {
      if (data[i] === '%' && data[i + 1] === '2' && data[i + 2] === '0') {
        result += ' ';
        i += 2;
      } else {
        result += data[i];
      }
    }
    return result;
  };

  const loadTweets = () => {
    $.get("/tweets")
      .then((data) => {
        renderTweets(data);
      });
  };
  showNewTweet('down');
  loadTweets();

});
