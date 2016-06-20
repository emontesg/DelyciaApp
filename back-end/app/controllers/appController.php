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
		public function loginUser($request){
			$result = [];
				$data = $request->getParsedBody();

			if (array_key_exists("id", $data)) {
						$id = $data["id"];
				}else {
						$result = [
								"error" => true,
								"message" => "The idUser data field is missing."
						];
						return $result;
				}

				if (array_key_exists("name", $data)) {
						$name = $data["name"];
				}else {
						$result = [
								"error" => true,
								"message" => "The name user data field is missing."
						];
						return $result;
				}
				$last_name = $data["last_name"];
				$email = $data["email"];

				//Server's date

				if (isset($id, $name)) {
						$result = $this->AppService->loginUser($id, $name, $last_name, $email);
						return $result;
				} else {
						$result['error'] = true;
						$result['message'] = 'You must send all the information required';
				}
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
//-------------------------BACK-END---------------------------------------------
//Paso 2
//se recibe el objeto enviado desde el servicio de angular y se descompone,
//para validar si los datos que vienen en el objeto son válidos. Si los son
// se envian al servicio de php para que sean ingresados en la BD.
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
                //Server's date
        $fechaHora = date("Y-m-d");

        if (isset($idPlatillo, $rating, $comentario, $idUsuario, $visible, $fechaHora)) {
            $result = $this->AppService->addReview($idPlatillo, $rating, $comentario, $idUsuario, $visible, $fechaHora);
            return $result;
        } else {
            $result['error'] = true;
            $result['message'] = 'You must send all the information required';
        }

    }

    public function getAllReviews($request){
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

        if (isset($idPlatillo)) {
            $result = $this->AppService->getAllReviews($idPlatillo);
        } else {
            $result = [
                'error' => true,
                'message' => "We couldn't find the requested reviews."
            ];
        }
        return $result;
    }

    public function getCantReviews($request){
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

        if (isset($idPlatillo)) {
            $result = $this->AppService->getCantReviews($idPlatillo);
        } else {
            $result = [
                'error' => true,
                'message' => "We couldn't find the requested reviews."
            ];
        }
        return $result;
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

    public function removeFavorite($request){
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

        if (isset($idPlatillo, $idUsuario)) {
            $result = $this->AppService->removeFavorites($idPlatillo, $idUsuario);
            return $result;
        } else {
            $result['error'] = true;
            $result['message'] = 'You must send all the information required';
        }
    }
}
