$.fn.api.settings.api = {
  'create cart' : 'http://localhost:3000/carts',
  'show cart'   : 'http://localhost:3000/carts/{cart_id}',
  'add item to cart' : 'http://localhost:3000/carts/{cart_id}/items',
  'submit order info' : 'http://localhost:3000/orders'
};
var cartId = sessionStorage.getItem('cart_id');
function getGiftCounter(cartId) {
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
};
$(document).ready(function() {
  getGiftCounter(cartId);
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
    function giftBoxModify () {
      $.getJSON('http://localhost:3000/carts/' + cartId + '/items', function(data) {
        if (data.data.length == 0) {
        } else {
          $.each(data.data, function(i, item) {
            $('tbody').append('<tr '  + 'id=' + item.id + '><td><button class="circular ui icon button remove-item"' + 'id=' + item.id + '><i class="remove icon"></i></button></td>' +
            '<td>' + item.attributes.product_name + '</td>' +
            '<td ' + 'id=price-' + item.id + '>' + item.attributes.product_price + '</td>' +
            '<td>' + '<button class="circular ui icon button plus-item"' + 'id=' + item.id + '><i class="icon plus"></i></button>' +
            '<span '+ 'id=quantity-' + item.id + '>' + item.attributes.quantity + '</span>' +
            '<button class="circular ui icon button minus-item"' + 'id=' + item.id + '><i class="icon minus"></i></button>' + '</td>' +
            '<td ' + 'id=total-price-' + item.id + '>'  + item.attributes.total_price + '</td>' +
            '</tr>');
            var price = Number($('#price-' + item.id).text())

            $('#' + item.id + '.plus-item').click(function() {
              var quantity = Number($('#quantity-' + item.id).text()) + 1
              var totalPrice = Number($('#total-price-' + item.id).text())
              var allTotalPrice= Number($('#total-price').text());
              if (quantity > 1) {
                $.ajax({
                  method: "PUT",
                  url: "http://localhost:3000/carts/" + cartId + '/items/' + item.id,
                  data: { quantity: quantity }
                })
                  .done(function() {
                    $('#quantity-' + item.id).text(quantity);
                    $('#total-price-' + item.id).text(totalPrice + price);
                    $('#total-price').text(allTotalPrice + price);
                  });
                };
            });

            $('#' + item.id + '.minus-item').click(function() {
              var quantity = Number($('#quantity-' + item.id).text()) - 1
              var totalPrice = Number($('#total-price-' + item.id).text())
              var allTotalPrice= Number($('#total-price').text());
              if (quantity > 0) {
                $.ajax({
                  method: "PUT",
                  url: "http://localhost:3000/carts/" + cartId + '/items/' + item.id,
                  data: { quantity: quantity }
                })
                  .done(function() {
                    $('#quantity-' + item.id).text(quantity);
                    $('#total-price-' + item.id).text(totalPrice - price);
                    $('#total-price').text(allTotalPrice - price);
                  });
                };
            });

            $('#' + item.id +'.remove-item').click(function() {
              var totalPrice = Number($('#total-price-' + item.id).text())
              var allTotalPrice= Number($('#total-price').text());
              $.ajax({
                method: "DELETE",
                url: "http://localhost:3000/carts/" + cartId + '/items/' + item.id,
              })
                .done(function() {
                  $('tr#' + item.id).remove();
                  if (allTotalPrice == totalPrice) {
                    $('.standart.modal').modal('show');
                    getGiftCounter(cartId);
                  } else {
                    $('#total-price').text(allTotalPrice - totalPrice);
                  }
                })
            });

          });
          $('#total-price').text(data.meta.cart_total_price);
        }
      });
    };
    $('.gift-box').click(function(){
      var giftCounter = $('#gift-counter').text();
      if (giftCounter == 0) {
        $('.standart.modal').modal('show');
      } else if (giftCounter == '等我一下') {
        $('.waite.modal').modal('show');
      } else {
        $('.fullscreen.modal').modal({
          onShow :  function() {
            giftBoxModify();
          },
          onVisible : function() {
            $('.gift-box-1').click(function() {
              $('a[data-tab = "1"]').removeClass('active');
              $('div[data-tab = "1"]').removeClass('active');
              $('a[data-tab = "2"]').addClass('active');
              $('div[data-tab = "2"]').addClass('active');
            });
            $('.gift-box-2-backward').click(function() {
              $('a[data-tab = "2"]').removeClass('active');
              $('div[data-tab = "2"]').removeClass('active');
              $('a[data-tab = "1"]').addClass('active');
              $('div[data-tab = "1"]').addClass('active');
            });
            $('.gift-box-2-forward').click(function() {
              $('a[data-tab = "2"]').removeClass('active');
              $('div[data-tab = "2"]').removeClass('active');
              $('a[data-tab = "3"]').addClass('active');
              $('div[data-tab = "3"]').addClass('active');
            });
            $('.gift-box-3-backward').click(function() {
              $('a[data-tab = "3"]').removeClass('active');
              $('div[data-tab = "3"]').removeClass('active');
              $('a[data-tab = "2"]').addClass('active');
              $('div[data-tab = "2"]').addClass('active');
            });
            $('.gift-box-3-forward').click(function() {
              $('a[data-tab = "3"]').removeClass('active');
              $('div[data-tab = "3"]').removeClass('active');
              $('a[data-tab = "4"]').addClass('active');
              $('div[data-tab = "4"]').addClass('active');
              $('a[data-tab = "3"]').addClass('disabled');
            });
          },
          onHidden : function() {
            $('tbody tr').remove();
            getGiftCounter(cartId);
          }
        }).modal('show');
      };
    });
    // 提交配送信息
    $('.ui.form')
      .form({
        fields: {
          name: {
            identifier: 'name',
            rules: [
              {
                type   : 'empty',
                prompt : '请填写姓名'
              }
            ]
          },
          phone: {
            identifier: 'phone',
            rules: [
              {
                type   : 'empty',
                prompt : '请填写联系电话'
              }
            ]
          },
          address: {
            identifier: 'address',
            rules: [
              {
                type   : 'empty',
                prompt : '请填写完整地址'
              }
            ]
          }
        }
      });
      if (false) {
        $('.gift-box-2-forward').removeClass('disabled');
        $('form .gift-box-2-forward')
          .api({
            action: 'submit order info',
            method: 'POST',
            serializeForm: true
          });
      }


});
