$(document)
  .ready(function() {

    // fix main menu to page on passing
    $('.main.menu').visibility({
      type: 'fixed'
    });

    $('.wechat-box').click(function(){
      $('.mini.wechat-box.modal').modal('show');
    });

    $('.gift-box').click(function(){
      $('.fullscreen.modal').modal('show');
    });

    $('.menu .item')
      .tab()
    ;

    $('.steps .step')
      .tab()
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
