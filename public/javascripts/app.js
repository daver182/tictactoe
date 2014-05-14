'use strict';

var app = angular.module('tictactoe', []);

angular.module('tictactoe').controller('BoardCtrl', function ($scope, Server){
	var positions;
	var boardFull;
	var combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

	var winner;

	initBoard();

	$scope.newMove = function(position){
		if($scope.userTurn && !winner){
			$scope.squareContent[position] = 'X';
			positions[position] = true;
			$scope.userTurn = !$scope.userTurn;

			checkBoard();
			checkWins('X');

			if(!boardFull && !winner){
				Server.play(positions, function(status, response){
					if(status === 'success'){
						$scope.squareContent[response.position] = 'O';
						checkWins('O');
						positions = response.positions;
					}else{
						alert('Ocurrió un error al intentar conectarse con el servidor, reinicie el juego.')
					}
					
					$scope.userTurn = !$scope.userTurn;
				});
			}else if(boardFull && !winner){
				console.log('empate');
			}
			
		}
	}

	$scope.reset = function(){
		initBoard();
	}

	function initBoard(){
		//Inicializamos las variables
		$scope.squareContent = [];
		$scope.userTurn = true;

		positions = [];
		boardFull = false;
		winner = false
		
		//Inicializamos los arreglos de las posiciones
		for (var i = 0; i < 9; i++) {
			$scope.squareContent[i] = '';
			positions[i] = false;
		}
	}

	function checkBoard(){
		//Comprobamos que el tablero no este lleno
		boardFull = true;
		for (var i = 0; i < positions.length; i++) {
			if(!positions[i]){
				boardFull = false;
			}
		}

		
	}

	function checkWins(player){
		//Comprobamos si un usuario gano
		for (var i = 0; i < combinations.length; i++) {
			if($scope.squareContent[combinations[i][0]] == player && $scope.squareContent[combinations[i][1]] == player && $scope.squareContent[combinations[i][2]] == player){
				winner = player;
				$scope.winner = player;
				break;
			}
		}
	}
});

angular.module('tictactoe').service('Server', function Topic($http) {
	return {
		play: function(positions, fn){
			$http({method: 'POST', url: '/play', data: {positions: positions, }}).
			success(function(data, status, headers, config) {
				fn('success', data);
			}).
			error(function(data, status, headers, config) {
				fn('error')
			});
		}
	}
});