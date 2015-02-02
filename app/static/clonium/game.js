window.H = 8;
window.W = 8;
window.turn = 0;
window.gray = "rgb(255, 255, 255)";
window.color = ["rgb(255, 3, 62)", "rgb(0, 165, 80)"];
window.RED = 0;
window.GREEN = 1;
window.directions = [[0, 0], [0, -1], [0, 1], [1, 0], [-1, 0]];
window.background = "rgb"


function coordsToId(X, Y) {
	return "td" + X.toString() + "_" + Y.toString();
}

function idToCoords(id) {
	var X = parseInt(id.slice(2));
	var Y = parseInt(id.slice(2 + X.toString().length + 1));
	//alert(id + " " + X.toString() + " " + Y.toString());
	return [X, Y];
}

function valid(X, Y)
{
	return (X >= 0 && Y >= 0 && X < H && Y < W);
}

function go(id)
{
	//console.log("GOGO", id);
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
			$("#" + id).css("background-color", gray);
		}
		else {
			$("#" + id).css("background-color", color[turn]);
		}
	}
}

$(document).ready(function() {
	for (var i = 0; i < window.H; ++i)
	{
		$("#field").append("<tr id=\"tr" + i.toString() + "\">\n")
		for (var j = 0; j < window.W; ++j) {
			$("#tr" + i.toString()).append("<td class=\"cell\" id=\"" + coordsToId(i, j) + "\">\n0\n</td>\n");
		}
		$("#field").append("</tr>\n");
	}
	$("#td1_1").css("background-color", color[RED]);
	$("#td1_1").html("3");
	$("#td" + (window.H - 1 - 1).toString() + "_1").css("background-color", color[GREEN]);
	$("#td" + (window.H - 1 - 1).toString() + "_1").html(3);
});



$(document).on("click", ".cell", function() {
	if ($(this).css("background-color") == color[turn])
	{
	//	$(this).html(parseInt($(this).html()) + 1);
		go($(this).attr("id"));
		turn ^= 1;
	}

});