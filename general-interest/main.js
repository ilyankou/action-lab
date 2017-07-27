var generalURL = 'https://docs.google.com/spreadsheets/d/1JjydNUsGCT2L3n1OofoD2vCYXTYi0zeAtaBT4qdFGv8/pubhtml';

Tabletop.init({
  key: generalURL,
  callback: processData,
  simpleSheet: true,
});

function processData(data, tabletop) {

  for (i in data) {
    if (data[i].Display !== 'y') continue;

    $('table').append('\
      <tr> \
        <td>' + data[i]['What is your name?'] + '</td>\
        <td>' + data[i]['What is your affiliation?'] + '</td> \
        <td>' + data[i]['In 5 words or less, tell us what interests you in Hartford'] + '</td>\
      </tr> \
    ');
  }

}
