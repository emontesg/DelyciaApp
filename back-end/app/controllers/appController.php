<?php
namespace App\Controllers;

use App\Services\appService;
use Slim\Http\Request;

class AppController {
	private $AppService;

    public function __construct() {
        $this->AppService = new AppService();
    }

    public function getAll(){
        $result = $this->AppService->getAll();
        return $result;
    }   

    public function addToFavorites($request){
    	$result = [];
        $data = $request->getParsedBody();

    	if (array_key_exists("idPlatillo", $data)) {
            $idPlatillo = $data["idPlatillo"];
        }else {
            $result = [
                "error" => true,
                "message" => "The idPlatillo data field is missing."
            ];
            return $result;
        }

        if (array_key_exists("idUsuario", $data)) {
            $idUsuario = $data["idUsuario"];
        }else {
            $result = [
                "error" => true,
                "message" => "The idUsuario data field is missing."
            ];
            return $result;
        }
        //Server's date
        $fechaHora = date("Y-m-d");

        if (isset($idPlatillo, $idUsuario, $fechaHora)) {
            $result = $this->AppService->addToFavorites($idPlatillo, $idUsuario, $fechaHora);
            return $result; 
        } else {
            $result['error'] = true;
            $result['message'] = 'You must send all the information required';
        } 
        return $result;
    }

    public function addCriteria($request){
        $result = [];
        $data = $request->getParsedBody();

        if(array_key_exists('TipoComida', $data)){
            $TipoComida = $data['TipoComida'];
        }else{
            $result = [
                "error" => true,
                "message" => "no wey!"
            ];
            return $result;
        }

        if(array_key_exists('idUsuario', $data)){
            $idUsuario = $data['idUsuario'];
        }else{
            $result = [
                'error' => true,
                'message' => 'no manches!'
            ];
            return $result;
        }

        //----------------whats
        if(isset($TipoComida, $idUsuario)){
            $result = $this->AppService->addCriteria($TipoComida,$idUsuario);
            return $result;
        }else{
            $result['error'] = true;
            $result['message'] = 'You must send all the information required';
        }
    }

    public function getCriteriaByUserId($request){
        $result = [];
        $data = $request->getParsedBody();

        if(array_key_exists('idUsuario', $data)){
            $idUsuario = $data['idUsuario'];
        }else{
            $result['error'] = true;
            $result['message'] = 'pos no';
            return $result;
        }

        if(isset($idUsuario)){
            $result = $this->AppService->getCriteriaByUserId($idUsuario);
            return $result;
        }else{
            $result['error'] = true;
            $result['message'] = 'que noooo';
            return $result;
        }
    }

    public function deleteCriteriaById($request){
        $result = [];
        $data = $request->getParsedBody();

        if(array_key_exists('idCriterio', $data)){
            $idCriterio = $data['idCriterio'];
        }else{
            $result = [
                'error' => true,
                'message' => 'no dude!'
            ];
            return $result;
        }

        if(isset($idCriterio)){
            $result= $this->AppService->deleteCriteriaById($idCriterio);
            return $result;
        }else{
            $result = [
                'error' => true,
                'message' => 'no por yisus!'
            ];
            return $result;
        }
    }

//-------------------------BACK-END---------------------------------------------
//Paso 2
//se recibe el onjeto enviado desde el servicio de angular y se descompone,
//para validar si los datos que vienen en el objeto son válidos. Si los son
// se envian al serviocio de php para que sean ingresados en la BD.
    public function addReview($request){
        $result = [];
        $data = $request->getParsedBody();

        if (array_key_exists("idPlatillo", $data)) {
            $idPlatillo = $data["idPlatillo"];
        }else {
            $result = [
                "error" => true,
                "message" => "The idPlatillo data field is missing."
            ];
            return $result;
        }

        if (array_key_exists("rating", $data)) {
            $rating = $data["rating"];
        }else {
            $result = [
                "error" => true,
                "message" => "The rating data field is missing."
            ];
            return $result;
        }

        if (array_key_exists("comentario", $data)) {
            $comentario = $data["comentario"];
        }else {
            $result = [
                "error" => true,
                "message" => "The comentario data field is missing."
            ];
            return $result;
        }

        if (array_key_exists("idUsuario", $data)) {
            $idUsuario = $data["idUsuario"];
        }else {
            $result = [
                "error" => true,
                "message" => "The idUsuario data field is missing."
            ];
            return $result;
        }

        if (array_key_exists("visible", $data)) {
            $visible = $data["visible"];
        }else {
            $result = [
                "error" => true,
                "message" => "The visible data field is missing."
            ];
            return $result;
        }

        if (isset($idPlatillo, $rating, $comentario, $idUsuario, $visible)) {
            $result = $this->AppService->addReview($idPlatillo, $rating, $comentario, $idUsuario, $visible);
            return $result; 
        } else {
            $result['error'] = true;
            $result['message'] = 'You must send all the information required';
        } 

    }

    public function getAllFavorites($request){
        $result = [];
        $data = $request->getParsedBody();
        $idUsuario = $data['idUsuario'];
        
        if (isset($idUsuario)) {
            $result = $this->AppService->getAllFavorites($idUsuario);
        } else {
            $result = [ 
                'error' => true,
                'message' => "We couldn't find the requested favorites."
            ];
        }
        return $result;
    }
}