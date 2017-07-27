var googleSheetProjects = 'https://docs.google.com/spreadsheets/d/12diI3t7gfX-ysGFhsf1FGRH-J2D6DOJb3ZVmAASxNbg/pubhtml';
var googleSheetStudents = 'https://docs.google.com/spreadsheets/d/1t4HvL0A2IVrEthJ4_KwD48BMRCi61fTYsya5K0u3UIU/pubhtml';

WHOSE_FIRST_CHOICE = true;

Tabletop.init({
  key: googleSheetProjects,
  callback: processProjects,
  simpleSheet: true,
});

function processProjects(data, tabletop) {
  if (!data[0]) return;

  var skipColumns = ['Timestamp', 'Display', 'Project Letter'];

  for (i in data) {
    if (!data[i].Display || data[i].Display.toLowerCase() !== 'y') {
      continue;
    }

    var letter = data[i]['Project Letter'];
    if (!letter) continue;

    $('body').append('<div class="project-div" id="project-' + letter + '"></div>');
    var div = '#project-' + letter;

    $(div).append('<h1>Project ' + letter + '</h1>');

    var keys = Object.keys(data[i]);

    for (j in keys) {
      var k = keys[j];
      if (skipColumns.indexOf(k) > -1) continue;

      $(div).append('<h4>' + k + '</h4>');
      $(div).append('<div>' + data[i][k] + '</div>');
    }
  }

  Tabletop.init({
    key: googleSheetStudents,
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
