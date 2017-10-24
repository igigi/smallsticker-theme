$.fn.api.settings.api = {
  'show cart' : 'http://localhost:3000/carts/{id}',
  'create cart'   : 'http://localhost:3000/cart',
};
$(document).api({
    action: 'show cart',
    urlData: {
      id: 1
    }
  });

$(document).ready(function() {
    // fix main menu to page on passing
    $('.main.menu').visibility({
      type: 'fixed'
    });

    $('.overlay').visibility({
      type: 'fixed',
      offset: 80
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
