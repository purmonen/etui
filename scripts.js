function Etui(canvas, n, spikes) {

	var matrix = [];
	var i;
	var y;
	var x;
	var that = this;

	var columnSize = 50;

	// Initialize matrix
	for (i = 0; i < n; i++) {
		var row = [];
		for (j = 0; j < n; j++) {
			row.push(0);
		}
		matrix.push(row);
	}

	// Put spikes at random positions
	for (i = 0; i < spikes; i++) {
		if (i + 1 > Math.pow(n, 2)) {
			break;
		}

		// Make sure we place spikes on empty positions
		while (true) {
			x = randomRange(0, n-1);
			y = randomRange(0, n-1);

			if (matrix[x][y] !== 1) {
				matrix[x][y] = 1;
				break;
			}
		}
	}

	function solve() {

	}

	function down(x, y) {

	}

	this.draw = function() {

		var x = matrix[0].length;
		var y = matrix.length;

		canvas.width = columnSize * x;
		canvas.height = columnSize * y;
		var ctx = canvas.getContext('2d');


		var i;

		// Horizontal lines
		for (i = 0; i <= y; i++) {
			ctx.moveTo(0, columnSize*i);
			ctx.lineTo(columnSize*x, columnSize*i);
		}

		// Vertical lines
		for (i = 0; i <= x; i++) {
			ctx.moveTo(columnSize*i, 0);
			ctx.lineTo(columnSize*i, columnSize*y);
		}

		// Spikes
		for (i = 0; i < y; i++) {
			for (j = 0; j < x; j++) {
				ctx.moveTo(columnSize*j, columnSize*i);
				if (matrix[i][j] === 1) {
					ctx.fillStyle = '#000';
					ctx.fillRect(columnSize*j, columnSize*i, columnSize, columnSize);
				} else if (matrix[i][j]) {
					ctx.fillStyle = '#aaffaa';
					ctx.fillRect(columnSize*j, columnSize*i, columnSize, columnSize);
				}
			}
		}

		ctx.stroke();
	}

	function drawCell(x, y, val) {
		var ctx = canvas.getContext('2d');

		if (val === 3) {
			val = 1;
		} else if (val === 1) {
			val = 2;
		}

		if (matrix[y][x] === val) {
			matrix[y][x] = 0;
		} else {

			matrix[y][x] = val;
		}
		that.draw();
	}

	$(canvas).on('mousedown', function(event) {
		event.preventDefault();
		rect = canvas.getBoundingClientRect();
		var x = Math.floor((event.pageX - rect.left) / columnSize);
		var y = Math.floor((event.pageY - rect.top) / columnSize);
		drawCell(x, y, parseInt(event.which));
	});

	$(canvas).on('contextmenu', function(event) {
		return false;
	})
}

// Random number between min - max
function randomRange(min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

function createEtui() {
	var canvas = document.getElementById('etui');
	var columns = parseInt($('#columns-input').val());
	var spikes = parseInt($('#spikes-input').val());

	var etui = new Etui(canvas, columns, spikes);
	etui.draw();
}

function addOptions() {
	var columns = 10;
	var spikes = Math.pow(columns, 2);
	var $option;

	$columns = $('#columns-input');
	$spikes = $('#spikes-input');

	for (i = 0; i < 10; i++) {
		$option = $('<option>');
		$option.text(i+1).appendTo($columns);
		if (i === 5) {
			$option.prop('selected', true);
		}
	}

	for (i = 0; i <= spikes; i++) {
		$option = $('<option>');
		$option.text(i).appendTo($spikes);
		if (i === 2) {
			$option.prop('selected', true);
		}
	}
}

$(function() {
	addOptions();

	$('#columns-input, #spikes-input').on('change', function(event) {
		createEtui();
	});


	$('#create-etui-button').on('click', function(event) {
		event.preventDefault();
		createEtui();
	});

	createEtui();
});