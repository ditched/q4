<?php
require_once('config/config.php');
require_once('resources/database.php');

spl_autoload_register(function($class) {
    require_once 'library/classes/' . $class . '.php';
});