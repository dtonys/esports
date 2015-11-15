// shared_utils
var capitalize = exports.capitalize = function( str ){
  return str[0].toUpperCase() + str.slice(1);
};

var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
var escape_html = exports.capitalize = function( str ){
  return str[0].toUpperCase() + str.slice(1);
};

var gameNameMap = exports.gameNameMap = {
  'League of Legends': {
    icon_url: '/img/lol_icon.png',
    icon_class: 'lol-icon'
  },
  'league': {
    icon_url: '/img/lol_icon.png',
    icon_class: 'lol-icon'
  },
  'leagueoflegends': {
    icon_url: '/img/lol_icon.png',
    icon_class: 'lol-icon'
  },
  'LoL': {
    icon_url: '/img/lol_icon.png',
    icon_class: 'lol-icon'
  },
  'League of Legends': {
    icon_url: '/img/lol_icon.png',
    icon_class: 'lol-icon'
  },
  'DOTA2': {
    icon_url: '/img/dota2_icon.png',
    icon_class: 'dota2-icon'
  },
  'dota2': {
    icon_url: '/img/dota2_icon.png',
    icon_class: 'dota2-icon'
  },
  'CSGO': {
    icon_url: '/img/csgo_icon.png',
    icon_class: 'csgo-icon'
  },
  'csgo': {
    icon_url: '/img/csgo_icon.png',
    icon_class: 'csgo-icon'
  },
  'default': {
    icon_url: '/img/40x40.png',
    icon_class: 'default-icon'
  }
};
