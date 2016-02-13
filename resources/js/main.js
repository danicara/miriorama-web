window['menuItemClicked'] = false;
window['menuItemAnimation'] = false;

var data = {artists: [
  {id: "munari", artist: "Bruno Munari", initials: "BM", title: "Perturbazione cibernetica", year: "1961"},
  {id: "gerstner", artist: "Karl Gerstner", initials: "KG", title: "Eccentrico tangenziale", year: "1961"},
  {id: "barrese", artist: "Antonio Barrese", initials: "AB", title: "Dischi stroboscopici", year: "1960"},
  {id: "chiggio", artist: "Ennio L. Chiggio", initials: "EC", title: "Struttura visiva - Anelli alternati margini mobili", year: "1964-1968"},
  {id: "varisco", artist: "Grazia Varisco", initials: "GV", title: "Schema luminoso variabile", year: "1965"},
  {id: "apollonio", artist: "Marina Apollonio", initials: "MA", title: "Dinamica circolare 6S + S", year: "1966"},
  {id: "biasi", artist: "Alberto Biasi", initials: "AB", title: "Gocce", year: "1967"}
  /*{id: "massironi", artist: "Manfredo Massironi", initials: "MM", title: "Quadrati rotanti", year: "19**"},*/
]};

$(function(){
  "use strict"

  //generazione menu
  var source = $("#menu-template").html();
  var template = Handlebars.compile(source);

  $(function() {

    //calcolo la posizione delle voci di menu
    var n = data.artists.length;
    var r = 50;
    var step = (2 * Math.PI) / n;
    var angle = 0;
    for (var i = 0; i < n ; i++) { 
      var x = r * Math.cos(angle);
      var y = r * Math.sin(angle);
      data.artists[i].top = (y + 50-7) + '%';
      data.artists[i].left = (x + 50-7) + '%';
      angle += step;
    }
    $('#home .container').html(template(data));



    //gestione hover menu-item
    $('.menu-item').hover(function(){
      if (window['menuItemClicked'] === false && window['menuItemAnimation'] === false) {
        var artistId = $(this).attr('data-artist');

        TweenMax.to('.menu-desc-item.default', 0.2, {opacity: 0, y: 10, ease: Power3.easeOut});

        $('.menu-desc-item.visible').removeClass('visible');
        $('.menu-desc-item[data-artist="' + artistId + '"]').addClass('visible');
      }
    }, function(){
      if (window['menuItemClicked'] === false && window['menuItemAnimation'] === false) {
        $('.menu-desc-item.visible').removeClass('visible');
        TweenMax.to('.menu-desc-item.default', 0.2, {opacity: 1, y: 0, ease: Power3.easeOut});
      }
    });
    //gestione click menu-item
    $('.menu-item').click(function(){
      if (window['menuItemClicked'] === false && window['menuItemAnimation'] === false) {
        window['menuItemClicked'] = true;
        var artistId = $(this).attr('data-artist');
        location.href = '#' + artistId;    
      }
    });

    $(window).bind('hashchange', function(e) {
      hashChange();
    });
    hashChange();
  });
});

function hashChange() {  
  var sectionId = window.location.hash.substr(1);
  if (sectionId == '') {
    sectionId = 'home';
  }
  showSection(sectionId);
}

function showSection(idToShow) {
  var $sectionToShow =  $('#' + idToShow);
  var $sectionToHide = $('.section.visible');
  var idToHide = $sectionToHide.attr('id');

  window['menuItemAnimation'] = true;
  $('#home .menu-item').addClass('reset-cursor');

  //hide 
  if ($sectionToHide.length) {
    //nascondo il menu, la descrizione e gli step
    $('.dots, .section-desc, #' + idToHide + ' .step').removeClass('visible');

    //se ho una sezione da nascondere
    if (typeof miriorama[idToHide].hide === 'function') {
      miriorama[idToHide].hide(function() { 
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
    window['menuItemClicked'] = false;

    $sectionToHide.removeClass('visible');
    $sectionToShow.addClass('visible');

    //inizializzo solo una volta
    if ($sectionToShow.attr('data-initialize') == undefined) {
      if (miriorama[idToShow] && typeof miriorama[idToShow].initialize === 'function') {
        miriorama[idToShow].initialize();
        $sectionToShow.attr('data-initialize', true);
      }
    }

    //nel mentre mostro i dots e le desc
    var $desc = $('.dots, .section-desc');
    if (idToShow != 'home') {
      //imposto il colore dei dots
      if ($sectionToShow.hasClass('negative')) {
        $desc.addClass('negative');
      } else {
        $desc.removeClass('negative');
      }

      //valorizzo i dati dell'opera
      var filtered = data.artists.filter(function (item) {
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
    TweenMax.to($sectionToShow, 1, { opacity: 1, onComplete: function () {

      //transizione custom sezione
      if (typeof miriorama[idToShow].show === 'function') {
        miriorama[idToShow].show(function(){
          if (idToShow == 'home') {
            $('.section-desc-artist').html('Daniele Caraglio');
            $('.section-desc-title').html('<span style="margin-bottom: 2px;display: inline-block;line-height: 1.5em;">Relatore: Federico Maiocco</span> <br> Accademia di Belle Arti di Cuneo <br> Tesi di laurea triennale in Nuove Tecnologie per l\'Arte');
            $('.section-desc-year').html('a.a 2015-2016');
            $('.section-desc').removeClass('negative').addClass('visible');
          }
          window['menuItemAnimation'] = false;
          $('#home .menu-item').removeClass('reset-cursor');
        });
      } else {
        window['menuItemAnimation'] = false;    
        $('#home .menu-item').removeClass('reset-cursor');    
      }
    }});
  }
}

function rnd(n) {
  return n.toFixed(2)
}