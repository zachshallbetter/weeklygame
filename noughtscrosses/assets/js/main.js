function TTT() {
    this.canvas = document.getElementById('ttt');
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this.square = 100;
    this.boxes = [];
    this.board = [];
    this.win = '012'+'345'+'678'+'246'+'036'+'147'+'258'+'048';
    this.start = Math.random() < 0.5 ? -1 : 1;
    this.turn = this.start;
    this.cpu = (this.turn === 1) ? -1 : 1;
    
    this.image = {
        nought : '//weeklygame.zachshallbetter.com/noughtscrosses/assets/img/naught.png',
        cross : '//weeklygame.zachshallbetter.com/noughtscrosses/assets/img/cross.png'
    };
    
    this.message = $('.message');
}

var ttt = new TTT(),
    image;

// Get the current player
TTT.prototype.currentPlayer = function() {
    var symbol = (this.turn === 1) ? 'O' : 'X';
    ttt.message.html('It is ' + symbol + '\'s turn');
};

// Draw the board
TTT.prototype.draw = function(callback) {
    // Draw Grid
    for(var row = 0; row <= 200; row += 100) {
        var group = [];
        for(var column = 0; column <= 200; column += 100) {
            group.push(column);
            this.context.strokeStyle = 'white';
            this.context.strokeRect(column,row,this.square,this.square);
        }
        this.boxes.push(group);
    }
    
    return callback;
};

TTT.prototype.checkBox = function(e) {
    var cordinates = ttt.cordinates(e),
        x = cordinates[0],
        y = cordinates[1],
        boardEntry = ttt.board[Math.floor(y / 100)][Math.floor(x / 100)];
    
    if (boardEntry === 0) {
        boardEntry = ttt.turn;
        ttt.setEntry(x, y);
    }
};

// Get center of the click area cordinates
TTT.prototype.cordinates = function(e) {
    var row = Math.floor(e.clientX / 100) * 100,
        column = Math.floor(e.clientY / 100) * 100;
    
    return [row, column];
};

// Set the entry 
TTT.prototype.setEntry = function(row, column) {

    if (ttt.turn === 1) {
        image.src = ttt.image.nought;
        ttt.turn = -1;
    } else {
        image.src = ttt.image.cross;
        ttt.turn = 1;
    }

    var arrayRow = Math.floor(column / 100),
        arrayColumn = Math.floor(row / 100);

    ttt.board[arrayRow][arrayColumn] = ttt.turn;
    ttt.context.drawImage(image, row + 100 / 2 - (image.width / 2), column + 100 / 2 - (image.height / 2));

    // Check if there is a winner
    ttt.winner();
    
    // Display the next player
    ttt.currentPlayer();

    console.log(ttt.turn);
};

TTT.prototype.ai = function() {

    if (ttt.turn !== ttt.cpu) {
        return;
    }

    var check = [];
    /*

        if the player has made his turn
            run through winning combinations
            find winning combination that contains a zero
            
            DEFENSIVE MODE
            if the winning combination has more than one cpu
                add symbol to empty space
                store that combination
            otherwise
                randomly choose a space with a zero
            
            OFFENSIVE MODE
            if the winning combination has more than one player
                add symbol to empty space
                store that combination
            otherwise
                randomly chose a space with a zero
    */

    // Check winner box
    for(var l = 0; l <= 23; l += 3) {
        // Get the winning array
        var slices = Array.prototype.slice.call(ttt.win, l, l + 3);
        console.log(slices);

        // Take the winning array and sort so empty spaces are in the front
        check.push([ttt.boxes[parseInt(slices[0], 0)],ttt.boxes[parseInt(slices[1], 0)],ttt.boxes[parseInt(slices[2], 0)]].sort());
    }

    // Loop through all of the winning array
    for(var k = 0; k <= 7; k+=1) {

        console.log(k);
        
        // If a negative number (O) is in the front push it to the end
        if (check[k][0] === -1) {
            var move = check[k].shift();
            check[k][2] = move;
        }

        if (ttt.turn === ttt.start) {
            ttt.setEntry(0, 2, 'random');
        }
        // Check if the winning combination has a pair of open spaces 
        else if (check[k][0] === 0 && check[k][1] === 0 && check[k][0] === check[k][1]) {
            console.log('open');
            // Check to see if the full spot has it's symbol


        // Check if it has a single space available
        } else if (check[k][0] === 0) {
            console.log('possibility');
            // Check to see if the full spots have it's symbols (compare it's value);

        //Nothing is available at all
        } else {
            console.log('closed');
        }

        console.log(check[k]);
    }
    
    console.log('-------------');

    // function set(row, column, state) {
    //     if (state === 'random') {
    //         ttt.setEntry(row, column);
    //     } else {
    //         ttt.setEntry(row, column);
    //     }
    // }

};

// Check if the clicked box has symbol
TTT.prototype.winner = function() {

    // Set winner from board to winner box
    for(var j = 0; j <= 2; j++) {

        for(var k = 0; k <= 2; k++) {

            if (j === 2) {
                ttt.boxes[6 + k] = ttt.board[j][k];
            } else if (j === 1) {
                ttt.boxes[3 + k] = ttt.board[j][k];
            } else {
                ttt.boxes[k] = ttt.board[j][k];
            }
        }
    }

    // Check winner box
    for(var l = 0; l <= 23; l += 3) {
        var slices = Array.prototype.slice.call(ttt.win, l, l + 3),
            check = ttt.boxes[parseInt(slices[0], 0)] + ttt.boxes[parseInt(slices[1], 0)] + ttt.boxes[parseInt(slices[2], 0)] % 3;

        if (check === 3 ) {
            console.log('x wins');
            ttt.message.html('x wins');
            $('#ttt').off('click');
        } else if (check === -3) {
            console.log('o wins');
            ttt.message.html('o wins');
            $('#ttt').off('click');
        }
    }

    // Check for cat game
    if ($.inArray( 0, ttt.boxes ) === -1) {
        console.log('cat game!');
        $('#ttt').off('click');
    }

    ttt.ai();
};

TTT.prototype.reset = function() {

    // Clear canvas
    ttt.context.clearRect(0, 0, ttt.width, ttt.height);
    render();
};

function render() {
    ttt.draw($('#ttt').on("click", ttt.checkBox));
    $('.reset').on("click", ttt.reset);

    // Set data to zero
    ttt.boxes = [0,0,0,0,0,0,0,0,0];
    ttt.board = [[0,0,0],[0,0,0],[0,0,0]];

    // Run current player
    ttt.currentPlayer();

    console.log('player: ' + ttt.turn);
    console.log('cpu: ' + ttt.cpu);
}

(function init() {
    // Handle preloading images;
    var preload = [ttt.image.nought, ttt.image.cross];

    for (var i = 0; i < preload.length; i++) {
        image = new Image();
        image.src = preload[i];
    }

    render();
})();