const searchListener = (query, format) => {
  if (!query) {
    $('#modal').dialog({
      modal: true,
      draggable: false,
      buttons: [
        {
          text: "OK",
          click: (function() {
            $(this).dialog("close");
          })
        }
      ]
    })
  } else {
    window.location.replace(`search-results.html?q=${query}&format=${format}`);
  }
}