<?php
require('library/app.php');

header('Content-Type: application/javascript');

if(!isset(($_POST['csrf_token']) && strlen($_POST['csrf_token']) == 24 && $_POST['request']) {
  $endpoints = array(
    'user' => array(
      'login' => 'userLoginFunction' 
    ),
  );

  $functions = glob('library/endpoints/*');
  foreach ($functions as $fn) {
    require($fn);
  }

  $request = explode('.');
  $end = $request[0];
  $point = $request[1];
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
