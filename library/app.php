<?php
require('resources/database.php');

spl_autoload_register(function($class) {
    require_once 'library/classes/' . $class . '.php';
});