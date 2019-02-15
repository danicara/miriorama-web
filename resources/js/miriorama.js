let MIRIORAMA = (function(){
  'use strict';

  let animations = {};
  let miriorama = {};

  /* HOME */
  miriorama.home = {};
  miriorama.home.show = function(callback) {  
    var tl = new TimelineMax();
    var tlr = new TimelineMax();

    tl.eventCallback('onComplete', callback);
    
    //$('.menu-desc-item.default').addClass('visible');
    tl.to('.menu-desc-item.default', 0.5, {opacity: 1, y: 0});

    tl.to('.menu-circle', 1, {opacity: 1, ease: Power4.easeIn});
    tl.staggerTo('.menu-item', 0.4, {opacity: 1, y: 0, ease: Power4.easeIn}, 0.08);

    //rotazione infinita menu
    tlr.to('.menu-circle', 80, {rotation: 360, ease:Linear.easeNone, repeat: -1}, '-=1');
  }
  miriorama.home.hide = function(callback) { 
    var tl = new TimelineMax();
    tl.eventCallback('onComplete', callback);

    $('.menu-desc-item').removeClass('visible');
    tl.to('.menu-desc-item.default', 0.5, {opacity: 0, y: 0});

    tl.staggerTo('.menu-item', 0.5, {opacity: 0, ease: Power4.easeIn}, 0.1);
    tl.to('.menu-circle', 0.8, {rotation: 0, opacity: 0, ease: Power4.easeIn});
  }
  miriorama.home.initialize = function() {};

  /* BRUNO MUNARI */
  miriorama.munari = {};
  miriorama.munari.initialize = function() { 
    var canvas = new fabric.Canvas('munariCanvas');
    canvas.selection = false;

    window.addEventListener('resize', resizeCanvas, false);
    var elements = [];
    resizeCanvas();

    function resizeCanvas(animate) {
      canvas.clear();
      canvas.setHeight($('#munari .container').outerHeight());
      canvas.setWidth($('#munari .container').width());

      var size = 100;
      var f = canvas.width / 100;
      var n = 11;
      var offset = (100/(n + 1)) * f;
      var height = 1 * f;
      var x = 0, y = 0;
      var angs = [[90,17], [-10,-24], [-5,28], [-4,-20], [0,25], [-10,-25], [5,30], [45,-24], [90,20], [-20,-20], [-5,27]];

      for (var r = 0; r < n; r++) { 
        y = y + offset;

        var rotation;
        for (var c = 0; c < n; c++) { 
          x = x + offset;
          rotation = ((angs[r][1] * c) + angs[r][0]);

          if (rotation < 0) {
            rotation = 360 - (rotation * -1);
          }

          var line = new fabric.Line([ x, y, x, (y + height)], {
            fill: '#000',
            stroke: '#000',
            strokeWidth: f/1.2,
            selectable: false,
            centeredRotation :true,
            originX: 'center',
            originY: 'center',
            angle: rotation,
            strokeLineCap: 'round',
            'data-angle': rotation
          });

          elements.push(line); 
          canvas.add(line);     
        }
        x = 0;
      }
    }

    canvas.on('mouse:move', function() {
      var pointer = canvas.getPointer(event.e);
      var posX = pointer.x;
      var posY = pointer.y;
      mouseMove(posX, posY);
    });

    canvas.on('mouse:down', function() {
      var pointer = canvas.getPointer(event.e);
      var posX = pointer.x;
      var posY = pointer.y;
      mouseMove(posX, posY);
    });

    canvas.on('mouse:up', function() {
      mouseOut();
    });

    $('.container').mouseout(function(e){
      mouseOut();
    });

    function mouseMove(x, y){
      for (var i = 0; i < elements.length; i++) {
        var line = elements[i];
        var center_x = line.getLeft()  + (line.getWidth()/2);
        var center_y = line.getTop()  + (line.getHeight()/2);
        var mouse_x = x;
        var mouse_y = y;

        var radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
        var degree = (radians * (180 / Math.PI) * -1); 

        line.angle = degree;
      }
      canvas.renderAll();
    }

    var globalID;
    function mouseOut(){
      for (var i = 0; i < elements.length; i++) {
        var line = elements[i];
        var origAngle = line['data-angle'];
        //console.log(origAngle);
        line.animate('angle', origAngle,  {
          duration: 1000,
          onComplete: cancelAnimationFrame(globalID),
          easing: fabric.util.ease.easeInOutQuart
      });
    }
    requestAnimationFrame(repeatOften);
    }

    function repeatOften() {
      canvas.renderAll();
      globalID = requestAnimationFrame(repeatOften);
    }
  }

  /* KARL GERSTNER */
  var gerstnerCountClick = 1;
  miriorama.gerstner = {};
  miriorama.gerstner.hide = function (callback) {
      for (var i = 0; i < 5; i++) {
        TweenMax.to('#gerstner .circle-' + (i+1), 1, {rotation: 0, force3D: true});
      }
      $('#gerstner .step').removeClass('visible');

      callback();
  }
  miriorama.gerstner.initialize = function() {
    var variations = {
      0: [   0,   0,   0,   0,   0],
      1: [   0,   4,   8,  15,  36],
      2: [  90,   4,   8,  15,  36],
      3: [ 180, -11, -23, -58,   0],
      4: [ 270, -27, -63,   0,   0],
      5: [   0, -45, -45, -45, -45],
      6: [   0, -60, -60, -60,   0],
      7: [   0,  90,  90,  90,   0],
      8: [   0, -90, -90, -90,   0],
      9: [   0, 180, 180, 180, 180],
    10: [   0, 180,  90,  45,   0],
    11: [   0, 360, 180,  90,  45],
    12: [   0,  45,  90, 180,   0],
    };

    $('#gerstner').click(function(){
      for (var i = 0; i < 5; i++) {
        TweenMax.to('#gerstner .circle-' + (i+1), 1, {rotation: variations[gerstnerCountClick][i], force3D: true, ease: Power2.easeInOut});
      }

      gerstnerCountClick += 1;

      if (gerstnerCountClick == 13) {
        gerstnerCountClick = 0;
      }
    });

    //Draggable.create('#gerstner .circle', {type: 'rotation', throwProps: true, throwResistance: 1});
  } 

  /* ANTONIO BARRESE */
  miriorama.barrese = {};
  miriorama.barrese.hide = function(callback) {
    var tl = new TimelineMax();
    tl.eventCallback('onComplete', callback);
    tl.to(animations['barrese-animation'], 1, {timeScale: 0});
  };
  miriorama.barrese.initialize = function() {
    var canvas = new fabric.Canvas('barreseCanvas');
    canvas.selection = false;
    canvas.renderOnAddRemove = false;

    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

    function resizeCanvas() {
      var $container = $('#barrese .container');
      canvas.clear();
      canvas.setHeight($container.height());
      canvas.setWidth($container.width());
      //canvas.backgroundColor = 'white';

      var f = canvas.width / 100;

      /*canvas.clipTo = function (ctx) {
        ctx.arc(f*100 / 2,f*100 / 2,f*90 / 2,0,2*Math.PI);
      };*/

      var r = 40 * f;
      var n = 48;
      var nCircle = 8;
      var width = 100 * f;
      var height = 100 * f;
      var angle = 0;
      var step;

      var group = new fabric.Group();
      group.setOptions({
        originX: 'center',
        originY: 'center',
        top: height/2,
        left: width/2,
        selectable: false,
        hasControls: false,
        width: width,
        height: height
      });

      for (var c = 0; c < nCircle; c++) { 
        step = (2*Math.PI) / n;

        for (var i = 0; i < n; i++) { 
            var x = width/2 + r * Math.cos(angle);
            var y = height/2 + r * Math.sin(angle);

            var circle = new fabric.Circle({
              radius: 2 * f, fill: 'black', left: x - width/2, top: y - width/2, selectable: false, originX: 'center',originY: 'center'
            });
            group.add(circle); 

            angle += step;
        }
        r -=  5 * f;
        n -= 6;
      }

      canvas.add(group); 
      canvas.renderAll();

      animations['barrese-animation'] = TweenMax.to('#barreseCanvas', 1, {rotation: 720, ease:Linear.easeNone, repeat: -1});
      animations['barrese-animation'].timeScale(0);

      /*canvas.on('mouse:down', function() {
        TweenLite.to(tween, 4, {timeScale: 1});
      });*/

      /*canvas.on('touch:drag', function(options) {
        var pointer = canvas.getPointer(options.e);
        var posY = pointer.y;



        var speedUp = Math.roundOneDecimal(((posY / canvas.height) -1 ) * -1);
                console.log(speedUp);
        if (speedUp >= 0) {
          TweenLite.to(tween, 1, {timeScale: speedUp});
        }
      });*/

      var start = false;
      canvas.on('mouse:down', function() {

        $('#barrese .step-1').toggleClass('visible');
        $('#barrese .step-2').toggleClass('visible');

        if (start) {
          start = false;
          TweenLite.to(animations['barrese-animation'], 8, {timeScale: 0});
        } else {
          start = true;
          TweenLite.to(animations['barrese-animation'], 8, {timeScale: 1});
        }
      });
    }
  }

  /* ENNIO CHIGGIO */
  var countClick = 1;
  miriorama.chiggio = { };
  miriorama.chiggio.initialize = function() {
    var $container = $('#chiggio .container');
    var positions = [[0,0,180,0],[0,90,180,-90],[-45,-135,315,-135]];
    
    loadCircle('1');
    loadCircle('2');
    loadCircle('3');
    loadCircle('4');

    window.addEventListener('resize', resize, false);
    resize();

    function resize() {
      var u =  $container.height()/44;
      var offsetSingle = u * 10;
      var size = u * 14;
      var x = $container.width()/2 - size/2;

      for (var i = 1; i <= 4; i++) { 
        var y = ((i-1) * offsetSingle);
        TweenMax.set('.chiggio' + i + ' svg', {width: size, height: size});
        TweenMax.set('.chiggio' + i, {width: size, height: size, y: y, x: x});
      }
    }

    function loadCircle(cssClass){
      var s = Snap('.chiggio' + cssClass + ' svg');
      
      var size = 100;
      var offset = ((100 - size) /2 );

      //maschera Left
      var mLeftRect = s.rect(0, 0, 50, 100).attr({fill: '#fff'});
      var mLeft = s.mask();
      mLeft.add(mLeftRect);

      var gLeft = s.group()
      gLeft.attr({mask: mLeft});

      //maschera Right
      var mRightRect = s.rect(50, 0, 100, 100).attr({fill: '#fff'});
      var mRight = s.mask();
      mRight.add(mRightRect);

      var gRight = s.group()
      gRight.attr({mask: mRight});

      for (var i = 1; i < 8; i++) { 
        var x = (100 - size);
        var y = x;
        var r = size / 2;

        var circleL = s.circle(50, 50, r).attr({
          fill: (i %2 == 1 ?  '#000' : '#fff')
        });
        gLeft.add(circleL);

        var circleR = s.circle(50, 50, r).attr({
          fill: (i %2 == 1 ?  '#fff' : '#000')
        });
        gRight.add(circleR);
        
        size = size - (100/7);
      }
    }

    Draggable.create('#chiggio .svg-wrapper', {type: 'rotation', throwProps: true, onClick: function(e){
        return false;
    }});
      
    $('#chiggio').on('mousedown touchstart', function(){
      $('#chiggio .svg-wrapper').each(function(i) {
        TweenMax.to($(this), '2', {rotation: positions[countClick][i], ease: Power4.easeInOut});
      });

      countClick += 1;
      if (countClick > 2) {
        countClick = 0;
      }
    });

    $('#chiggio .svg-wrapper').on('mousedown touchstart', function() {
      return false;
    });
  }

  /* GRAZIA VARISCO */
  miriorama.varisco = {};
  miriorama.varisco.hide = function(callback) { 
    var tl = new TimelineMax();
    tl.eventCallback('onComplete', callback);

    tl.to(animations['varisco-bottom'], 1, {timeScale: 0});
    tl.to(animations['varisco-top'], 1, {timeScale: 0}, '-=1');
  }
  miriorama.varisco.initialize = function() {
    var $container = $('#varisco .container');

    var canvas = new fabric.Canvas('variscoCanvasBottom');
    var canvasTop = new fabric.Canvas('variscoCanvasTop');
    canvas.selection = false;

    window.addEventListener('resize', resizeCanvas, false);
    var elements = [];
    resizeCanvas();

    function resizeCanvas() {

      //resetto i canvas
      canvas.clear();
      canvas.setHeight($container.height() * 1.5);
      canvas.setWidth($container.width() * 1.5);
      $('#variscoCanvasBottom').css({top: -$container.height()*0.25, left: -$container.width()*0.25});


      canvasTop.clear();
      canvasTop.setHeight($container.height() * 1.5);
      canvasTop.setWidth($container.width() * 1.5);
      $('#variscoCanvasTop').css({top: -$container.height()*0.25, left: -$container.width()*0.25});

      //ritaglio i canvas a forma di cerchio
      /*var ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(canvas.width / 2,canvas.width / 2,canvas.width / 2,0,2*Math.PI);
      ctx.closePath();
      ctx.stroke();
      ctx.clip();

      var ctxTop = canvasTop.getContext('2d');
      ctxTop.beginPath();
      ctxTop.arc(canvasTop.width / 2,canvasTop.width / 2,canvasTop.width / 2,0,2*Math.PI);
      ctxTop.closePath();
      ctxTop.stroke();
      ctxTop.clip();*/

      //aggiungo il background colorato al primo canvas
      var bkg = new fabric.Rect({
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height
      });

      bkg.setGradient('fill', {
        type: 'radial',
        x1: bkg.width / 2,
        y1: bkg.width / 2,
        x2: bkg.width / 2,
        y2: bkg.width / 2,
        r1: 0,
        r2: bkg.width / 2,
        colorStops: {
          0: '#092EDB',
          0.25: '#092EDB',
          0.55: '#48ABFB',
          0.75: '#092EDB',
          1: '#092EDB'
        }
      });
      canvas.add(bkg);
    
      var f = canvas.width / 100;
      var origSize = (100 * f);
      var size = (100 * f) / 15 ;
      var n = 20;

      var group = new fabric.Group();
      group.setOptions({
        originX: 'center',
        originY: 'center',
        top: origSize/2,
        left: origSize/2,
        selectable: false,
        hasControls: false,
        width: origSize,
        height: origSize,
        opacity: 1
      });

      var group2 = new fabric.Group();
      group2.setOptions({
        originX: 'center',
        originY: 'center',
        top: origSize/2,
        left: origSize/2,
        selectable: false,
        hasControls: false,
        width: origSize,
        height: origSize,
        opacity: 1,
        angle: 45
      });

      var wh = size;
      var size = f * 4;
      var deg = 0;
      var degFirstValue = deg;
      var degDef = 0;
      var rad, factor, offset;
      for (var i = 1; i <= n; i++) {
        rad =  toRadiants(deg);
        factor = 1 / (Math.sin(rad) + Math.cos(rad));
        var offset = (origSize - size) / 2;

        var rect = new fabric.Rect({
          width: size, 
          height: size, 
          stroke: '#000', 
          strokeWidth: 1.4 * f,
          fill: (i == 1 ? '#000' : 'transparent'), 
          angle: deg, 
          left: 0, 
          top: 0,
          originX: 'center',
          originY: 'center'
        });

        group.add(rect);  
        group2.add(rect);

        size = size + f * 5;
        deg += 5 - (i * 0.2);
      }

      function toRadiants(deg) {
        return deg * Math.PI / 180;
      }

      canvas.add(group);
      canvasTop.add(group2);
      canvas.renderAll();

    animations['varisco-bottom'] = TweenMax.to('#variscoCanvasBottom', 8, {rotation: 360, ease:Linear.easeNone, repeat: -1});
    animations['varisco-bottom'].timeScale(0);
    animations['varisco-top'] = TweenMax.to('#variscoCanvasTop', 8, {rotation: -360, ease:Linear.easeNone, repeat: -1});
    animations['varisco-top'].timeScale(0);

    var start = false;
    canvasTop.on('mouse:up', function() {
      $('#varisco .step-1').toggleClass('visible');
      $('#varisco .step-2').toggleClass('visible');

      if (start) {
        start = false;
        TweenLite.to(animations['varisco-bottom'], 4, {timeScale: 0});
        TweenLite.to(animations['varisco-top'], 4, {timeScale: 0});
      } else {
        start = true;
        TweenLite.to(animations['varisco-bottom'], 4, {timeScale: 1});
        TweenLite.to(animations['varisco-top'], 4, {timeScale: 1});
      }
    })

    /*var $el = $('#varisco .upper-canvas').closest('.canvas-container');

    TweenLite.set($el, {transformOrigin:'33% 33%'})
    var myDrag = Draggable.create($el, {type: 'rotation', throwProps: true, onDrag: onDrag})[0];
    function onDrag() {
      TweenLite.to('#variscoCanvasBottom', 0, {rotation: -this.rotation});
    }*/
  }
  }

  /* MARINA APOLLONIO */
  miriorama.apollonio = {};
  miriorama.apollonio.initialize = function(){
    var size = 100;
    var s = Snap('#apollonio svg');
    var x = 0, y = 0;
    var r = 0;

    for (var i = 0; i < 36; i++) { 
      var offset = ((100 - size) /2 );

      var min = offset - 100/36;
      var max = offset + 100/36;
      var sinArg = ((2 * Math.PI * i) / 36);
      var ooo = (max - min) * Math.sin(sinArg); 

      var left =  offset - ooo * 1.1;

      x = left + (size/2);
      y = 50;
      r = size/2

      

      var circle = s.circle(x, y, r).attr({
        fill: (i %2 == 1 ?  '#000' : '#fff'),
      });
      size = size - (100/36); 
    }

    Draggable.create('#apollonio .svg-container', {type: 'rotation', throwProps: true, throwResistance: 1});
    /*
    $('#apollonio').click(function() {
      var rotation = 365 * 5 ;
      $('#apollonioSvg').css({'transform' : 'rotate('+ rotation +'deg)'});
    });*/
  }


  /* ALBERTO BIASI */
  miriorama.biasi = {};
  miriorama.biasi.initialize = function() { 
    var canvas = new fabric.Canvas('biasiCanvasBottom');
    var canvasTop = new fabric.Canvas('biasiCanvasTop');
    canvas.selection = false;
    canvasTop.selection = false;

    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

    function resizeCanvas() {
      var $container = $('#biasi .container');
      canvas.clear();
      canvas.setHeight($container.height());
      canvas.setWidth($container.width());
      canvas.renderOnAddRemove = false;

      canvasTop.clear();
      canvasTop.setHeight($container.height() * 1.5);
      canvasTop.setWidth($container.width() * 1.5);
      canvasTop.renderOnAddRemove = false;

      $('#biasiCanvasTop').css({top: -$container.height()*0.25, left: -$container.width()*0.25});

      var fW = canvas.width / 100;
      var fH = canvas.height / 100;
      
      var width = 100 * fW;
      var height = 100 * fH;

      var circleG = new fabric.Group();
      circleG.setOptions({
        originX: 'center',
        originY: 'center',
        top: height/2,
        left: width * 1/8,
        selectable: false,
        hasControls: false,
        width: width,
        height: height,
        opacity: 1,
        clipTo: function (ctx) {
          ctx.rect(0, 0, width/4, height);
        }
      });
      var circleG2 = fabric.util.object.clone(circleG);
      circleG2.setOptions({
        clipTo: function (ctx) {
          ctx.rect(width/4, 0, width/4, height);
        },
        left: width * 3/8
      });
      var circleG3 = fabric.util.object.clone(circleG);
      circleG3.setOptions({
        clipTo: function (ctx) {
          ctx.rect(width/2, 0, width/4, height);
        },
        left: width * 5/8
      });
      var circleG4 = fabric.util.object.clone(circleG);
      circleG4.setOptions({
        clipTo: function (ctx) {
          ctx.rect(width * 3/4, 0, width/4, height);
        },
        left: width * 7/8
      });

      var r, s;
      for (var i = 1; i <= 25; i++) {
        r = Math.log((i*0.15)+1) * 18 * fW;
        s = 1.4/Math.log((i)+1) * fW;

        var circle = new fabric.Circle({
          radius: r, 
          stroke: '#000', 
          strokeWidth: s,
          fill: 'transparent', 
          left: 0, 
          top: 0,
          originX: 'center',
          originY: 'center'
        });

        if (i <= 2) {
          circle.fill = '#000';
        }
        circleG.add(circle);        
      }

      var linesG = new fabric.Group();
      linesG.setOptions({
        originX: 'left',
        originY: 'top',
        top: 0,
        left: 0,
        selectable: false,
        hasControls: false,
        width: width,
        height: height,
        opacity: 1
      });

      var n = 150;
      var x = 0;
      for (var i = 1; i <= n; i++) {
        var line = new fabric.Line([-width/2, x-width/2, width, x-width/2], {
          stroke: '#444', 
          strokeWidth: fH * 1.2
        });

        linesG.add(line);
        x = x + fH * 2;
      }

      canvas.add(circleG);
      canvas.add(circleG2);
      canvas.add(circleG3);
      canvas.add(circleG4);

      canvasTop.add(linesG);

      canvas.renderAll();
      canvasTop.renderAll();

      canvasTop.on('mouse:move', function() {
        var pointer = canvas.getPointer(event.e);
        var posX = pointer.x;
        var posY = pointer.y;
        move(posX, posY);
      });

      function move(x, y) {
        //x = x * 200 / $container.width() ;
        y = y * 50 / $container.height();
        TweenMax.to('#biasiCanvasTop', 0.5, {y: y});
      }

      //TweenMax.to('#biasiCanvasTop', 2, {y: 100, ease: Power4.easeInOut, repeat: -1, yoyo: true});
    }
  }

  return miriorama;
})();