function writeQrcode(msg) {
  var typeNumber = 4;
  var errorCorrectionLevel = 'L';
  var qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(msg);
  qr.make();
  qr.createImgTag(4);
};
$(document)
  .ready(function() {

    // fix main menu to page on passing
    $('.main.menu').visibility({
      type: 'fixed'
    });

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
    $('.popup-wechat')
      .popup({
        on    : 'click',
        html : "<div class='header'>扫码关注小贴画</div>" + writeQrcode("aaa"),
        position : "top center"
      })
    ;
    // lazy load images
    $('.image').visibility({
      type: 'image',
      transition: 'vertical flip in',
      duration: 500
    });

    // show dropdown on hover
    $('.main.menu  .ui.dropdown').dropdown({
      on: 'hover'
    });
  })
;
