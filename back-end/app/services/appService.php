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



    public function addToFavorites($idPlatillo, $idUsuario, $fechaHora){
        $result = [];
        $add_favorites_query = "INSERT INTO TFavoritos (idPlatillo, idUsuario, FechaHora) VALUES (:idPlatillo, :idUsuario, :fechaHora)";
        $add_params = [
                        ":idPlatillo" =>$idPlatillo,
                        ":idUsuario" =>$idUsuario,
                        ":fechaHora" =>$fechaHora
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

    public function test($idUsuario, $listaCriterios){
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
//-------------------------BACK-END---------------------------------------------
//Paso 3
//En esta parte llegan los parámetros enviados desde el controllador de php.
// Se escribe el query y se declaran los parámetros necesarios para el insert.
//La clase storage se encarga de meter los datos en la BD
//Una vez finalizada esta parte probar en Postman.
    public function addReview($idPlato, $rating, $comentario, $idUsuario, $visible){
        $result = [];
        $add_review_query = "INSERT INTO TRating (idPlato, rating, comentario, idUsuario, visible) VALUES (:idPlato, :rating, :comentario, :idUsuario, :visible)";
        $review_params = [
                        ":idPlato" =>$idPlato,
                        ":rating" =>$rating,
                        ":comentario" =>$comentario,
                        ":idUsuario" =>$idUsuario,
                        ":visible" =>$visible
                    ];
        $result = $this->storage->query($add_review_query, $review_params);
        return $result;
    }

    public function getAllFavorites($idUsuario){
        $result = [];
        $get_all_query = "SELECT * FROM TFavoritos WHERE idUsuario = :idUsuario";
        $getAll_params = [
                        ":idUsuario" =>$idUsuario
                    ];

        $result = $this->storage->query($get_all_query, $getAll_params);

        if (count($result['data'] > 0)) {
            return $result['data'];
        } else {
            $result['message'] = "You havet add favorites yet.";
            $result['error'] = true;
        }
        return $result;
    }
}
