var $app = null;
//var stage = null;
var $circlesArray = [];
var $circlesDashedArray = [];
var $numberOfCircles = 4;
var $windowHeight = $(window).height();
var $windowWidth = $(window).width();
var $circleSettingsDefault = {x: 0.5 , y: 0.5 , radius: 250, radiusStep: 20};
var $circleSettings = $circleSettingsDefault;
var $circleSettingsNew = {x: [] , y: [] , radius: [], radiusStep: [] };
var $animationProcess, $animationFrames = null;
var $resizeClear;


$(window).resize(function (){
  clearTimeout($resizeClear);
  setTimeout(resizeFunc,250);
});

function resizeFunc() {
  if(!$app) return 0;
  //
  $app.stage.removeChildren();
  /*var prevWidth=$windowWidth;
  var prevHeight=$windowHeight;*/

  $windowHeight = $(window).height();
  $windowWidth = $(window).width();
  //this part resizes the canvas but keeps ratio the same
  $app.view.style.width = $windowWidth + "px";
  $app.view.style.height = $windowHeight + "px";
  $app.renderer.resize($windowWidth,$windowHeight);

  $app.ticker.remove(animation);
  initCircle();

}

$(window).on("load",function (){

  $app = new PIXI.Application( $windowWidth, $windowHeight, { transparent: true, antialias: true, autoResize:false });
  $("#canvasBox").append($app.view);

  initCircle();

  //Animation

});

function animation(delta) {
  for(var i = 0; i < $numberOfCircles; i++) {
    $circlesArray[i].clear();
    $circlesArray[i].lineStyle(2, "0xFFFFFF", 0.3);

    $circlesArray[i].x = $circlesArray[i].pivot.x= $windowWidth * $circleSettings.x;
    $circlesArray[i].y = $circlesArray[i].pivot.y= $windowHeight * $circleSettings.y;


    $circlesArray[i].arc($windowWidth * $circleSettings.x, $windowHeight * $circleSettings.y, $circleSettings.radius + $circleSettings.radiusStep * i, degreesToRadians(0), degreesToRadians($circlesArray[i].circleDegrees));
    //$circlesArray[i].endFill();
    $circlesArray[i].rotation -= $circlesArray[i].speed * delta;
    //console.log(radiansToDegrees($circlesArray[i].rotation));
  }

  initDashes();
}

function initDashes() {
  //return 0;
  for (var x = 0; x < $numberOfCircles; x++) {
    $circlesDashedArray[x].clear();
    var s = (Math.trunc((radiansToDegrees ($circlesArray[x].rotation) + $circlesArray[x].circleDegrees)/5))*5;
    //if(x==0)
      //console.log(radiansToDegrees ($circlesArray[x].rotation));
    for (var i = $circlesArray[x].circleDegrees; ((i)%360) != 0; i += 5) {
      $circlesDashedArray[x].lineStyle(1, "0xFFFFFF", 0.3);
      $circlesDashedArray[x].currentPath = null;
      $circlesDashedArray[x].arc($windowWidth * $circleSettings.x, $windowHeight * $circleSettings.y, $circleSettings.radius + $circleSettings.radiusStep * x, degreesToRadians(s-i), degreesToRadians(s-i + 0.3));

    }
  }
  /*for (var i = 0; i < 360; i += 5) {
    for (var x = 0; x < $numberOfCircles; x++) {

      $circlesDashedArray[x].lineStyle(1, "0xFFFFFF", 0.3);
      $circlesDashedArray[x].currentPath = null;
      $circlesDashedArray[x].arc($windowWidth * $circleSettings.x, $windowHeight * $circleSettings.y, $circleSettings.radius + $circleSettings.radiusStep * x, degreesToRadians(i), degreesToRadians(i + 0.3));
    }
  }*/
}

function initCircle() {
  //console.log($app);
  for (var i = 0; i < $numberOfCircles; i++) {
    $circlesArray[i] = new PIXI.Graphics();
    $circlesDashedArray[i] = new PIXI.Graphics();
    $circlesArray[i].speed = 0.01 * getRndInteger(5, 15) / 10;
    $circlesArray[i].circleDegrees =  getRndInteger(180, 270, 5);
    //console.log($circlesArray[i].circleDegrees);

    $app.stage.addChild($circlesArray[i]);
    $app.stage.addChild($circlesDashedArray[i]);
  }
  initDashes();
  $app.ticker.add(animation);
}



function setCircles($element) {

  clearInterval($animationProcess);
  $animationFrames = $defaultOutAnime * 1000 / $defaultOutAnimeMSFrame;

  $circleSettingsNew.x[0] = $circleSettings.x;
  $circleSettingsNew.x[1] = new EasingFunctions($animationFrames, ($element.data("crclx") - $circleSettings.x), $effect, $biezeProgress);
  $circleSettingsNew.y[0] = $circleSettings.y;
  $circleSettingsNew.y[1] = new EasingFunctions($animationFrames, ($element.data("crcly") - $circleSettings.y), $effect, $biezeProgress);
  $circleSettingsNew.radius[0] = $circleSettings.radius;
  $circleSettingsNew.radius[1] = new EasingFunctions($animationFrames, ($element.data("crclr") - $circleSettings.radius), $effect, $biezeProgress);
  $circleSettingsNew.radiusStep[0] = $circleSettings.radiusStep;
  $circleSettingsNew.radiusStep[1] = new EasingFunctions($animationFrames, ($element.data("crclrs") - $circleSettings.radiusStep), $effect, $biezeProgress);

  console.log($animationFrames);



  $animationProcess = setInterval(goToNewCords,$defaultOutAnimeMSFrame);
}


function goToNewCords() {
  if ($animationFrames <= 0) {
    clearInterval($animationProcess);
    /*$circleSettings.x = $circleSettingsNew.x[0];
    $circleSettings.y = $circleSettingsNew.y[0];
    $circleSettings.radius = $circleSettingsNew.radius[0];
    $circleSettings.radiusStep = $circleSettingsNew.radiusStep[0];
    initDashes();*/
    //showFollowedImg();
    return 0;
  }
  else{
    $circleSettings.x = $circleSettingsNew.x[0] + $circleSettingsNew.x[1].next();
    $circleSettings.y = $circleSettingsNew.y[0] + $circleSettingsNew.y[1].next();
    $circleSettings.radius = $circleSettingsNew.radius[0] + $circleSettingsNew.radius[1].next();
    $circleSettings.radiusStep = $circleSettingsNew.radiusStep[0] + $circleSettingsNew.radiusStep[1].next();
    initDashes();
    $animationFrames--;
  }
}

/*function showFollowedImg() {
  $
}*/


/*function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}*/
function getRndInteger (min, max, step) {
  if(!step) step = 1;
  return min + (step * Math.floor(Math.random()*(max-min)/step) );
}

function degreesToRadians (degrees) {
  return degrees * (Math.PI/180);
}
function radiansToDegrees (radians) {
  return radians * 180 / Math.PI;
}