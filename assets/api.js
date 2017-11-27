const apiAddress = 'http://47.93.239.217'
$.fn.api.settings.api = {
  'create cart' : apiAddress + '/carts',
  'show cart'   : apiAddress + '/carts/{cart_id}',
  'add item to cart' : apiAddress + '/carts/{cart_id}/items',
  'submit order info' : apiAddress + '/carts/{cart_id}/orders',
  'get alipay qrcode' : apiAddress + '/carts/{cart_id}/orders/alipay',
  'get wxpay qrcode' : apiAddress + '/carts/{cart_id}/orders/wxpay',
};
var cartId = sessionStorage.getItem('cart_id');
function getGiftCounter(cartId) {
  // 调用礼盒数量接口
  if (cartId) {
    $.get(apiAddress + '/carts/' + cartId, function(data) {
      $('#gift-counter').text(data.data.attributes.items_count);
    });
  } else {
    $.post(apiAddress + '/carts', function(data) {
      sessionStorage.setItem('cart_id', data.data.id);
      cartId = sessionStorage.getItem('cart_id');
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
      $.getJSON(apiAddress + '/carts/' + cartId + '/items', function(data) {
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
                  url: apiAddress + "/carts/" + cartId + '/items/' + item.id,
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
                  url: apiAddress + "/carts/" + cartId + '/items/' + item.id,
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
                url: apiAddress + "/carts/" + cartId + '/items/' + item.id,
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
    // 写二维码图片到网页上
    function writeQrcode(msg) {
      var typeNumber = 4;
      var errorCorrectionLevel = 'L';
      var qr = qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(msg);
      qr.make();
      document.getElementById('placeHolder').innerHTML = qr.createImgTag(4);
    };
    // 获取订单支付状态
    var nIntervId;
    function getTradeStatus(cart_id) {
      $.ajax({
          url: apiAddress + "/carts/" + cart_id + "/orders/order_status",
          type: "GET",
          dataType:"json",
          data: "",
          success: function (data) {
            if (data.trade_status == 1) {
              clearInterval(nIntervId);
              $('a[data-tab = "3"]').removeClass('active');
              $('div[data-tab = "3"]').removeClass('active');
              $('a[data-tab = "4"]').addClass('active');
              $('a[data-tab = "4"]').removeClass('disabled');
              $('div[data-tab = "4"]').addClass('active');
              $('a[data-tab = "3"]').addClass('disabled');
              $('a[data-tab = "1"]').addClass('disabled');
              $('a[data-tab = "1"]').removeClass('active');
              $('a[data-tab = "2"]').addClass('disabled');
              $('a[data-tab = "2"]').removeClass('active');
              document.getElementById('placeHolder').innerHTML = "";
            } else if (data.trade_status == 2) {
              alert("订单异常，请联系客服");
            }
          },
          error: function () {
             alert("请求订单状态出错");
          }
      });
  	}

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
              $('a[data-tab = "3"]').removeClass('disabled');
              $('div[data-tab = "3"]').addClass('active');
            });
            $('.gift-box-3-backward').click(function() {
              $('a[data-tab = "3"]').removeClass('active');
              $('div[data-tab = "3"]').removeClass('active');
              $('a[data-tab = "2"]').addClass('active');
              $('div[data-tab = "2"]').addClass('active');
              document.getElementById('placeHolder').innerHTML = '';
            });
            // 提交配送信息
            $('.logistics')
              .form({
                inline : true,
                on     : 'blur',
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
              $( ".logistics" ).on( "submit", function( event ) {
                event.preventDefault();
              })
              .api({
                action: 'submit order info',
                method: 'POST',
                serializeForm: true,
                urlData: {
                  cart_id: cartId
                },
                onSuccess : function() {
                  $('.gift-box-2-forward').removeClass('disabled');
                  $('a[data-tab = "2"]').removeClass('active');
                  $('div[data-tab = "2"]').removeClass('active');
                  $('a[data-tab = "3"]').addClass('active');
                  $('a[data-tab = "3"]').removeClass('disabled');
                  $('div[data-tab = "3"]').addClass('active');
                  $('a[data-tab = "2"]').addClass('disabled');
                  $('a[data-tab = "1"]').addClass('disabled');
                }
              });

              $('.alipay')
              .api({
                action: 'get alipay qrcode',
                method: 'POST',
                urlData: {
                  cart_id: cartId
                },
                onSuccess : function(response) {
                  var msg = response.qrcode_url;
                  document.getElementById('placeHolder').innerHTML = '<iframe src=' + msg + ' title="二维码" frameborder="0" scrolling="no" width="150" height="150"></iframe>'
                  nIntervId = setInterval(getTradeStatus, 3000, cartId);
                }
              });
              $('.wxpay')
              .api({
                action: 'get wxpay qrcode',
                method: 'POST',
                urlData: {
                  cart_id: cartId
                },
                onSuccess : function(response) {
                  var msg = response.qrcode_url;
                  writeQrcode(msg);
                  nIntervId = setInterval(getTradeStatus, 3000, cartId);
                }
              });
          },
          onHidden : function() {
            $('tbody tr').remove();
            getGiftCounter(cartId);
          }
        }).modal('show');
      };
    });
});
