(function($) {
  $(function() {
    var chatCore = (function() {
      if($('meta[name="logged-in"]').attr('content') == false) return;
      var chat = {};
      var 
        _socket,
        _username;

      var options = {};
      options['app_socket_host'] = '127.0.0.1:3000';


      chat.handshake = function() {
        _socket = io(options.app_socket_host);
        _username = getUsername();
      };

      function callUsername() {
        return $.ajax({
          url: 'api.php',
          type: 'POST',
          data: {
            csrf_token: $('meta[name="csrf-token"]').attr('content'),
            request: 'user.username'
          }
        });
      };

      function getUsername() {
        var call = callUsername();
        call.success(function(res) {
          return res.response;
        });
      };

      return chat;
    })();

    var userCore = (function() {
      var user = {};

      user.init = function() {
        register();
        login();
        logout();
      }

      function register() {
        var form = $('#r-form');
        form.on('submit', function(e) {
          e.preventDefault();
          var 
            email = form.find('#email').val(),
            username = form.find('#usrename').val(),
            password = form.find('#password').val(),
            c_password = form.find('#c-password').val();

          if(!isValidStr([username])) {
            form.find('#error').show().html('Please enter a valid username');
            return;
          }
          if(!isValidEmail(email)) {
            form.find('#error').show().html('Please enter a valid username');
            return;
          }
          if(!(email || username || password || c_password)) {
            form.find('#error').show().html('Please fill out all of the form fields');
            return;
          }
          $.ajax({
            url: 'api.php',
            type: 'POST',
            data: {
              csrf_token: $('meta[name="csrf-token"]').attr('content'),
              request: 'user.register',
              email: email,
              username: username,
              passsword: password,
              c_password: password
            },
            success: function(res) {
              if(!res.error) {
                form.find('#error').show().text('An error occured');
                return;
              }
              if($.trim(res.response) == 'Registered') {
                window.location.replace('index.php');
              }
            }
          });
        });
      };

      function login() {
        var form = $('#l-form');
        form.on('submit', function(e) {
          e.preventDefault();
          var
            username = form.find('#username').val(),
            password = form.find('#password').val();

          if(!isValidStr[username, password]) {
            form.find('#error').show().text('Plaase enter your username/password');
            return;
          }
          $.ajax({
            url: 'api.php',
            type: 'POST',
            data: {
              csrf_token: $('meta[name="csrf-token"]').attr('content'),
              request: 'user.login',
              username: username,
              password: password
            },
            success: function(res) {
              if(!res.error) {
                form.find('#error').show().text('An error occured');
                return;
              }
              if($.trim(res.response) == 'Logged In') {
                window.location.replace('index.php');
                return;
              }
              if($.trim(res.response) == 'Incorrect Combination') {
                form.find('#username').val('');
                form.find('#password').val('');
                form.find('#error').show().text('Incorrect username or password');
                return;
              }
            }
          })
        });
      };

      function logout() {
        $('.logout').bind('click', function(e) {
          e.preventDefault();
          $.ajax({
            url: 'api.php',
            type: 'POST',
            data: {
              csrf_token: $('meta[name="csrf-token"]').attr('content'),
              request: 'user.logout'
            },
            success: function(res) {
              if(!res.error) {
                alert('An error occured while trying to log you out, contacat an admin.');
                return;
              }
              if($.trim(res.response) == 'Logged Out') {
                window.location.replace('index.php');
              }
            }
          })
        });
      };

      function isValidStr(inputs) {
        var isValid = true, matcher = /\s/
        inputs.forEach(function(value){
          if (!value.length || matcher.test(value)) isValid = false;
        });
        return isValid;
      }
      function isValidEmail(email) {
        email = $.trim(email);
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(filter.test(email)) {
          return true;
        }
        return false;
      }

      return user;
    })();
    var PathFinder = (function() {
      var finder = {};
      var path = window.location.href.toLowerCase();

      finder.matches = function(s, i) {
        var _path = path.match(/^(?:\/)?(.*?)(?:[\/])?$/i)[1];
        _path = _path.split('/').slice(3);
        if(s == _path[i])
          return true
        else
          return false
      };

      finder.debug = function() {
        var _path = this.path.match(/^(?:\/)?(.*?)(?:[\/])?$/i)[1];
        _path = _path.split('/').slice(3);
        console.info(_path);
      }

      return finder;
    })();
    $(document).on('ready', function() {
      if(PathFinder.matches('index.php', 0) || PathFinder.matches('', 0)) {
        chatCore.handshake();
      }
      userCore.init();
    });
  });
})(jQuery);