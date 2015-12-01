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
  'no_logic_gaming': {
    display_name:"No Logic Gaming",
    logo_url:"no-logic-gaming-nlg.png"
  },
  '4clovers__lepricon': {
    display_name:"4Clovers & Lepricon",
    logo_url:"4Clover-4-Leppricon-new.png"
  },
  'og': {
    display_name:"OG",
    logo_url:"OG.png"
  },
  'natus_vincere': {
    display_name:"Natus Vincere",
    logo_url:"Natus-Vincere-NaVI.png"
  },
  'mvp_phoenix': {
    display_name:"MVP Phoenix",
    logo_url:"MVP-Phoenix-Ph.png"
  },
  'dat_fe': {
    display_name:"dAT fe",
    logo_url:"DAT-Team.png"
  },
  'team_yp_fe': {
    display_name:"Team YP Fe",
    logo_url:"Team-YP-logo-smash.png"
  },
  'the_alliance': {
    display_name:"The Alliance",
    logo_url:"The-Alliance-new.png"
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
  'playingducks_ev': {
    display_name:"Playing-Ducks e.V.",
    logo_url:"Playing-Ducks-e.V.-PDucks.png"
  },
  'london_conspiracy': {
    display_name:"London Conspiracy",
    logo_url:"London-Conspiracy-LC-Logo.png"
  },
  'explosive': {
    display_name:"eXplosive",
    logo_url:"Team-eXplosive.png"
  },
  'complexity_gaming': {
    display_name:"compLexity Gaming",
    logo_url:"compLexity-Gaming-col.png"
  },
  'vega_squadron': {
    display_name:"Vega Squadron",
    logo_url:"Vega-Squadron.png"
  },
  'cis_rejects': {
    display_name:"CIS Rejects",
    logo_url:"CIS-Rejects-CISR.png"
  },
  'onlinebots': {
    display_name:"OnlineBOTS",
    logo_url:"OnlineBOTS-OnBOTS.png"
  },
  'digital_chaos': {
    display_name:"Digital Chaos",
    logo_url:"Digital-Chaos.png"
  },
  'elite_wolves': {
    display_name:"Elite Wolves",
    logo_url:"EliteWolves.png"
  },
  'counter_logic_gaming': {
    display_name:"Counter Logic Gaming",
    logo_url:"Counter-Logic-Gaming-CLG.png"
  },
  'followesports': {
    display_name:"FollowEsports",
    logo_url:"follow-esports-fe-team-logo.png"
  },
  'denial_esports': {
    display_name:"Denial E-Sports",
    logo_url:"Denial-eSports.png"
  },
  'method': {
    display_name:"Method",
    logo_url:"Method.png"
  },
  'friendship_dedication_love': {
    display_name:"Friendship Dedication Love",
    logo_url:"Friendship-Dedication-Love.png"
  },
  'team_liquid': {
    display_name:"Team Liquid",
    logo_url:"Team-Liquid-TL.png"
  },
  'tyloo': {
    display_name:"TyLoo",
    logo_url:"TyLoo.png"
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
  'killerfish_esports': {
    display_name:"Killerfish eSports",
    logo_url:"killerfish-eSport-KF.png"
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
  'execration': {
    display_name:"Execration",
    logo_url:"Execration-XCTN.png"
  },
  'puzzle': {
    display_name:"Puzzle",
    logo_url:"Team-Puzzle.png"
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
  'goomba_gaming': {
    display_name:"GOOMBA Gaming",
    logo_url:"GOOMBA-Gaming.jpg"
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
  'top_dog_gaming': {
    display_name:"Top Dog Gaming",
    logo_url:"Top-Dog-Gaming.png"
  },
  'pain_gaming': {
    display_name:"paiN Gaming",
    logo_url:"paiN-Gaming.png"
  },
  'team_nxl': {
    display_name:"Team nxl",
    logo_url:"team-nxl.png"
  },
  'pewpewvn': {
    display_name:"PewPewVN",
    logo_url:"PewPewVN.png"
  },
  'team_satuduatiga': {
    display_name:"Team SatuDuaTiga",
    logo_url:"team-123-logo-2.png"
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
  'team_alternate': {
    display_name:"Team Alternate",
    logo_url:"Team-Alternate.png"
  },
  'zenith_esports': {
    display_name:"Zenith eSports",
    logo_url:"Zenith-eSports-2.png"
  },
  'also_known_as': {
    display_name:"Also Known As",
    logo_url:"Also-Known-As.png"
  },
  'robert_morris_university_eagles': {
    display_name:"Robert Morris University Eagles",
    logo_url:"RMU-Eagles-logo.png"
  },
  'team_frostbite': {
    display_name:"Team Frostbite",
    logo_url:"Team-Frostbite.png"
  },
  'team_infused': {
    display_name:"Team Infused",
    logo_url:"Team-Infused.png"
  },
  'exertus_esports': {
    display_name:"Exertus Esports",
    logo_url:"Exertus-Esports-v3.png"
  },
  'team_liquid_academy': {
    display_name:"Team Liquid Academy",
    logo_url:"Team-Liquid-Academy.png"
  },
  'fm_esports': {
    display_name:"FM eSports",
    logo_url:"FM-Esports-logo.png"
  },
  'choke_gaming': {
    display_name:"Choke Gaming",
    logo_url:"Choke-Gaming.png"
  },
  'ideal': {
    display_name:"iDeal",
    logo_url:"iDeal-Gigabyte-logo.png"
  },
  'the_chiefs': {
    display_name:"The Chiefs",
    logo_url:"The-Chiefs-Logo.png"
  },
  'trident': {
    display_name:"Trident",
    logo_url:"Trident-CS-Logo.png"
  },
  'rex_regum_qeon': {
    display_name:"Rex Regum Qeon",
    logo_url:"Rex-Regum-Qeon-RRQ.png"
  },
  'complexity': {
    display_name:"Complexity",
    logo_url:"compLexity-Gaming-col.png"
  },
  'luminosity': {
    display_name:"Luminosity",
    logo_url:"Luminosity-LUM-Logo.png"
  },
  'ace_gaming': {
    display_name:"Ace Gaming",
    logo_url:"Ace-Gaming.png"
  },
  'astral_authority': {
    display_name:"Astral Authority",
    logo_url:"Astral-Authority.png"
  },
  'nexus_esports_storm': {
    display_name:"Nexus Esports Storm",
    logo_url:"Nexus-Esports-Storm-Team.png"
  },
  'space_soldiers_': {
    display_name:"Space Soldiers ",
    logo_url:"Space-Soldiers.png"
  },
  'piter': {
    display_name:"PiTER",
    logo_url:"piter-logo.png"
  },
  'torpedo': {
    display_name:"Torpedo",
    logo_url:"torpedo-team-logo.png"
  },
  'publiclirse': {
    display_name:"Publiclir.se",
    logo_url:"PUBLICLIR.png"
  },
  'kingdom': {
    display_name:"Kingdom",
    logo_url:"kingdom-team-logo.png"
  },
  'team_immunity': {
    display_name:"Team Immunity",
    logo_url:"Team-Immunity.png"
  },
  'mvp_hot6': {
    display_name:"MVP HOT6",
    logo_url:"MVP-Phoenix-Ph.png"
  },
  'enemy': {
    display_name:"Enemy",
    logo_url:"Enemy-eSports-Logo.png"
  },
  'tectonic_gaming': {
    display_name:"Tectonic Gaming",
    logo_url:"Tectonic-Gaming.png"
  },
  'epsilon_esports': {
    display_name:"Epsilon eSports",
    logo_url:"epsilon-esports.png"
  },
  'hellraisers': {
    display_name:"Hellraisers",
    logo_url:"hellraisers.png"
  },
  'united_states_of_america': {
    display_name:"United States of America",
    logo_url:"United-States.png"
  },
  'kazakhstan': {
    display_name:"Kazakhstan",
    logo_url:"Kazakhstan.png"
  },
  'wings_gaming': {
    display_name:"Wings Gaming",
    logo_url:"Wings-Gaming.png"
  },
  'cdec_youth': {
    display_name:"CDEC Youth",
    logo_url:"CDEC-new.png"
  },
  'newbeeyoung': {
    display_name:"Newbee.Young",
    logo_url:"Newbee-Young-Newby.png"
  },
  'exteam_dk': {
    display_name:"ex-Team DK",
    logo_url:"Team-DK.png"
  },
  'cis': {
    display_name:"CIS",
    logo_url:"CIS-Flag.png"
  },
  'turkey': {
    display_name:"Turkey",
    logo_url:"Turkey.png"
  },
  'seiya': {
    display_name:"Seiya",
    logo_url:"Lyon-Gaming.png"
  },
  'kira': {
    display_name:"Kira",
    logo_url:"Hard-Random-Logo.png"
  },
  'optimus': {
    display_name:"Optimus",
    logo_url:"Boba-Marines.png"
  },
  'whitelotus': {
    display_name:"WhiteLotus",
    logo_url:"Last-Kings.png"
  },
  'chuchuz': {
    display_name:"ChuChuZ",
    logo_url:"Legacy-eSports-Legacy.png"
  },
  'ceros': {
    display_name:"Ceros",
    logo_url:"detonation-focusme.png"
  },
  'g4': {
    display_name:"G4",
    logo_url:"Bangkok-Titans.png"
  },
  'carbon': {
    display_name:"Carbon",
    logo_url:"Legacy-eSports-Legacy.png"
  },
  'fnatic': {
    display_name:"Fnatic",
    logo_url:"Fnatic.png"
  },
  'stark_esports': {
    display_name:"STARK eSports",
    logo_url:"STARK-eSports.png"
  },
  '_ehomeluminous': {
    display_name:" EHOME.Luminous",
    logo_url:"EHOME.png"
  },
  'spac__creators': {
    display_name:"Spac_ Creators",
    logo_url:"Space-Creators.png"
  },
  'themongolz': {
    display_name:"TheMongolz",
    logo_url:"TheMongolz.png"
  },
  'ftd_club_b': {
    display_name:"FTD club B",
    logo_url:"FTD-club-b.png"
  },
  'tnc_gaming': {
    display_name:"TnC Gaming",
    logo_url:"TnC-Gaming.png"
  },
  'brazil': {
    display_name:"Brazil",
    logo_url:"Brazil.png"
  },
  'japan': {
    display_name:"Japan",
    logo_url:"Japan.png"
  },
  'team_archon': {
    display_name:"Team Archon",
    logo_url:"Team-Archon.png"
  },
  'epiphany': {
    display_name:"Epiphany",
    logo_url:"Team-Epiphany.png"
  },
  'ninjas_in_pyjamas': {
    display_name:"Ninjas In Pyjamas",
    logo_url:"Ninjas-in-Pyjamas-NiP.png"
  },


  'default': {
    display_name:"Default",
    logo_url:"40x40.png"
  }
};
