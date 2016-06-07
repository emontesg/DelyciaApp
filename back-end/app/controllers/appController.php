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

    public function addReview($request){
        $result = [];
        $data = $request->getParsedBody();
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