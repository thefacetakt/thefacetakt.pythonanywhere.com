window.H = 8;
window.W = 8;


window.color = ["rgb(255, 3, 62)", "rgb(0, 165, 80)", "rgb(255, 255, 255)"];
window.RED = 0;
window.GREEN = 1;
window.NONE = 2;


window.directions = [[0, 0], [0, -1], [0, 1], [1, 0], [-1, 0]];

window.data = {map : undefined, turn : undefined}

function coordsToId(X, Y) {
    return "td" + X.toString() + "_" + Y.toString();
}

function idToCoords(id) {
    var X = parseInt(id.slice(2));
    var Y = parseInt(id.slice(2 + X.toString().length + 1));
    //alert(id + " " + X.toString() + " " + Y.toString());
    return [X, Y];
}

function valid(X, Y) {
    return (X >= 0 && Y >= 0 && X < H && Y < W);
}

function go(id) {
    coords = idToCoords(id);
    var X = coords[0];
    var Y = coords[1];
    if (valid(X, Y)) {
        $("#" + id)
        $("#" + id).html(parseInt($("#" + id).html()) + 1);
        if (parseInt($("#" + id).html()) >= 4) {
            $("#" + id).html(parseInt($("#" + id).html()) - 5);
            for (var i = 0; i < directions.length; ++i) {
                //console.log(X, Y, directions[i][0], directions[i][1], i)
                go(coordsToId(X + directions[i][0], Y + directions[i][1]));
            }    
        }
        if (parseInt($("#" + id).html()) == 0) {
            $("#" + id).css("background-color", color[NONE]);
        }
        else {
            $("#" + id).css("background-color", color[data.turn]);
        }
        data.map[X][Y] = {
            value: $("#" + coordsToId(X, Y)).html().trim(),
            color: $("#" + coordsToId(X, Y)).css('background-color')
           }
    }
}


function hashedData() {
	var string_data_prefix = "";
	var string_data_suffix = "";
	for (var i = 0; i < H; ++i) {
		for (var j = 0; j < W; ++j) {
			string_data_prefix += data.map[i][j].value.toString();
			string_data_suffix += data.map[i][j].color.replace(/\s+/g, '');
		}
	}
    return hex_md5(string_data_prefix + data.turn.toString() + string_data_suffix);
}

function drawMap() {
    for (var i = 0; i < H; ++i) {
        for (var j = 0; j < W; ++j) {
            $("#" + coordsToId(i, j)).html(data.map[i][j].value);
            $("#" + coordsToId(i, j)).css('background-color', data.map[i][j].color);
        }
    }
}

//I think it is very-very bad way to update data. Gotta do smth with it
//Way to fix: http://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent
function updateData() {
    $.post("/clonium/update_clients", {
        data: hashedData()
    }).done(function(result) {
        window.log = result;
        if (result.differ) {
       		data.map = result.map;
       		data.turn = result.turn;
       		drawMap();
        }
    });
    setTimeout(updateData, 1000); 
}

$(document).ready(function() {
    data.turn = parseInt($("#turn").html())
    data.map = new Array(H);
    for (var i = 0; i < H; ++i) {
        data.map[i] = new Array(8);
        for (var j = 0; j < W; ++j) {
            data.map[i][j] = {
                value: $("#" + coordsToId(i, j)).html().trim(),
                color: $("#" + coordsToId(i, j)).css('background-color')
               }
        }
    }
    updateData();
});



$(document).on("click", ".cell", function() {
    if ($(this).css("background-color") == color[data.turn]) {
    //    $(this).html(parseInt($(this).html()) + 1);
        go($(this).attr("id"));
        data.turn ^= 1;
        console.log("HERE");
        $.post('/clonium/update_servers', {
            map: JSON.stringify(data.map),
            turn: JSON.stringify(data.turn)
        });
    }

});