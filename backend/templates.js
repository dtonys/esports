var _ = require('lodash');
var fs = require('fs');

var templateCache = {};
var path_to_templates;
var tmpl_ext;

var getTemplate = function( file_name ){
  if( templateCache[file_name] ) return templateCache[file_name];
  var tmpl = fs.readFileSync( path_to_templates+file_name+tmpl_ext).toString();
  var tmpl_fn = templateCache[file_name] = _.template( tmpl );
  return tmpl_fn;
};

module.exports = function( args ){
  path_to_templates = args.path;
  tmpl_ext = args.ext;
  return getTemplate;
};