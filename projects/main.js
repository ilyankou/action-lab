var partnersURL = 'https://docs.google.com/spreadsheets/d/1y_FVjRDYBBpUN4Pxf5iMjlAJH4bx9qhdzPoLw9fiU0A/pubhtml';
var studentsURL = 'https://docs.google.com/spreadsheets/d/1xb2gFO1So3U1r6mYPJ28XHDw7s-M2h49kSFHzbJODMI/pubhtml';
var facultyURL = 'https://docs.google.com/spreadsheets/d/1TNppz6r-A8lC1tA5zwO_3AqRGYkNX-dgwazEIpEtudc/pubhtml';

SHOW_NAMES = true;

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
    $(div).append('<p class="additional"></p>');
  }

  processStudentsAndFaculty('f');
}


function processStudentsAndFaculty(who) {
  Tabletop.init({
    key: who == 's' ? studentsURL : facultyURL,
    simpleSheet: true,
    callback: function(data) {

      var projects = {};

      for (i in data) {
        var row = data[i];
        var name = row['What is your name?'];
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
        var message = (who == 'f')
          ? 'No faculty members have selected this project as their favorite. '
          : 'No students have selected this project as their first choice yet.';

        if (projects[letter]['1st']) {
          var n = projects[letter]['1st'].length;
          if (n > 0) {
            if (SHOW_NAMES || who == 'f') {
              message = projects[letter]['1st'].join(', ');
            } else {
              message = n + ' student' + (n == 1 ? '' : 's');
            }
            message += (who == 'f')
              ? ' listed this project as their favorite. '
              : ' listed this project as their first choice.';
          }
        }

        $('#project-' + letter + ' .additional').append(message);
      }

      if (who == 'f') {
        processStudentsAndFaculty('s');
      }

    }
  });
}
