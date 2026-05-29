'use strict';

// api/party-picks.js — Party planner curated product picks
// Served as JSON; fetched client-side by js/party.js

const PICKS = {
  red: {
    dinner:   [['5101847', 'Perrin Côtes du Rhône'],     ['5103291', 'Escorihuela Malbec']],
    garden:   [['5104532', 'Beaujolais Villages Duboeuf'],['5101847', 'Perrin Côtes du Rhône']],
    cocktail: [['5101847', 'Perrin Côtes du Rhône'],     ['5104532', 'Beaujolais Villages Duboeuf']],
    birthday: [['5104532', 'Beaujolais Villages Duboeuf'],['5101847', 'Perrin Côtes du Rhône']],
    holiday:  [['5101847', 'Perrin Côtes du Rhône'],     ['5103291', 'Escorihuela Malbec']],
    sports:   [['5103291', 'Escorihuela Malbec'],        ['5106178', 'Chiarlo Barbera d\'Asti']],
  },
  white: {
    dinner:   [['5108943', 'Attems Sauvignon Blanc'],    ['5109614', 'Hugel Gentil']],
    garden:   [['5108943', 'Attems Sauvignon Blanc'],    ['5109614', 'Hugel Gentil']],
    cocktail: [['5108943', 'Attems Sauvignon Blanc'],    ['5109614', 'Hugel Gentil']],
    birthday: [['5108943', 'Attems Sauvignon Blanc'],    ['5109614', 'Hugel Gentil']],
    holiday:  [['5109614', 'Hugel Gentil'],              ['5108943', 'Attems Sauvignon Blanc']],
    sports:   [['5108943', 'Attems Sauvignon Blanc'],    ['5109614', 'Hugel Gentil']],
  },
  sparkling: [['5111203', 'Bottega Gold Prosecco']],
  rose: {
    dinner:   [['5112847', 'Sperling Pet Nat']],
    garden:   [['5112847', 'Sperling Pet Nat'], ['5114029', 'Astro Bunny Pet-Nat']],
    cocktail: [['5112847', 'Sperling Pet Nat']],
    birthday: [['5112847', 'Sperling Pet Nat'], ['5114029', 'Astro Bunny Pet-Nat']],
    holiday:  [['5112847', 'Sperling Pet Nat']],
    sports:   [['5114029', 'Astro Bunny Pet-Nat']],
  },
  beer: {
    ipa:      [['5116302', 'Driftwood Fat Tug IPA', 4],      ['5117891', 'Four Winds Featherweight', 6]],
    lager:    [['5119043', 'Parallel 49 Craft Lager', 6],    ['5120187', 'Backcountry Lager', 4]],
    pilsner:  [['5119043', 'Parallel 49 Craft Lager', 6],    ['5120187', 'Backcountry Lager', 4]],
    sours:    [['5117891', 'Four Winds Featherweight', 6]],
    mixed:    [['5117891', 'Four Winds Featherweight', 6],   ['5119043', 'Parallel 49 Craft Lager', 6]],
    domestic: [['5121456', 'Heineken', 12],                   ['5122734', 'Stella Artois', 12]],
  },
  spirits: {
    whisky:  [['5124091', 'Johnnie Walker Black']],
    gin:     [['5125843', 'Aviation Gin']],
    vodka:   [['5126902', 'Absolut']],
    rum:     [['5127634', 'Appleton Estate']],
    tequila: [['5128475', 'Casamigos Blanco']],
  },
};

module.exports = function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
  res.status(200).json({ picks: PICKS });
};
