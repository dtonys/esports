module.exports = function( name ){
  return require("ejs!templates/"+name+".tmpl.html")
}