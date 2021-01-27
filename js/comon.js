var $defaultOutAnimeMSFrame = 16;
var $videoSlider;
var lastY,lastX, $scroll , $scrollCount;

$(window).on("load",function (){

  //##############################################
  //Video Slider Settings
  //##############################################

  //Video Slider
  $videoSlider = $("#mainBody #videoSlider").slick({
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    pauseOnHover: false,
    autoplay: false,
    /*autoplaySpeed: 5000,*/
    arrows: false
  });

  $videoSlider.find(".videobg").eq(0).get(0).play();

  $videoSlider.on("beforeChange",function(event,  slick, currentSlide, nextSlid){
    $videoSlider.find(".videobg").eq(nextSlid)[0].play();
  });
  $videoSlider.on("afterChange", function(event, slick, currentSlide ) {

    $videoSlider.find(".videobg:not(:eq("+currentSlide+"))").each(function () {
      $(this)[0].pause();
    })
  });

  //##############################################
  //Menu Settings
  //##############################################

  $("#menuBox a").click(function (e){
    e.preventDefault();

    var $ctid= $(this).data("ctid");
    goToElement($ctid);
  });



  // ##############################################
  //Scroll
  //##############################################
  $(document).bind('touchstart', function(e) {
    lastY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
    //lastX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
  });
  $(document).bind('wheel touchmove', function(event){

    if($scrollCount) return 0;
    $scrollCount = 1;

    clearTimeout($scroll);
    $scroll = setTimeout(function(){$scrollCount=0;}, 1000);

    var o = event.originalEvent;
    var delta = o && (o.wheelDelta || (o.detail && -o.detail));




    var touchMove = 0;
    //for touch move
    if(delta == 0){
      touchMove = 1;
      var currentY = event.originalEvent.touches ? event.originalEvent.touches[0].pageY : event.pageY;
      if (Math.abs(currentY-lastY) < 20) { delta = 0; return 0; }
      else if (currentY > lastY) {
        delta = 1;
      } else {
        delta = -1;
      }
    }
    //console.log("delta");
    if(delta>0){
      goToElement("prev");
      return 0;
    }
    if(delta<0){
      goToElement("next");
    }
  });

  //##############################################
  //Content Slider Settings
  //This is main Setting
  //##############################################

  //$("#contentSlider .content.active").find(".anime:not(.subSlide)").addClass("active");

  $(".followCircle").each(function () {
    var $parent= $(this).parents(".content").eq(0);
    $(this).css({
      top: ($parent.data("crcly")*100)+"%",
      left: ($parent.data("crclx")*100)+"%",
    })
  })


  $(".anime").each(function () {
    if($(this).attr("trdl")){
      $(this).css("transition-delay",$(this).attr("trdl"))
    }
  })
  goToElement(0);

});

//Functions
function goToElement($ctid,$subid) {
  var $element;
  if(!$subid) $subid =0;
  if($.isNumeric($ctid))
  {

    /*console.log($("#contentSlider .content[data-id="+$ctid+"]").length);*/
    $element = $("#contentSlider .content[data-id="+$ctid+"]").eq($subid);
  }else{
    if($ctid == "next"){

      //Check if has Sub Slides
      if($("#contentSlider .content.active").find(".subSlide:not(.active)").length){
        $("#contentSlider .content.active").find(".subSlide:not(.active)").addClass("active");
        $("#menuBox *:not(.scrollIcon)").removeClass("hidden");
        return 0;
      }

      if($("#contentSlider .content.active").next(".content").length)
        $element = $("#contentSlider .content.active").next(".content");
      else
        $element = $("#contentSlider .content").eq(0);
    }else{
      if($("#contentSlider .content.active").prev(".content").length)
        $element = $("#contentSlider .content.active").prev(".content");
      else
        $element = $("#contentSlider .content").filter(":last");
    }
  }
  //console.log($element.html());
  $("#contentSlider .content, #contentSlider .anime").removeClass("active out");
  $element.addClass("active");
  $anime=$element.find(".anime:not(.subSlide)");
  $anime.addClass("active");

  var $id = $element.data("id");
  $("#menuBox .dots").html("");
  if($("#contentSlider .content[data-id="+$id+"]").length>1){
    for(var i=0; i < $("#contentSlider .content[data-id="+$id+"]").length; i++){
      var $activeDot="";
      if($("#contentSlider .content[data-id="+$id+"]").eq(i).hasClass("active"))
        $activeDot="class='active'"
      $("#menuBox .dots").append("<span "+$activeDot+" onclick='goToElement("+$id+","+i+")'></span>");
    }
  }

  $("#menuBox").attr("active-page",$id);

  //Hide Menu if 0
  if($id == 0){
    $("#menuBox *:not(.scrollIcon)").addClass("hidden");
    $("#menuBox .nextButton").removeClass("dnone");
  }else{
    $("#menuBox *:not(.scrollIcon)").removeClass("hidden");
    $("#menuBox .nextButton").addClass("dnone");
  }

  //Video
  if($videoSlider.slick("slickCurrentSlide") != $element.attr("video")){
    $videoSlider.slick("slickGoTo",$element.attr("video"));
  }

  //Menu
  $("#menuBox a, #menuBox nav").removeClass("active");
  $parent = $("#menuBox a[data-ctid="+$element.data("id")+"]").addClass("active").parents("nav").addClass("active");

  $("#menuBox").removeClass("navLeft navRight");
  if($parent.hasClass("navLeft")){
    $("#menuBox").addClass("navLeft");
  }else if($parent.hasClass("navRight")){
    $("#menuBox").addClass("navRight");
  }

  //Circles
  setCircles($element);
}
