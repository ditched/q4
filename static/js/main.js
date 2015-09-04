(function($) {
  $(function() {
    var chatCore = (function() {
      if($('meta[name="logged-in"]').attr('content') == false) return;
      var chat = {};
      var 
        _socket,
        _chatBox,
        _load,
        _username;

      var options = {};
      options['app_socket_host'] = '127.0.0.1:3000';

      chat.handshake = function() {
        callUsername();
        _socket = io(options.app_socket_host);
        _load = '55124123123';
        _chatBox = $('.norm_container .messages');
        _username = Cookies.get('1b87');
      };

      chat.subscribe = function() {
        _socket.on('connect', function() {
          _chatBox.find('ul').append('<li class="console">Welcome '+_username+'! Type /help to get started</li>');
          _socket.emit('establish', {username: _username, payload: _load});
        });
        _socket.on('chat message', function(data) {
          _chatBox.find('ul').append('<li class="message"><span class="username">'+data.username+'</span>:'+textToLink(data.message)+'</li>');
          _chatBox.find('ul').animate({
            scrollTop: _chatBox.find('ul').scrollHeight
          }, 200);
        });
        _socket.on('update users', function(users) {
          $('#clients').html('');
          for(var user in users) {
            var _user = user;
            if(users.hasOwnProperty(user)) {
              $('#clients').append('<li>'+user+'</li>');
            }
          }
        });
      };

      function callUsername() {
        $.ajax({
          url: 'api.php',
          type: 'POST',
          dataType: 'json',
          data: {
            csrf_token: $('meta[name="csrf-token"]').attr('content'),
            request: 'user.username'
          }
        }).done(function(res) {
          Cookies.set('1b87', res.response);
        });
      }

      function textToLink(text) {
        var re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
        return text.replace(re, "<a href=\"$1\" title=\"\" target='_blank' id='mLink'>$1</a>");
      }

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
            username = form.find('#username').val(),
            password = form.find('#password').val(),
            c_password = form.find('#c-password').val();

          if(email == '' || username == '' || password == '' || c_password == '') {
            form.find('#error').show().html('Please fill out all of the form fields');
            return;
          }
          if(!isValidEmail(email)) {
            form.find('#error').show().html('Please enter a valid email');
            return;
          }
          if(!isValidStr([username])) {
            form.find('#error').show().html('Please enter a valid username');
            return;
          }
          if(password !== c_password) {
            form.find('#error').show().html('Passwords do not match');
            return;
          }
          $.ajax({
            type: 'POST',
            url: 'api.php',
            data: {
              csrf_token: $('meta[name="csrf-token"]').attr('content'),
              request: 'user.register',
              email: email,
              username: username,
              password: password,
              c_password: c_password
            },
            dataType: 'json',
            success: function(res) {
              if(res.error) {
                form.find('#error').show().text('An error occured');
                return;
              }
              if($.trim(res.response) == 'Registered') {
                window.location.replace('index.php');
                return;
              }
              switch($.trim(res.response)) {
                case 'Passwords do not match':
                  form.find('#error').show().text('Passwords do not match');
                  break;
                case '[User.register] No post data received':
                  form.find('#error').show().text('An error occured, please reload');
                  break;
                case 'Username in use':
                  form.find('#error').show().text('Username already in use');
                  break;
                case 'Email in use':
                  form.find('#error').show().text('Email already in use');
                  break;
                default:
                  form.find('#error').show().text('An error occured');
                  break;
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

          if(username == '' || password == '') {
            form.find('#error').show().text('Please enter your username/password');
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
            dataType: 'json',
            success: function(res) {
              console.log(res);
              if(res.error) {
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
            dataType: 'json',
            success: function(res) {
              if(res.error) {
                alert('An error occured while trying to log you out, contacat an admin.');
                return;
              }
              if($.trim(res.response) == 'Logged Out') {
                Cookies.remove('1b87', {path: ''});
                window.location.replace('index.php');
              }
            }
          })
        });
      };

      function isValidStr(inputs) {
        var isValid = true, matcher = /\s/
        inputs.forEach(function(value){
          if(!value.length || matcher.test(value)) isValid = false;
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
      if(PathFinder.matches('index.php', 1)) {
        chatCore.handshake();
        chatCore.subscribe();
      }
      userCore.init();
    });
  });
})(jQuery);