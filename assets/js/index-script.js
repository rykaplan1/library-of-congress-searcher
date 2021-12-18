//Global Variables
let query;
let format;

//Event Listeners
$(".search-button").click(function() {
  query = $(".search-button").siblings("input").val();
  format = $(".search-button").siblings("select").val();
  searchListener(query, format);
});
