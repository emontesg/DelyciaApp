<?php

namespace App\Services;

class AppService {
	private $storage;
	private $isDBReady = TRUE;

	public function __construct() {
        if ($this->isDBReady) {
            $this->storage = new StorageService();
            //$this->valid = new ValidationService();
        }
    }

    public function getAll(){
        $result = [];
        $get_all_query = "SELECT * FROM TRecordatorio LIMIT 10";
        $params = [];

        $result = $this->storage->query($get_all_query, $params);

        if (count($result['data'] > 0)) {
            return $result['data'];
        } else {
            $result['message'] = "We don't have any users at this moment.";
            $result['error'] = true;
        }
        return $result;
    }
		public function loginUser($id, $name, $last_name, $email, $pic){
		$result = [];
		$get_all_query = "SELECT * FROM tusuarios WHERE idUsuario = :id";
		$getAll_params = [
										":id" =>$id,
										":name" =>$name,
										":last_name" =>$last_name,
										":email" =>$email,
										":pic" =>$pic
								];
		$result = $this->storage->query($get_all_query, $getAll_params);
		if (count($result['data'] > 0)) {
			$add_user_query = "INSERT INTO Tusuarios (idUsuario, nombre, apellido, email, picture) VALUES (:id, :name, :last_name, :email, :pic)";
			$result = $this->storage->query($add_user_query, $getAll_params);
			$result['message'] = "user insert";
		} else {
			$result['message'] = "No user insert";
			return $result;
		}

}



    public function addToFavorites($idPlatillo, $idUsuario, $fechaHora, $recordatorio){
        $result = [];
        $add_favorites_query = "INSERT INTO TFavoritos (idPlato, idUsuario, fecha, recordatorio) VALUES (:idPlatillo, :idUsuario, :fechaHora, :recordatorio)";
        $add_params = [
                        ":idPlatillo" =>$idPlatillo,
                        ":idUsuario" =>$idUsuario,
                        ":fechaHora" =>$fechaHora,
                        ":recordatorio" =>$recordatorio
                    ];
        $result = $this->storage->query($add_favorites_query, $add_params);
        return $result;
    }

    public function addCriteria($TipoComida, $idUsuario){
        $result = [];
        $add_criteria_query = 'INSERT INTO tcriterios (TipoComida, idUsuario) VALUES (:TipoComida,:idUsuario)';
        $criteria_params = [
                            ':TipoComida'=> $TipoComida,
                            ':idUsuario' => $idUsuario
                            ];
        $result = $this->storage->query($add_criteria_query,$criteria_params);
        return $result;
    }

    public function getCriteriaByUserId($idUsuario){
        $result = [];
        $get_criteria_by_user_query = 'SELECT * FROM tcriterios WHERE idUsuario = :idUsuario';
        $criteria_params = [':idUsuario' => $idUsuario];
        $result = $this->storage->query($get_criteria_by_user_query,$criteria_params);
        return $result;
    }

    public function deleteCriteriaById($idCriterio){
        $result = [];
        $delete_criteria_query = 'DELETE FROM tcriterios WHERE idCriterio = :idCriterio';
        $delete_params = [':idCriterio' => $idCriterio];
        $result = $this->storage->query($delete_criteria_query,$delete_params);
        return $result;   
    }

    public function addCriteriaArray($idUsuario, $listaCriterios){
        $result = [];
        $test_query = 'INSERT INTO tcriterios (TipoComida, idUsuario) VALUES (:TipoComida,:idUsuario)';

        for ($i=0; $i < count($listaCriterios); $i++) { 
            $test_params = [
                            ':TipoComida' =>$listaCriterios[$i]['TipoComida'],
                            ':idUsuario' => $idUsuario
                            ];
            $result = $this->storage->query($test_query, $test_params);
            
        }

        //$result['noobs everywhere'] = $idUsuario;
        
        return $result;

    }
    public function deleteCriteriaArray($listaIds){
        $result = [];
        $delete_query = 'DELETE FROM tcriterios WHERE idCriterio = :idCriterio';
        for ($i=0; $i < count($listaIds); $i++) {         
            $delete_params = [':idCriterio' => $listaIds[$i]];  
            $result = $this->storage->query($delete_query,$delete_params);
        }

        return $result;
    }

    public function addFriend($idUsuario,$idAmigo){
        $result = [];
        $add_friend_query = 'INSERT INTO tamigos (idUsuario, idAmigo, contInv) VALUES (:idUsuario, :idAmigo, 0)';
        $add_friend_params = [':idUsuario' => $idUsuario,
                                ':idAmigo'=> $idAmigo
                                ];
        $result = $this->storage->query($add_friend_query,$add_friend_params);

        return $result;

    }

    public function getFriendsByUserId($idUsuario){
        $result = [];
        $get_friends_query = 'SELECT * FROM tusuarios WHERE idUsuario IN (SELECT idAmigo FROM tamigos WHERE idUsuario = :idUsuario)';

        $get_friends_params = [':idUsuario' => $idUsuario];

        $result = $this->storage->query($get_friends_query,$get_friends_params);

        return $result;
    }

    public function deleteFriend($idUsuario, $idAmigo){
        $result = [];
        $delete_friend_query = 'DELETE FROM tamigos WHERE idUsuario = :idUsuario AND idAmigo = :idAmigo';
        $delete_friend_params = [":idUsuario" => $idUsuario, ':idAmigo' => $idAmigo];

        $result = $this->storage->query($delete_friend_query,$delete_friend_params);

        return $result;
    }

//-------------------------BACK-END---------------------------------------------
//Paso 3
//En esta parte llegan los parámetros enviados desde el controllador de php.
// Se escribe el query y se declaran los parámetros necesarios para el insert.
//La clase storage se encarga de meter los datos en la BD
//Una vez finalizada esta parte probar en Postman.
    public function addReview($idPlato, $rating, $comentario, $idUsuario, $visible, $fechaHora){
        //Data que ayuda a verificar si el usuario ya ha hechc un comentario
        $validation = [];
        $query_validation = "SELECT * FROM trating where idUsuario = :idUser and idPlato = :idPlato";
        $validation_params = [
                        ":idUser" =>$idUsuario,
                        ":idPlato" =>$idPlato
                    ];
        $validation = $this->storage->query($query_validation, $validation_params);
        //Data que ayuda al proceso de insercion y de update
        $result = [];
        $review_params = [
                        ":idPlato" =>$idPlato,
                        ":rating" =>$rating,
                        ":comentario" =>$comentario,
                        ":idUsuario" =>$idUsuario,
                        ":visible" =>$visible,
                        ":fechaHora" => $fechaHora
                    ];

        if(count($validation['data']) > 0){
            //si ya existe el review del usuario
            $update_review = "UPDATE trating SET rating = :rating, comentario = :comentario, visible = :visible, fecha =:fechaHora
            WHERE idUsuario = :idUsuario and idPlato = :idPlato";
            $result = $this->storage->query($update_review, $review_params);
        }else{
            $add_review_query = "INSERT INTO TRating (idPlato, rating, comentario, idUsuario, visible, fecha) VALUES (:idPlato, :rating, :comentario, :idUsuario, :visible, :fechaHora)";
            $result = $this->storage->query($add_review_query, $review_params);
        }
        return $result;
    }

    public function getAllReviews($idPlatillo){
        $result = [];
        $get_all_query = "SELECT trating.comentario, trating.fecha, trating.idPlato, trating.idUsuario, trating.rating, trating.visible, tusuarios.apellido, tusuarios.nombre, tusuarios.email, tusuarios.telefono, tusuarios.picture 
            FROM trating 
            INNER JOIN tusuarios ON tusuarios.idUsuario = trating.idUsuario 
            WHERE trating.idPlato = :idPlatillo 
            ORDER BY fecha DESC";
        $getAll_params = [
                        ":idPlatillo" =>$idPlatillo
                        ];

        $result = $this->storage->query($get_all_query, $getAll_params);

        if (count($result['data'] > 0)) {
            return $result['data'];
        } else {
            $result['message'] = "No reviews added yet.";
            $result['error'] = true;
        }
        return $result;
    }

    public function getUserReview($idPlatillo, $idUsuario){
        $result = [];
        $get_query = "SELECT * FROM trating WHERE idUsuario = :idUsuario and idPlato = :idPlatillo";
        $get_params = [
                        ":idUsuario" =>$idUsuario,
                        ":idPlatillo" =>$idPlatillo
                        ];
        $result = $this->storage->query($get_query, $get_params);

        if (count($result['data'] > 0)) {
            $resultado = $result['data'];
            return $resultado;
        } else {
            $result['message'] = "No reviews added yet.";
            $result['error'] = true;
        }
        return $result;
    }

    public function getCantReviews($idPlatillo){
        $result = [];
        $resultado = 0;
        $get_query = "SELECT comentario FROM trating WHERE idPlato = :idPlatillo";
        $getAll_params = [
                        ":idPlatillo" =>$idPlatillo
                        ];
        $result = $this->storage->query($get_query, $getAll_params);

        if (count($result['data'] > 0)) {
            $resultado = count($result['data']);
            return $resultado;
        } else {
            $result['message'] = "No reviews added yet.";
            $result['error'] = true;
        }
        return $result;
    }

    public function addAverageRating($idPlatillo, $promedio){
        $validation_result = [];
        $validation_query = "SELECT * FROM tpromedio WHERE idPlato = :idPlatillo";
        $validation_params = [
                        ":idPlatillo" =>$idPlatillo
                        ];
        $validation_result = $this->storage->query($validation_query, $validation_params);

        $result = [];
        $add_params = [
                        ":idPlatillo" =>$idPlatillo,
                        ":promedio" =>$promedio 
                    ];
        if (count($validation_result['data']) > 0) {
            $update_query = "UPDATE tpromedio SET promedio = :promedio WHERE idPlato = :idPlatillo";
            $result = $this->storage->query($update_query, $add_params);
            return $result;
        } else {
            $add_query = "INSERT INTO tpromedio(idPlato,promedio) VALUES (:idPlatillo, :promedio)";
            $result = $this->storage->query($add_query, $add_params);
            return $result;
        }
        return $result;
    }

    public function getAverageRatings(){
        $result = [];
        $get_all_query = "SELECT * FROM tpromedio";
        $getAll_params = [];

        $result = $this->storage->query($get_all_query, $getAll_params);

        if (count($result['data']) > 0) {
            return $result['data'];
        } else {
            $result['message'] = "You haven't add ratings yet.";
            $result['error'] = true;
        }
        return $result;
    }

    public function getAllFavorites($idUsuario){
        $result = [];
        $get_all_query = "SELECT * FROM tfavoritos WHERE idUsuario = :idUsuario";
        $getAll_params = [
                        ":idUsuario" =>$idUsuario
                    ];

        $result = $this->storage->query($get_all_query, $getAll_params);

        if (count($result['data'] > 0)) {
            return $result['data'];
        } else {
            $result['message'] = "You haven't add favorites yet.";
            $result['error'] = true;
        }
        return $result;
    }

    public function removeFavorites($idPlatillo, $idUsuario){
        $result = [];
        $remove_query = "DELETE FROM tfavoritos WHERE idPlato = :idPlatillo and idUsuario = :idUsuario";
        $remove_params = [
                        ":idPlatillo" =>$idPlatillo,
                        ":idUsuario" =>$idUsuario
                    ];
        $result = $this->storage->query($remove_query, $remove_params);
        $result = $remove_params;
        return $result;

    }

    public function setReminder($idPlatillo, $reminder){
        $result = [];
        $update_query = "UPDATE tfavoritos SET recordatorio = :reminder  WHERE idPlato = :idPlatillo";
        $update_params = [
                        ":idPlatillo" =>$idPlatillo,
                        ":reminder" =>$reminder
                    ];
        $result = $this->storage->query($update_query, $update_params);
        return $result;
    }



    // public function addReminder($idUsuario, $idPlatillo, $fechaHora){
    //     $validation_result = [];
    //     $validation_query = "SELECT * FROM trecordatorios WHERE idUsuario = :idUsuario AND idPlato = :idPlatillo";
    //     $validation_params = [
    //                     ":idPlatillo" =>$idPlatillo,
    //                     ":idUsuario" =>$idUsuario
    //                 ];
    //     $validation_result = $this->storage->query($validation_query, $validation_params);
        
    //     $result = [];
    //     $add_params = [
    //                     ":idPlatillo" =>$idPlatillo,
    //                     ":idUsuario" =>$idUsuario,
    //                     ":fechaHora" =>$fechaHora
    //                 ];

    //     if(count($validation_result['data']) > 0){
    //         //si ya existe el review del usuario
    //         $update_review = "UPDATE trating SET rating = :rating, comentario = :comentario, visible = :visible, fecha =:fechaHora
    //         WHERE idUsuario = :idUsuario and idPlato = :idPlato";
    //         $result = $this->storage->query($update_review, $review_params);
    //     }else{
    //         $add_reminder_query = "INSERT INTO trecordatorios(idUsuario, idPlato, fecha) VALUES (:idUsuario,:idPlatillo,:fecha)";
    //         $result = $this->storage->query($add_reminder_query, $add_params);
    //     }
    //     return $result;
    // }
}
