let APP = (function(){
  'use strict';

  let app = {};
  let _app = {};

  _app.menuItemClicked = false;
  _app.menuItemAnimation = false;
  _app.data = {artists: [
    {id: "munari", artist: "Bruno Munari", title: "Cyber disruption", year: "1953"},
    {id: "gerstner", artist: "Karl Gerstner", title: "Eccentric tangential", year: "1956"},
    {id: "barrese", artist: "Antonio Barrese", title: "Stroboscopic discs", year: "1964"},
    {id: "chiggio", artist: "Ennio L. Chiggio", title: "Visual structure - Rings alternating mobile margins", year: "1964-1968"},
    {id: "varisco", artist: "Grazia Varisco", title: "Variable light scheme", year: "1965"},
    {id: "apollonio", artist: "Marina Apollonio", title: "Circular dynamic 6S + S", year: "1966"},
    {id: "biasi", artist: "Alberto Biasi", title: "Drops", year: "1967"}
  ]};

  // PUBLIC
  app.init = function (){
    //generazione menu
    var templateDesc = $('#menu-template-desc').html();
    var templateCircle = $('#menu-template-item').html();
    let htmlDesc = '';
    let htmlCircle = '';
    
    //calcolo la posizione delle voci di menu
    var n = _app.data.artists.length;
    var r = 50;
    var step = (2 * Math.PI) / n;
    var angle = 0;
    for (var i = 0; i < n ; i++) { 
      var x = r * Math.cos(angle);
      var y = r * Math.sin(angle);
      _app.data.artists[i].top = (y + 50-7) + '%';
      _app.data.artists[i].left = (x + 50-7) + '%';
      angle += step;
    }
    
    _app.data.artists.forEach(e => {
      htmlDesc += placeholders(templateDesc, e);
      htmlCircle += placeholders(templateCircle, e);
    });
    $('.menu-desc').append(htmlDesc);
    $('.menu-circle').append(htmlCircle);

    //gestione hover menu-item
    $('.menu-item').hover(_app.hoverOn, _app.hoverOff);

    //gestione click menu-item
    $('.menu-item').on('click', _app.click);

    $(window).bind('hashchange', function(e) {
      _app.hashChange();
    });
    _app.hashChange();
  }

  // PRIVATE
  _app.hoverOn = function() {
    if (_app.menuItemClicked === false && _app.menuItemAnimation === false) {
      var artistId = $(this).attr('data-artist');
  
      TweenMax.to('.menu-desc-item.default', 0.2, {opacity: 0, y: 10, ease: Power3.easeOut});
  
      $('.menu-desc-item.visible').removeClass('visible');
      $('.menu-desc-item[data-artist="' + artistId + '"]').addClass('visible');
    }
  }
  _app.hoverOff = function() {
    if (_app.menuItemClicked === false && _app.menuItemAnimation === false) {
      $('.menu-desc-item.visible').removeClass('visible');
  
      TweenMax.to('.menu-desc-item.default', 0.2, {opacity: 1, y: 0, ease: Power3.easeOut});
    }
  }
  _app.click = function() {
    if (_app.menuItemClicked === false && _app.menuItemAnimation === false) {
      _app.menuItemClicked = true;
      var artistId = $(this).attr('data-artist');
      location.href = '#' + artistId;    
    }
  }
  _app.hashChange = function() {  
    var sectionId = window.location.hash.substr(1);
    if (sectionId == '') {
      sectionId = 'home';
    }
    _app.showSection(sectionId);
  }
  _app.showSection = function(idToShow) {
    var $sectionToShow =  $('#' + idToShow);
    var $sectionToHide = $('.section.visible');
    var idToHide = $sectionToHide.attr('id');
  
    _app.menuItemAnimation = true;
    $('#home .menu-item').addClass('reset-cursor');
  
    //hide 
    if ($sectionToHide.length) {
      //nascondo il menu, la descrizione e gli step
      $('.dots, .section-desc, .bottom-right, #' + idToHide + ' .step').removeClass('visible').addClass('hidden');
  
      //se ho una sezione da nascondere
      if (typeof MIRIORAMA[idToHide].hide === 'function') {
        MIRIORAMA[idToHide].hide(function() { 
          TweenMax.to($sectionToHide, 0.5, {opacity: 0, onComplete: showNext});
        });
      } else {
        TweenMax.to($sectionToHide, 0.5, {opacity: 0, onComplete: showNext});
      }
    } else {
      //la prima volta che arrivo in homepage non ho una sezione da nascondere
      showNext();
    }
  
    function showNext() {
      _app.menuItemClicked = false;
  
      $sectionToHide.removeClass('visible');
      $sectionToShow.addClass('visible');
  
      //inizializzo solo una volta
      if ($sectionToShow.attr('data-initialize') == undefined) {
        if (MIRIORAMA[idToShow] && typeof MIRIORAMA[idToShow].initialize === 'function') {
          MIRIORAMA[idToShow].initialize();
          $sectionToShow.attr('data-initialize', true);
        }
      }
  
      //nel mentre mostro i dots e le desc
      var $desc = $('.dots, .section-desc, .bottom-right');
      if (idToShow != 'home') {
        //imposto il colore dei dots
        if ($sectionToShow.hasClass('negative')) {
          $desc.addClass('negative');
        } else {
          $desc.removeClass('negative');
        }
  
        //valorizzo i dati dell'opera
        var filtered = _app.data.artists.filter(function (item) {
          return item.id === idToShow;
        });
        var artist = filtered[0];
  
        $('.section-desc-artist').html(artist.artist);
        $('.section-desc-title').html(artist.title);
        $('.section-desc-year').html(artist.year);
  
        //visualizzo il primo step
        $('#' + idToShow + ' .step-1').addClass('visible');
  
        //rendo visibile il tutto
        $desc.addClass('visible');
      }
  
      //transizione dettaglio opacity
      TweenMax.to($sectionToShow, 1, { 
        opacity: 1, 
        onComplete: function () {
          //transizione custom sezione
          if (typeof MIRIORAMA[idToShow].show === 'function') {
            MIRIORAMA[idToShow].show(function(){
              if (idToShow == 'home') {
                $('.section-desc-artist').html('');
                $('.section-desc-title').html('');
                $('.section-desc-year').html('');
                $('.section-desc, .bottom-right').removeClass('negative').addClass('visible');
              }
              _app.menuItemAnimation = false;
              $('#home .menu-item').removeClass('reset-cursor');
            });
          } else {
            _app.menuItemAnimation = false;    
            $('#home .menu-item').removeClass('reset-cursor');    
          }
        }
      });
    }
  }

  return app;
})();

$(function(){
  APP.init();
});

/*!
 * Replaces placeholders with real content
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param {String} template The template string
 * @param {String} local    A local placeholder to use, if any
 */
var placeholders = function (template, data) {

	'use strict';

	// Check if the template is a string or a function
	template = typeof (template) === 'function' ? template() : template;
	if (['string', 'number'].indexOf(typeof template) === -1) throw 'PlaceholdersJS: please provide a valid template';

	// If no data, return template as-is
	if (!data) return template;

	// Replace our curly braces with data
	template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {

		// Remove the wrapping curly braces
		match = match.slice(2, -2);

		// Check if the item has sub-properties
		var sub = match.split('.');

		// If the item has a sub-property, loop through until you get it
		if (sub.length > 1) {

			var temp = data;

			sub.forEach(function (item) {

				// Make sure the item exists
				if (!temp[item]) {
					temp = '{{' + match + '}}';
					return;
				}

				// Update temp
				temp = temp[item];
			});

			return temp;

		}

		// Otherwise, return the item
		else {
			if (!data.hasOwnProperty(match)) return '{{' + match + '}}';
			return data[match];
		}

	});

	return template;
};






