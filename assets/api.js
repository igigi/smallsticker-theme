$.fn.api.settings.api = {
  'create cart' : 'http://localhost:3000/carts',
  'show cart'   : 'http://localhost:3000/carts/{cart_id}',
  'add item to cart' : 'http://localhost:3000/carts/{cart_id}/items'
};
var cartId = sessionStorage.getItem('cart_id');
$(document).ready(function() {
  // 调用礼盒数量接口
  if (cartId) {
    $.get('http://localhost:3000/carts/' + cartId, function(data) {
      $('#gift-counter').text(data.data.attributes.items_count);
    });
  } else {
    $.post('http://localhost:3000/carts', function(data) {
      sessionStorage.setItem('cart_id', data.data.id);
      cartId = sessionStorage.getItem('cart_id');
      $('#gift-counter').text(data.data.attributes.items_count);
    });
  };
  // 调用添加到礼盒接口
  var itemCounter = $('#gift-counter').text();
  $('.smallsticker-add-item').api({
    action: 'add item to cart',
    method: 'POST',
    urlData: {
      cart_id: cartId
    },
    beforeSend: function(settings) {
      settings.data.product_id = $(this).data('item-id');
      return settings;
    },
    onSuccess: function(response) {
      $('#gift-counter').text(Number($('#gift-counter').text()) + 1);
    }
  });
});
