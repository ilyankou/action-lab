var partnersURL = 'https://docs.google.com/spreadsheets/d/1y_FVjRDYBBpUN4Pxf5iMjlAJH4bx9qhdzPoLw9fiU0A/pubhtml';
var studentsURL = '';
var facultyURL = '';

WHOSE_FIRST_CHOICE = false;

Tabletop.init({
  key: partnersURL,
  callback: processData,
  simpleSheet: true,
});

function processData(data, tabletop) {
  if (!data[0]) return;

  for (i in data) {
    if (data[i].Display !== 'y') continue;

    var letter = data[i]['Project Letter'];
    if (!letter) continue;

    $('body').append('<div class="project-div" id="project-' + letter + '"></div>');
    var div = '#project-' + letter;

    var org = data[i]['What is your organization and its mission?'];
    var project = data[i]['What is your proposed problem and/or researchable question?'];
    var impact = data[i]['Why does it matter?'];

    $(div).append('<h1>Project ' + letter + '</h1>');
    $(div).append('<div class="hr" style="background:#' + Math.random().toString(16).substr(-6) + '"></div>');
    $(div).append('<p><span>ORGANIZATION</span><br>' + org + '</p>');
    $(div).append('<p><span>PROJECT</span><br>' + project + '</p>');
    $(div).append('<p><span>IMPACT</span><br>' + impact + '</p>');

  }

  Tabletop.init({
    key: studentsURL,
    simpleSheet: true,
    callback: function(data) {

      var projects = {};

      for (i in data) {
        var row = data[i];
        var name = row['What\'s your name?'];
        var keys = Object.keys(row);

        var choices = ['1st', '2nd', '3rd', '4th', '5th'];

        for (j in keys) {
          var key = keys[j];
          choices.forEach(function(choice) {
            if (key.indexOf(choice) > -1) {
              var letter = row[key].split(' ')[1];
              if (!projects[letter]) {
                projects[letter] = {};
              }
              if (!projects[letter][choice]) {
                projects[letter][choice] = [];
              }

              projects[letter][choice].push(name);
            }
          });
        }
      }

      var projectKeys = Object.keys(projects);
      for (p in projectKeys) {
        var letter = projectKeys[p];
        var message = 'Nobody\'s first choice yet.';

        if (projects[letter]['1st']) {
          var n = projects[letter]['1st'].length;
          if (n > 0) {
            if (WHOSE_FIRST_CHOICE) {
              message = 'First choice of ' + projects[letter]['1st'].join(', ') + '.';
            } else {
              message = 'First choice of ' + n + ' student' + (n == 1 ? '.' : 's.');
            }
          }
        }

        $('<p>' + message + '</p>').insertAfter('#project-' + letter + ' h1');
      }
    }
  });
}
