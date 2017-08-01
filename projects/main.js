var partnersURL = 'https://docs.google.com/spreadsheets/d/1y_FVjRDYBBpUN4Pxf5iMjlAJH4bx9qhdzPoLw9fiU0A/pubhtml';
var studentsURL = 'https://docs.google.com/spreadsheets/d/1xb2gFO1So3U1r6mYPJ28XHDw7s-M2h49kSFHzbJODMI/pubhtml';
var facultyURL = 'https://docs.google.com/spreadsheets/d/1TNppz6r-A8lC1tA5zwO_3AqRGYkNX-dgwazEIpEtudc/pubhtml';

Tabletop.init({
  key: partnersURL,
  callback: processData,
  simpleSheet: true,
});

function processData(data, tabletop) {
  if (!data[0]) return;

  for (i in data) {
    if (data[i].Display !== 'y') continue;

    var proj = data[i]['Project Name'];
    if (!proj) continue;

    $('body').append('<div class="project-div" id="project-' + proj + '"></div>');
    var div = '#project-' + proj;

    var org = data[i]['What is your organization and its mission?'];
    var project = data[i]['What is your proposed problem and/or researchable question?'];
    var impact = data[i]['Why does it matter?'];

    $(div).append('<h1>Project ' + proj + '</h1>');
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
              var proj = row[key].split(' ')[0];
              if (!projects[proj]) {
                projects[proj] = {};
              }
              if (!projects[proj][choice]) {
                projects[proj][choice] = [];
              }

              projects[proj][choice].push(name);
            }
          });
        }
      }

      var projectKeys = Object.keys(projects);
      for (p in projectKeys) {
        var proj = projectKeys[p];
        var message = '';

        if (who === 's') {
          var t = projects[proj];
          console.log(t)
          var n = Object.keys(t).map(function(x) {return t[x].length;}).reduce(function(a, b) {return a+b;});
          if (n > 0) {
            message = n + ' student' + (n == 1 ? '' : 's') + ' prefer' + (n != 1 ? '' : 's') + ' this project.';
          }
        } else {
          var t = projects[proj]['1st'];
          if (t) {
            var n = t.length;
            if (n > 0) {
              message = 'Professor' + (n == 1 ? ' ' : 's ') + t.join(', ') + ' prefer' + (n != 1 ? '' : 's') + ' this project.<br>';
            }
          }
        }


        /*
        if (projects[proj]['1st']) {
          var n = projects[proj]['1st'].length;
          if (n > 0) {
            if (SHOW_NAMES || who == 'f') {
              message = projects[proj]['1st'].join(', ');
            } else {
              message = n + ' student' + (n == 1 ? '' : 's');
            }
            message += (who == 'f')
              ? ' prefers this project.'
              : ' listed this project as their first choice.';
          }
        } */

        $('#project-' + proj + ' .additional').append(message);
      }

      if (who == 'f') {
        processStudentsAndFaculty('s');
      }

    }
  });
}
