
$(document)
  .ready(function() {
    // fix main menu to page on passing


    $('.wechat-box').click(function(){
      $('.mini.wechat-box.modal').modal('show');
    });

    $('.menu .item')
      .tab()
    ;

    $('.steps .step')
      .tab()
    ;

    $('.ui.radio.checkbox')
      .checkbox()
    ;

    var image = '微信扫码关注'
    function writeQrcodeImage(message) {
      var typeNumber = 0;
      var errorCorrectionLevel = 'L';
      var qr = qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(message);
      qr.make();
      image = image + qr.createImgTag(4);
    };
    writeQrcodeImage("http://weixin.qq.com/r/CjlPV63EivD1rek092wY");
    $('.wechat-attention')
      .popup({
        on : "click",
        position : "top center",
        html: image
      })
    ;
    // lazy load images
    $('.image').visibility({
      type: 'image',
      transition: 'vertical flip in',
      duration: 500
    });
    $('.message .close')
      .on('click', function() {
        $(this)
          .closest('.message')
          .transition('fade')
        ;
      })
    ;
    // show dropdown on hover
    $('.main.menu  .ui.dropdown').dropdown({
      on: 'hover'
    });

    $("#nav").addClass("js").before('<i class="big sidebar icon " id="menu"></i><a class="item right floated gift-box" id="gift-box"><i class="cart red large icon"></i>礼盒<div class="ui left pointing teal label" id="mobile-gift-counter">等我一下</div></a>');
  	$("#menu").click(function(){
      $(".gift-box").toggle();
  		$("#nav").toggle();
  	});
  	$(window).resize(function(){
  		if(window.innerWidth > 768) {
  			$("#nav").removeAttr("style");
  		}
  	});
  })
;
