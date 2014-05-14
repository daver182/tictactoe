var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/play', function(req, res){
	var positions = req.body.positions;
	if(positions){
		var newPosition;
		var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		var combinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

		//Se busca una posicion donde existan dos figuras iguales
		for (var i = 0; i < combinations.length; i++) {
			//Si coincide el primero y el segundo
			if(positions[combinations[i][0]].value && positions[combinations[i][1]].value){
				//Si coinciden ambas figuras
				if(positions[combinations[i][0]].player === positions[combinations[i][1]].player){
					//Si la posicion no esta ocupada
					if(!positions[combinations[i][2]].value){
						//Se guarda el valor del tercero
						newPosition = combinations[i][2];
						break;
					}
				}
			}

			//Si coincide el segundo y el tercero
			if(positions[combinations[i][1]].value && positions[combinations[i][2]].value){
				//Si coinciden ambas figuras
				if(positions[combinations[i][1]].player === positions[combinations[i][2]].player){
					//Si la posicion no esta ocupada
					if(!positions[combinations[i][0]].value){
						//Se guarda el valor del primero
						newPosition = combinations[i][0];
						break;
					}
				}
			}
		}

		//Si no hubo exito se elige un valor al azar, se itera hasta encontrarlo
		if(newPosition === undefined){
			while(!newPosition){
				var pos = board[Math.floor(Math.random()*board.length)];

				if(!positions[pos].value){
					//Si no esta ocupado
					newPosition = pos;
					break;
				}
			}
		}
		

		positions[newPosition] = {player: 'O', value: true};

		//Timeout, para emular que el servidor esta pensando
		setTimeout(function(){
			res.json({position: newPosition, positions: positions});
		}, 500);
	}
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
