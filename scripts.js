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

	longChain = {};

	this.longestChain = function() {
		var startTime = new Date().getTime();
		var right;
		var left;
		var j;
		var i;
		var path;

		max = [];
		n = matrix.length;
		calls = 0;

		cleanMatrix(true);

		for (i = 0; i < n; i++) {

			// It's not possible to find a longer chain starting on this row
			if (max.length >= Math.floor(n / 3) * (n - i)) {
				break;
			}

			for (j = 0; j < n; j++) {
				right = maxChain2(matrix, j, i, 1);
				left = maxChain2(matrix, j, i, -1);
				longest = left.length > right.length ? left : right;
				if (longest.length > max.length) {
					maxI = i;
					maxJ = j;
					max = longest;
					path = max;
				}
			}
		}

		var x;
		var y;
		var d;
		var i;
		d = path[0];

		chain = [];

		currentX = maxJ-d;
		currentY = maxI;

		take(d);

		for (i = 1; i < path.length; i++) {
			d = path[i];
			if (d !== path[i-1]) {
				currentY += 1;
				currentX -= d;
			}
			take(d);
		}
		start = false;

		this.draw();
		console.log(new Date().getTime() - startTime);
		console.log('Calls: ' + calls);
		return 'Max: ' + max + ', Row: ' + maxI + ' Col: ' + maxJ;
	}

	m = matrix;

    maxMap = {};
	function maxChain(matrix, x, y, d) {
	    //maxMap = {};

		var key = [x, y, d];
		var currentRow;
		var nextRow;
		var val;
		calls += 1;
		if (!(key in maxMap)) {

			// Check matrix boundaries
			if (x + 2 * d < 0 || x + 2 * d >= matrix.length) {
				val = 0;
			} else if (matrix[y][x] === 1 || matrix[y][x+d] === 1 || matrix[y][x+2*d] === 1) { // Watch out for spikes
				val = 0;
			} else { // We made 1 one more link
				currentRow = maxChain(matrix, x+3*d, y, d);
				nextRow = 0;
				if (y + 1 < matrix.length) {
					nextRow = maxChain(matrix, x+2*d, y+1, -d);
				}
				val = 1 + Math.max(currentRow, nextRow);
			}
			maxMap[key] = val;
		}


		return maxMap[key];
	}



    maxMap2 = {};
	function maxChain2(matrix, x, y, d) {
	    //maxMap = {};

		var key = [x, y, d];
		var currentRow;
		var nextRow;
		var add;
		var val;
		calls += 1;
		var path = [];
		if (!(key in maxMap2)) {

			// Check matrix boundaries
			if (x + 2 * d < 0 || x + 2 * d >= matrix.length) {
				val = 0;
			} else if (matrix[y][x] === 1 || matrix[y][x+d] === 1 || matrix[y][x+2*d] === 1) { // Watch out for spikes
				val = 0;
			} else { // We made 1 one more link
				currentRow = maxChain2(matrix, x+3*d, y, d);
				nextRow = [];
				if (y + 1 < matrix.length) {
					nextRow = maxChain2(matrix, x+2*d, y+1, -d);
				}

				path.push(d);
				add = nextRow.length > currentRow.length ? nextRow : currentRow;
				for (i = 0; i < add.length; i++) {
					path.push(add[i]);
				}
			}
			maxMap2[key] = path;
		}
		return maxMap2[key];
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

		var colors = ['#fff', '#000', '#77ff77', '#ccffcc', '#77ff77', '#77ff77'];
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
					ctx.font = 'bold 16px sans-serif';
					ctx.fillStyle = '#000';
					ctx.fillText('-', j*columnSize + 20, i*columnSize + 30);
				}
				if (cell === 4 && (j !== currentX || i !== currentY)) {
					ctx.font = 'bold 10px sans-serif';
					ctx.fillStyle = '#000';
					ctx.fillText('O', j*columnSize + 20, i*columnSize + 30);
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


	function cleanMatrix(all) {
		var cell;
		for (i = 0; i < matrixY; i++) {
			for (j = 0; j < matrixX; j++) {
				cell = matrix[i][j];
				if (cell === 3 || ((start || all) && (cell == 2 || cell == 4))) {
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
		chain = [];
		$('#info').text('Length: ' + chain.length / 3);

	}

	chain = [];

	function manipulateCell(x, y, val) {
		var cell = matrix[y][x];

		switch (val) {
		case 1:
			if (cell === 1) {
				matrix[y][x] = 0;
			} else if (cell === 0) {
				matrix[y][x] = 1;
			}
			maxMap = {};
			maxMap2 = {};
			if (!start) {
				search();
			}
			break;
		case 2:
			if (start) {
				if (cell === 3) {
					start = false;
					cleanMatrix();
					direction = currentX < x ? 1 : -1;
					startTake(direction);
					search();
				}
				if (cell === 0) {
					cleanMatrix();
					currentX = x;
					currentY = y;
					matrix[y][x] = 2;
					startSearch(x, y);
				}
			} else {
				if (cell === 3) {
					cleanMatrix();
					if (currentY < y) {
						currentY = y;
						currentX += direction;
					}
					direction = currentX < x ? 1 : -1;
					take(direction);
					search();
				} else if (cell == 2 || cell == 4 || cell == 5) {
					back();
				}
			}
			break;
		}
		that.draw();
	}

	c = chain;
	function take(d) {
		walk(currentX, currentY, 2, 2, d);
		walk(currentX+2*d, currentY, 1, 4, d);
		for (i = 1; i <= 3; i++) {
			chain.push({x: currentX+i*d, y: currentY, d: d});
		}
		currentX += 3*d;
		$('#info').text('Length: ' + chain.length / 3);
	}

	function back() {
		for (i = 0; i < 3; i++) {
			last = chain.pop();
			matrix[last.y][last.x] = 0;
		}
		last = chain[chain.length-1];
		if (last) {
			currentX = last.x;
			currentY = last.y;
			direction = last.d;
			cleanMatrix();
			search(currentX, currentY, direction);
		} else {
			start = true;
			cleanMatrix();
		
		}
		$('#info').text('Length: ' + chain.length / 3);

	}

	function search() {
		walk(currentX, currentY, 3, 3, 1);
		walk(currentX, currentY, 3, 3, -1);
		if (currentY + 1 < matrixY) {
			walk(currentX+direction, currentY+1, 3, 3, -direction);
		}
	}

	function startSearch(x, y) {
		walk(x, y, 2, 3, 1);
		walk(x, y, 2, 3, -1);
	}

	function startTake(d) {
		for (i = 0; i < 3; i++) {
			chain.push({x: currentX+i*d, y: currentY, d: d});
		}
		walk(currentX, currentY, 1, 2, d);
		walk(currentX+d, currentY, 1, 4, d);
		currentX += 2*d;
		$('#info').text('Length: ' + chain.length / 3);
	}

	function walk(x, y, steps, val, d) {
		var i;
		for (i = 1; i <= steps; i++) {
			if (x + d * i < 0 || x + d * i >= matrix.length) {
				return false;
			} 
			if (val === 3 && matrix[y][x+d*i] !== 0) {
				return false;
			}
		}
		for (i = 1; i <= steps; i++) {
			matrix[y][x+d*i] = val;
		}
		return true
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

	etui = new Etui(canvas, columns, spikes);
	//$('#info').text(etui.longestChain());
	$('#etui').empty().append(canvas);


	$('#restart-button').on('click', function(event) {
		event.preventDefault();
		etui.restart();
	});
	$('#solve-button').on('click', function(event) {
		event.preventDefault();
		etui.longestChain();
	});
	etui.draw();
}

function addOptions() {
	var columns = 120;
	var spikes = 40;
	var $option;

	$columns = $('#columns-input');
	$spikes = $('#spikes-input');

	for (i = 0; i < columns; i++) {
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