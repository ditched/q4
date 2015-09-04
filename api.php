<?php
//error_reporting(-1);
//ini_set('display_errors', 'On');
require('library/app.php');

header('Content-Type: application/json');

session_start();

if(isset($_POST['csrf_token'], $_POST['request']) && strlen($_POST['csrf_token']) == 24) {
  $User = new User();
  if($_POST['request'] == 'user.register') {
    if(!isset($_POST['email'], $_POST['username'], $_POST['password'], $_POST['c_password'])) {
      response(true, '[User.register] No post data received');
      return;
    }

  
    $email = filter_var($_POST['email'], FILTER_SANITIZE_STRING);
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
    $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
    $c_password = filter_var($_POST['c_password'], FILTER_SANITIZE_STRING);

    if($password != $c_password) {
      response(false, 'Passwords do not match');
      return;
    }

    if($User->exists('email', $email)) {
      response(false, 'Email in use');
      return;
    }

    if($User->exists('username', $username)) {
      response(false, 'Username in use');
      return;
    }

    /* User logic here */
    if($User->register($email, $username, $password)) {
      response(false, 'Registered');
      return;
    }
  } 
  if($_POST['request'] == 'user.login') {
    if(isset($_POST['username'], $_POST['password'])) {
      $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
      $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);

      if($User->login($username, $password)) {
        $_SESSION['user']['username'] = $username;
        $_SESSION['user']['logged_in'] = true;
        response(false, 'Logged In');
      } else {
        response(false, 'Incorrect Combination');
      }
    } else {
      response(true, '[User.login] No post data received');
    }
  }
  if($_POST['request'] == 'user.logout') {
    if($User->logout()) {
      response(false, 'Logged Out');
    } else {
      response(false, 'Error');
    }
  }
  if($_POST['request'] == 'user.username') {
    if(!empty($_SESSION['user'])) {
      response(false, $_SESSION['user']['username']);
    } else {
      response(false, 'Not logged in');
    }
  }
} else {
  response(true, 'Invalid Authentication');
}

function response($err, $msg) {
  $json = array();
  $json['error'] = $err;
  $json['response'] = $msg;
  $json = json_encode($json);
  echo $json;
}
