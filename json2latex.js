#!/usr/bin/env node
const fs = require('fs');
function objPath(a) {
  var list = [];
  (function(o, r) {
    r = r || '';
    if (typeof o != 'object') {
      return true;
    }
    for (var c in o) {
      if (arguments.callee(o[c], r + "." + c)) {
        list.push(r.substring(1) + "." + c);
      }
    }
    return false;
  })(a);
  return list;
}
const romans = [
  'I','II','III','IV','V','VI','VII','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'
]
var filePath = process.argv.slice(2)[0];
if (!filePath) filePath = 'resume.json';
var resumeData = require('./'+filePath);
resumeData.basics.givenname = resumeData.basics.name.split(' ')[0];
resumeData.basics.surname = resumeData.basics.name.split(' ')[1];
let writeCommand = function(name, val) { 
  for (let i = 0; i < romans.length; i++)
    name = name.replace(RegExp(i,"g"),romans[i]);
  name = name.replace(/[^A-Za-z]/g, "");
  return `\\def\\${name}{${val}}\n`;
}
var objList = objPath(resumeData);
var fileOutput = '';
for (var str of objList) {
  let val = str.split('.').reduce((o,i)=>o[i], resumeData);
  val = val.replace(/\n/g, '\\\\')
  fileOutput += writeCommand(str, val);
}
fs.writeFile("resume-data.tex", fileOutput, (err) => {console.log(err)}); 