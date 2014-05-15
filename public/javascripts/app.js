'use strict';

window.path = document.querySelector('svg > path');

var app = angular.module('tictactoe', []);

angular.module('tictactoe').controller('BoardCtrl', function ($scope, Server){
	var positions;
	var boardFull;
	//Todas las combinaciones ganadoras
	var combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

	initBoard();
	$scope.newMove = function(position){
		if($scope.userTurn && !$scope.isWinner && !positions[position].value){
			$scope.squareContent[position] = 'X';
			positions[position] = {player: 'X', value: true};
			$scope.userTurn = !$scope.userTurn;

			checkBoard();
			checkWins('X');

			if(!boardFull && !$scope.isWinner){
				Server.move(positions, function(status, response){
					if(status === 'success'){
						$scope.squareContent[response.position] = 'O';
						checkWins('O');
						positions = response.positions;

						$scope.userTurn = !$scope.userTurn;
					}else{
						alert('Ocurrió un error al intentar conectarse con el servidor, reinicie el juego.')
					}
				});
			}else if(boardFull && !$scope.isWinner){
				$scope.isDraw = true;
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
		$scope.isWinner = false;
		$scope.isDraw = false;
		$scope.lineClass = false;
		
		$scope.winnerPositions = [];

		positions = [];
		boardFull = false;
		
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
		//Comprobamos si un usuario ganó
		for (var i = 0; i < combinations.length; i++) {
			if($scope.squareContent[combinations[i][0]] == player && $scope.squareContent[combinations[i][1]] == player && $scope.squareContent[combinations[i][2]] == player){
				$scope.winnerPositions[combinations[i][0]] = true;
				$scope.winnerPositions[combinations[i][1]] = true;
				$scope.winnerPositions[combinations[i][2]] = true;
				$scope.isWinner = true;
				$scope.winner = player;

				$scope.lineClass = 'active combination-' + i;
			}
		}

		
	}
});

angular.module('tictactoe').service('Server', function Topic($http) {
	return {
		move: function(positions, fn){
			$http({method: 'POST', url: '/api/1/movement', data: {positions: positions, }}).
			success(function(data, status, headers, config) {
				fn('success', data);
			}).
			error(function(data, status, headers, config) {
				fn('error')
			});
		}
	}
});