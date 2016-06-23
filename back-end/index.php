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
$app->post(
    '/app/loginUser',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();

        $result = $appController->loginUser($request);
        return $response->withJson($result);
    }
);
$app->post(
    '/app/addCriteria',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();
        $result = $appController->addCriteria($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/getCriteriaByUserId',
    function ($request, $response){
        $appController = new App\Controllers\AppController();
        $result = $appController->getCriteriaByUserId($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/deleteCriteriaById',
    function($request, $response){
        $appController = new App\Controllers\AppController();
        $result = $appController->deleteCriteriaById($request);
        return $response->withJson($result);
    }
);
$app->post(
    '/app/addCriteriaArray',
    function($request, $response){
        $appController = new App\Controllers\AppController();
        $result = $appController->addCriteriaArray($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/deleteCriteriaArray',
    function($request, $response){
        $appController = new App\Controllers\AppController();
        $result = $appController->deleteCriteriaArray($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/getAllFavorites',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();
        $result = $appController->getAllFavorites($request);
        return $response->withJson($result);
    }
);

$app->post('/app/addFriend',
    function($request, $response){
        $appController = new App\Controllers\AppController();
        $result = $appController->addFriend($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/removeFavorite',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();
        $result = $appController->removeFavorite($request);
        return $response->withJson($result);
    }
);

$app->post('/app/getFriendsByUserId',
    function($request, $response){
        $appController = new App\Controllers\AppController();
        $result = $appController->getFriendsByUserId($request);
        return $response->withJson($result);
    }
);

$app->post('/app/deleteFriend',
    function($request, $response){
        $appController = new App\Controllers\AppController();
        $result = $appController->deleteFriend($request);
        return $response->withJson($result);
    }
);

//-------------------------BACK-END---------------------------------------------
//Paso 1
//Manera en la cual se comunica el servicio de angular con el controlador de PHP
//Se le da nombre a la ruta del post : '/app/addReview'
//Se hace un new del controller de php con el que nos vamos a comunicar y se llama
//al método deseado que se encuentra en el controlador
$app->post(
    '/app/addReview',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();
        $result = $appController->addReview($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/getAllReviews',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();

        $result = $appController->getAllReviews($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/getCantReviews',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();

        $result = $appController->getCantReviews($request);
        return $response->withJson($result);
    }
);

$app->post(
    '/app/getUserReview',
    function ($request, $response) {
        $appController = new App\Controllers\AppController();

        $result = $appController->getUserReviews($request);
        return $response->withJson($result);
    }
);


$app->run();
