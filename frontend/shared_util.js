var _ = require('lodash');

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

/**
 * Input a match, get an array of potential payouts.
 *
 */
var payouts = exports.payouts = function (match) {

  var betTotal = _.sum(match.betPot);

  var payouts = new Array(match.betPot.length);

  for (var i = 0; i < match.betPot.length; i++)
  {
    if (match.betPot[i] > 0)
    {
      var pay = .95 * (betTotal - match.betPot[i]);
      payouts[i] = _.round(pay/match.betPot[i] + 1, 2);
    }
    else
    {
     payouts[i] =  _.round(1, 2);
    }
  }

  return payouts;
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
  'complexity': {
    display_name:"Complexity",
    logo_url:"compLexity-Gaming-col.png"
  },
  'counter_logic_gaming': {
    display_name:"Counter Logic Gaming",
    logo_url:"Counter-Logic-Gaming-CLG.png"
  },
  'denial_esports': {
    display_name:"Denial E-Sports",
    logo_url:"Denial-eSports.png"
  },
  'followesports': {
    display_name:"FollowEsports",
    logo_url:"follow-esports-fe-team-logo.png"
  },
  'luminosity': {
    display_name:"Luminosity",
    logo_url:"Luminosity-LUM-Logo.png"
  },
  'ace_gaming': {
    display_name:"Ace Gaming",
    logo_url:"Ace-Gaming.png"
  },
  'nexus': {
    display_name:"Nexus",
    logo_url:""
  },
  'gosu': {
    display_name:"Gosu",
    logo_url:""
  },
  'astral_authority': {
    display_name:"Astral Authority",
    logo_url:"Astral-Authority.png"
  },
  'complexity_gaming': {
    display_name:"compLexity Gaming",
    logo_url:"compLexity-Gaming-col.png"
  },
  'mvp_phoenix': {
    display_name:"MVP Phoenix",
    logo_url:"MVP-Phoenix-Ph.png"
  },
  'the_chiefs': {
    display_name:"The Chiefs",
    logo_url:"The-Chiefs-Logo.png"
  },
  'trident': {
    display_name:"Trident",
    logo_url:"Trident-CS-Logo.png"
  },
  '4clovers__lepricon': {
    display_name:"4Clovers & Lepricon",
    logo_url:"4Clover-4-Leppricon-new.png"
  },
  'puzzle': {
    display_name:"Puzzle",
    logo_url:"Team-Puzzle.png"
  },
  'dicionary': {
    display_name:"Dicionary",
    logo_url:""
  },
  'no_logic_gaming': {
    display_name:"No Logic Gaming",
    logo_url:"no-logic-gaming-nlg.png"
  },
  'team_satuduatiga': {
    display_name:"Team SatuDuaTiga",
    logo_url:"team-123-logo-2.png"
  },
  'ideal': {
    display_name:"iDeal",
    logo_url:"iDeal-Gigabyte-logo.png"
  },
  'og': {
    display_name:"OG",
    logo_url:"OG.png"
  },
  'natus_vincere': {
    display_name:"Natus Vincere",
    logo_url:"Natus-Vincere-NaVI.png"
  },
  'devils_advocates': {
    display_name:"Devil's Advocates",
    logo_url:""
  },
  '7kings': {
    display_name:"7Kings",
    logo_url:""
  },
  'the_alliance': {
    display_name:"The Alliance",
    logo_url:"The-Alliance-new.png"
  },
  'goomba_gaming': {
    display_name:"GOOMBA Gaming",
    logo_url:"GOOMBA-Gaming.jpg"
  },
  'cis_rejects': {
    display_name:"CIS Rejects",
    logo_url:"CIS-Rejects-CISR.png"
  },
  'prodota_gaming': {
    display_name:"Prodota Gaming",
    logo_url:"Prodota-Gaming-new.png"
  },
  'team_alternate': {
    display_name:"Team Alternate",
    logo_url:"Team-Alternate.png"
  },
  '_gamenergy': {
    display_name:" gamENERGY",
    logo_url:""
  },
  'team_yp': {
    display_name:"Team YP",
    logo_url:"Team-YP-logo-smash.png"
  },
  'sk_gaming': {
    display_name:"SK Gaming",
    logo_url:"SK-Gaming-logo.png"
  },
  'g2_esports': {
    display_name:"G2 Esports",
    logo_url:"g2-esports.png"
  },
  'team_dignitas': {
    display_name:"Team Dignitas",
    logo_url:"Team-Dignitas.png"
  },
  'team_solomid': {
    display_name:"Team Solomid",
    logo_url:"Team-SoloMid-TSM.png"
  },
  'efragnet': {
    display_name:"E-frag.net",
    logo_url:"e-frag-team-logo.png"
  },
  'lounge_gaming': {
    display_name:"Lounge Gaming",
    logo_url:"Lounge-Gaming-csgl-team-logo.png"
  },
  'neophyte': {
    display_name:"nEophyte",
    logo_url:"nEophyte.png"
  },
  'ezmarketorg': {
    display_name:"EZmarket.org",
    logo_url:""
  },
  'killerfish_esports': {
    display_name:"Killerfish eSports",
    logo_url:"killerfish-eSport-KF.png"
  },
  'playingducks_ev': {
    display_name:"Playing-Ducks e.V.",
    logo_url:"Playing-Ducks-e.V.-PDucks.png"
  },
  'caseking': {
    display_name:"CaseKing",
    logo_url:""
  },
  'vega_squadron': {
    display_name:"Vega Squadron",
    logo_url:"Vega-Squadron.png"
  },
  'planetkey_dynamics': {
    display_name:"Planetkey Dynamics",
    logo_url:"Planetkey.png"
  },
  'eyes_on_u': {
    display_name:"EYES ON U",
    logo_url:"Eyes-on-u-Multigaming.png"
  },
  'digital_chaos': {
    display_name:"Digital Chaos",
    logo_url:"Digital-Chaos.png"
  },
  'elite_wolves': {
    display_name:"Elite Wolves",
    logo_url:"EliteWolves.png"
  },
  'team_mischief': {
    display_name:"Team Mischief",
    logo_url:""
  },
  'friendship_dedication_love': {
    display_name:"Friendship Dedication Love",
    logo_url:"Friendship-Dedication-Love.png"
  },
  'rex_regum_qeon': {
    display_name:"Rex Regum Qeon",
    logo_url:"Rex-Regum-Qeon-RRQ.png"
  },
  'pewpewvn': {
    display_name:"PewPewVN",
    logo_url:"PewPewVN.png"
  },
  'team_liquid': {
    display_name:"Team Liquid",
    logo_url:"Team-Liquid-TL.png"
  },
  'tyloo': {
    display_name:"TyLoo",
    logo_url:"TyLoo.png"
  },
  'pow': {
    display_name:"pow",
    logo_url:""
  },
  'team_empire': {
    display_name:"Team Empire",
    logo_url:"Team-Empire.png"
  },
  'signaturetrust': {
    display_name:"Signature.Trust",
    logo_url:"Signature-Gaming-Logo.png"
  },
  'team_panglima5': {
    display_name:"Team Panglima(5)",
    logo_url:"Team-Panglima.png"
  },
  'various_artists': {
    display_name:"Various Artists",
    logo_url:""
  },
  'gank': {
    display_name:"GANK",
    logo_url:""
  },
  'virtuspro': {
    display_name:"Virtus.pro",
    logo_url:"Virtus.Pro.png"
  },
  'hehe_united': {
    display_name:"hehe united",
    logo_url:"hehe-united.png"
  },
  'chappa': {
    display_name:"Chappa",
    logo_url:"Chappa.png"
  },
  'euronics_gaming': {
    display_name:"Euronics Gaming",
    logo_url:""
  },
  'team_secret': {
    display_name:"Team Secret",
    logo_url:"Team-Secret.png"
  },
  'titan': {
    display_name:"Titan",
    logo_url:"Titan.png"
  },
  'penta_sports': {
    display_name:"PENTA Sports",
    logo_url:"PENTA-Sports.png"
  },
  'ux': {
    display_name:"uX",
    logo_url:"UX-Gaming.png"
  },
  'mvpkarnal': {
    display_name:"MVP.karnal",
    logo_url:"MVP-karnal.png"
  },
  'fnatic_': {
    display_name:"Fnatic ",
    logo_url:"Fnatic.png"
  },
  'blametv': {
    display_name:"BlameTV",
    logo_url:"blametv-btv.png"
  },
  'yellow_submarine': {
    display_name:"Yellow Submarine",
    logo_url:"Yellow-Submarine.png"
  },
  'enso': {
    display_name:"Enso",
    logo_url:"enso-cybersport-club-team-logo.png"
  },
  'team_envyus': {
    display_name:"Team EnVyUs",
    logo_url:"Team-EnVyUs-Logo.png"
  },
  'unknownxiu': {
    display_name:"unknown.xiu",
    logo_url:"unknown-xiu.png"
  },
  'leviathan': {
    display_name:"Leviathan",
    logo_url:"Team-Leviathan.png"
  },
  't_show': {
    display_name:"T Show",
    logo_url:"Team-T-Show.png"
  },
  'pain_gaming': {
    display_name:"paiN Gaming",
    logo_url:"paiN-Gaming.png"
  },
  'team_nxl': {
    display_name:"Team nxl",
    logo_url:"team-nxl.png"
  },
  'cyberzen': {
    display_name:"CyberZen",
    logo_url:""
  },
  'first_departure': {
    display_name:"First Departure",
    logo_url:"First-Departure-FD-logo.png"
  },
  'team_redemption': {
    display_name:"Team Redemption",
    logo_url:"Team-Redemption.png"
  },
  'scaryfacez': {
    display_name:"ScaryFaceZ",
    logo_url:"Team-ScaryFaceZ."
  },
  'siberian_valenki_black': {
    display_name:"Siberian Valenki Black",
    logo_url:""
  },
  'walrus_punch': {
    display_name:"Walrus Punch!",
    logo_url:""
  },
  'default': {
    display_name:"Default",
    logo_url:"40x40.png"
  }
};
