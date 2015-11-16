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
  'LOL': {
    icon_url: '/img/lol_icon.png',
    icon_class: 'lol-icon',
    display_name: 'League of Legends',
    short_name: 'LOL'
  },
  'DOTA2': {
    icon_url: '/img/dota2_icon.png',
    icon_class: 'dota2-icon',
    display_name: 'DOTA 2',
    short_name: 'DOTA2'
  },
  'CSGO': {
    icon_url: '/img/csgo_icon.png',
    icon_class: 'csgo-icon',
    display_name: 'Counter Strike GO',
    short_name: 'CSGO'
  },
  'default': {
    icon_url: '/img/40x40.png',
    icon_class: 'default-icon'
  }
};

//http://wiki.teamliquid.net/dota2/Portal:Teams
//http://wiki.teamliquid.net/counterstrike/Portal:Teams

var teamNameMap = exports.teamNameMap = {
  'cloud9': {
    icon_url: '',
    display_name: 'Cloud9',
    initials: 'C9'
  },
  'complexity': {
    icon_url: '',
    display_name: 'compLexity Gaming',
    initials: 'coL'
  },
  'evilgeniuses': {
    icon_url: '',
    display_name:'Evil Geniuses',
    initials:'EG'
  },
  'teamliquid': {
    icon_url:'',
    display_name:'Team Liquid',
    initials:'TL'
  }
};
