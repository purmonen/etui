function Etui(canvas, n, spikes) {

	var matrix = [];
	var i;
	var x, y;
	var that = this;
	var ctx = canvas.getContext('2d');

	var currentY = null;
	var currentX = null;

	var start = true;
	var direction = null;

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


	var matrixY = matrix.length; 
	var matrixX = matrix[0].length;


	this.draw = function() {

		var x = matrixX;
		var y = matrixY;

		canvas.width = columnSize * x;
		canvas.height = columnSize * y;

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

		var colors = ['#fff', '#000', '#77ff77', '#ccffcc'];
		// Spikes
		for (i = 0; i < y; i++) {
			for (j = 0; j < x; j++) {
				ctx.moveTo(columnSize*j, columnSize*i);
				cell = matrix[i][j];
				if (cell > 0) {
					ctx.fillStyle = colors[cell];
					ctx.fillRect(columnSize*j, columnSize*i, columnSize, columnSize);
				}
				if (cell === 2 && (j !== currentX || i !== currentY)) {
					ctx.font = 'bold 32px sans-serif';
					ctx.fillStyle = '#000';
					ctx.fillText('-', j*columnSize + columnSize / 4, i*columnSize + 3 * columnSize / 4);
				}
			}
		}

		ctx.stroke();
		ctx.font = 'bold 32px sans-serif';
		if (currentX !== null && !start) {
			ctx.fillStyle = '#000';
			ctx.fillText('O', currentX*columnSize + columnSize / 4, currentY*columnSize + 3 * columnSize / 4);
		}
	}


	function cleanMatrix() {
		var cell;
		for (i = 0; i < matrixY; i++) {
			for (j = 0; j < matrixX; j++) {
				cell = matrix[i][j];
				if (cell === 3 || (start && cell == 2)) {
					matrix[i][j] = 0;
				}
			}
		}
	}

	this.restart = function() {
		var i;
		start = true;
		for (i = 0; i < matrixY; i++) {
			for (j = 0; j < matrixX; j++) {
				cell = matrix[i][j];
				if (cell > 1) {
					matrix[i][j] = 0;
				}
			}
		}
		currentX = null;
		currentY = null;
		this.draw();
	}

	function manipulateCell(x, y, val) {
		var cell = matrix[y][x];

		switch (val) {
		case 1:
			if (cell === 1) {
				matrix[y][x] = 0;
			} else if (cell === 0) {
				matrix[y][x] = 1;
			}
			if (!start) {
				left(currentX, currentY, 3, 3);
				right(currentX, currentY, 3, 3);
				down();
			}
			break;
		case 2:
			if (start) {
				if (cell === 1) {
					break;
				}
				if (cell === 3) {
					start = false;

					cleanMatrix();
					if (currentX < x) {
						right(currentX, currentY, 2, 2);
						currentX += 2;
						direction = 'right';
					} else {
						left(currentX, currentY, 2, 2);
						currentX -= 2;
						direction = 'left';
					}
					left(currentX, currentY, 3, 3);
					right(currentX, currentY, 3, 3);
					down();
				}
				if (cell === 0) {
					cleanMatrix();
					currentX = x;
					currentY = y;
					matrix[y][x] = 2;

					left(x, y, 2, 3);
					right(x, y, 2, 3);
				}
			} else {
				if (cell === 3) {
					console.log('here we are')
					cleanMatrix();
					if (currentY < y) {
						currentY = y;
						if (direction === 'right') {
							currentX += 1;
							direction = 'left';
						} else {
							currentX -= 1;
							direction = 'right';
						}
					}
					if (currentX < x) {
						right(currentX, currentY, 3, 2);
						currentX += 3;
					} else {
						left(currentX, currentY, 3, 2);
						currentX -= 3;
					}
					left(currentX, currentY, 3, 3);
					right(currentX, currentY, 3, 3);
					down();
				}
			}
			break;
		}
		console.log(currentX);
		console.log(currentY);
		that.draw();
	}

	function down() {
		if (currentY + 1 < matrixY) {
			if (direction === 'right') {
				left(currentX+1, currentY+1, 3, 3);
			} else {
				right(currentX-1, currentY+1, 3, 3);
			}
		}
	}

	function left(x, y, steps, val) {
		works = true;
		for (i = 1; i <= steps; i++) {
			if (x - i < 0) {
				works = false;
				break
			} 
			if (matrix[y][x-i] !== 0) {
				works = false;
				break;
			}
		}
		if (works) {
			for (i = 1; i <= steps; i++) {
				matrix[y][x-i] = val;
			}
		}
	}

	function right(x, y, steps, val) {
		works = true;
		for (i = 1; i <= steps; i++) {
			if (x + i >= matrixX) {
				return;
			} 
			if (matrix[y][x+i] !== 0) {
				return;
			}
		}
		for (i = 1; i <= steps; i++) {
			matrix[y][x+i] = val;
		}
	}

	$(canvas).on('mousedown', function(event) {
		event.preventDefault();
		rect = canvas.getBoundingClientRect();
		var x = Math.floor((event.clientX - rect.left) / columnSize);
		var y = Math.floor((event.clientY - rect.top) / columnSize);


		button = parseInt(event.which);
		if (button === 3) {
			val = 1;
		} else if (button === 1) {
			val = 2;
		}

		manipulateCell(x, y, val);
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
	var canvas = document.createElement('canvas');
	var columns = parseInt($('#columns-input').val());
	var spikes = parseInt($('#spikes-input').val());

	var etui = new Etui(canvas, columns, spikes);
	$('#etui').empty().append(canvas);


	$('#restart-button').on('click', function(event) {
		event.preventDefault();
		etui.restart();
	});

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