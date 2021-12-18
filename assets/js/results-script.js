//Global Variables
let query;
let format;
let formattedQuery;

//Functions
const displayResults = (data) => {
  const results = data.results;
  let resultsTitle = `${data.pagination.of} results for ${formattedQuery}`;
  if (format !== "search") {
    resultsTitle += ` in ${data.title}`;
  }
  $('h2').text(resultsTitle);

  $("#page-count").text(`${data.pagination.current} of ${data.pagination.total}`);

  if (data.pagination.first) {
    $('#first').data("link", data.pagination.first).css('visibility', 'visible');
  } else {
    $('#first').css('visibility', 'hidden');
  }

  if (data.pagination.previous) {
    $('#previous').data("link", data.pagination.previous).css('visibility', 'visible');
  } else {
    $('#previous').css('visibility', 'hidden');
  }

  if (data.pagination.next) {
    $('#next').data("link", data.pagination.next).css('visibility', 'visible');
  } else {
    $('#next').css('visibility', 'hidden');
  }

  if (data.pagination.last) {
    let lastPageLink = `https://www.loc.gov/${format}/?fo=json&q=${query}&sp=${data.pagination.total}`
    $('#last').data("link", lastPageLink).css('visibility', 'visible');
  } else {
    $('#last').css('visibility', 'hidden');
  }

  $("#results-scroller").text('');

  for (let i = 0; i < results.length; i++) {
    const resultEntry = $('<article class="result-entry"></article>');
    const result = results[i];
    resultEntry.append(`<h3>${result.title}</h3>`);
    let year;
    if (result.date) {
      year = result.date.slice(0, 4);
    } else {
      year = "No year for this entry."
    }
    resultEntry.append(`<p><strong>Year:</strong> ${year}</p>`);
    let subjects;
    if (result.subject) {
      subjects = result.subject.join(', ');
    } else {
      subjects = "No subjects listed for this entry."
    }
    resultEntry.append(`<p><strong>Subjects:</strong> ${subjects}</p>`);
    let description;
    if (result.description) {
      description = result.description;
    } else {
      description = "No description for this entry."
    }
    resultEntry.append(`<p><strong>Description:</strong> ${description}</p>`);
    if (format === "search") {
      const originalFormat = result.original_format.join(', ');
      resultEntry.append(`<p><strong>Original format:</strong> ${originalFormat}</p>`)
    }
    resultEntry.append(`<div class="button read-more" data-link="${result.url}">Read More</div>`)

    $("#results-scroller").append(resultEntry);
  }

  $(".read-more").css({"background-color": "#304A70", "color": "#B1D6F2", "width": "20%", "margin-left": "0px"}).click(function() {
    window.open($(this).data('link'), '_blank');
  });
};

//To execute on load
const queryString = window.location.search.slice(1);

[query, format] = queryString.split("&").map(queryElement => queryElement.split('=').slice(-1)[0]);

if (query.includes('%20')) {
  formattedQuery = query.replace('%20', ' ');
}

$('.search-term').val(formattedQuery);

if (format) {
  $('.select-format').val(format);
} else {
  format = "search";
}

fetch(`https://www.loc.gov/${format}/?q=${query}&fo=json`)
.then(response => response.json())
.then(data => displayResults(data));

//Event Listeners
$(".search-button").click(function() {
  query = $(".search-button").siblings("input").val();
  format = $(".search-button").siblings("select").val();
  searchListener(query, format);
});

$("#go-back-button").click(function() {
  window.location.assign('index.html');
});

$(".nav-button").click(function() {
  fetch($(this).data('link'))
  .then(response => response.json())
  .then(data => displayResults(data));
});