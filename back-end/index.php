<?php

require "bootstrap.php";

use Slim\Http\Request;
use Slim\Http\Response;

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];

$contenedor = new \Slim\Container($configuration);

$app = new \Slim\App($contenedor);

$app->get(
    '/app/getAll',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();

        $result = $appController->getAll($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/addFavorite',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();
        
        $result = $appController->addToFavorites($request);
        return $response->withJson($result);
    }
);


$app->run();