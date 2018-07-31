/*jslint node: true*/
/*jshint esversion: 6 */
/* global $, document, noteful, api, store */
'use strict';

$(document).ready(function () {
  noteful.bindEventListeners();

  api.search({}, response => {
    store.notes = response;
    noteful.render();
  });

});