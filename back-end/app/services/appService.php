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

    public function addReview($idPlato, $rating, $comentario, $idUsuario){
        $result = [];
        $add_review_query = "INSERT INTO TRating (comentario, idPlato, idUsuario, rating) VALUES (:comentario, :idPlato, :idUsuario, :rating)";
        $review_params = [
                        ":comentario" =>$comentario,
                        ":idPlato" =>$idPlato,
                        ":idUsuario" =>$idUsuario
                        ":rating" =>$rating
                    ];
        $result = $this->storage->query($add_review_query, $review_params);
        return $result;
    }
}
