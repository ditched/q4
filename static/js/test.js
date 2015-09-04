(function($) {
  $(function() {
    var userMod = (function() {
      var methods = {};

      user.login = function(email, password) {
        /* ...*/
        $.ajax({
          type: 'POST',
          url: 'api.php',
          data: {
            csrf_token: $('meta[name="csrf-token"]').attr('content'),
            request: 'user.login',
            email: email, 
            password: password
          },
          success: function(res) {
            console.log(res);
          }
        });
      };

      return methods;
    })();
  });
})(jQuery);