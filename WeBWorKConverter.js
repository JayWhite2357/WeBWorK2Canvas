var tar = require('tar-stream');
var gunzip = require('gunzip-maybe');
var filereader = require('filereader-stream');
const openDateRegex = /openDate/;
const dueDateRegex = /dueDate/;
const valueRegex = /value/;
const equals = /.*=/;
const am = /[Aa][Mm]/;
const pm = /[Pp][Mm]/;
const filenameRegex = /set.*.def/


var extractFile = function(file, callback) {
  var extract = tar.extract();
  extract.on('entry', function(header, stream, next) {
    // header is the tar header
    // stream is the content body (might be an empty stream)
    // call next when you are done with this entry
    var content = '';
    var openDate = '';
    var dueDate = '';
    var points = 0;
    stream.on('data', function(buf) { content += buf.toString(); });
    stream.on('end', function() {
      filename = header.name;
      if (!filenameRegex.test(filename)) {
        return;
      }
      seturl = filename.substring(3, filename.length - 4);
      setname = seturl.replace(/_/g," ");
      var lines = content.split(/[\r\n]+/);
      for (const line of lines) {
        var isOpenDate = openDateRegex.test(line);
        var isDueDate = dueDateRegex.test(line);
        if (isOpenDate || isDueDate){
          date = new Date(line.replace(equals,"").replace("at"," ").replace(am," am ").replace(pm," pm "));
          if (isOpenDate){
            openDate = date.toISOString();
          } else {
            dueDate = date.toISOString();
          }
        }
        if (valueRegex.test(line)) {
          points = points + parseInt(line.replace(equals,""))
        }
      }
      console.log("filename:"+filename);
      console.log("seturl:"+seturl);
      console.log("setname:"+setname);
      console.log("openDate:"+openDate);
      console.log("dueDate:"+dueDate);
      console.log("points:"+points);
      console.log(callback);
      callback(seturl, setname, openDate, dueDate, points);
      next(); // ready for next entry
    });
    stream.resume(); // just auto drain the stream
  });
  extract.on('finish', function() {
    // all entries read
  });
  filereader(file).pipe(gunzip()).pipe(extract);
}
global.window.eFile = extractFile;
