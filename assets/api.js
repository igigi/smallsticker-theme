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
      cartId = sessionStorage.setItem('cart_id');
      $('#gift-counter').text(data.data.attributes.items_count);
    });
  };
  // 调用添加到礼盒接口
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
      $('#gift-counter').transition('flash').text(Number($('#gift-counter').text()) + 1);
    }
  }).state({
      onActivate: function() {
        $(this).state('flash text');
      },
      text: {
        active     : '<i class="plus icon"></i>放入礼盒',
        flash      : '<i class="archive icon"></i>已放入礼盒'
      }
    });
    // 礼盒清单接口
    $('.gift-box').click(function(){
      var giftCounter = $('#gift-counter').text();
      if (giftCounter == 0) {
        $('.standart.modal').modal('show');
      } else if (giftCounter == '等我一下') {
        $('.waite.modal').modal('show');
      } else {
        $('.fullscreen.modal').modal({
          onShow :  function() {
            $.getJSON('http://localhost:3000/carts/' + cartId + '/items', function(data) {
              if (data.data.length == 0) {
              } else {
                $.each(data.data, function(i, item) {
                  $('tbody').append('<tr><td><button class="ui icon button"><i class="remove icon"></i></button></td>' +
                  '<td>' + item.attributes.product_name + '</td>' +
                  '<td>' + item.attributes.product_price + '</td>' +
                  '<td>' + item.attributes.quantity + '</td>' +
                  '<td>' + item.attributes.total_price + '</td>' +
                  '</tr>');
                });
                $('#total-price').text(data.meta.cart_total_price);
              }
            });
          },
          onHidden : function() {
            $('tbody tr').remove();
          }
        }).modal('show');
      };
    });
});
