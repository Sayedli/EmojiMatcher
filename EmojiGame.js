/* TCSS 460 - Assignment 2 
   Author: Hassan Ali
   Emoji Matching Game */

   $(document).ready(function () {
    const emojis = ['🤡', '😂', '😎', '🦁', '🚀', '🌍', '👽', '🤯'];
    let tiles = [...emojis, ...emojis]; // Duplicate emojis for matching pairs
    let flippedTiles = []; // Track flipped tiles
    let matchedTiles = []; // Track matched tiles
    let moves = 0; // Move counter
    let timer; // Timer for the game
    let time = 0; // Track time in seconds
    let firstClick = false; // Track first click to start the timer

    // Function to shuffle the array using Fisher-Yates algorithm
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to start the game timer
    function startTimer() {
        timer = setInterval(function () {
            time++;
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            if (seconds < 10) seconds = '0' + seconds;
            $('#timer').text(`${minutes}:${seconds}`);
        }, 1000);
    }

    // Function to reset the game
    function resetGame() {
        moves = 0;
        time = 0;
        firstClick = false;
        clearInterval(timer);
        $('#move-counter').text(moves);
        $('#timer').text('0:00');
        $('#game-board').empty();
        shuffledTiles = shuffle(tiles);
        flippedTiles = [];
        matchedTiles = [];
        shuffledTiles.forEach((emoji, index) => {
            $('#game-board').append(`<div class="tile" data-id="${index}" data-emoji="${emoji}"></div>`);
        });
    }

    // Function to handle tile flipping
    function flipTile(tile) {
        if (!firstClick) {
            startTimer();
            firstClick = true;
        }

        if (flippedTiles.length < 2 && !$(tile).hasClass('flipped') && !$(tile).hasClass('matched')) {
            $(tile).addClass('flipped').text($(tile).data('emoji'));
            flippedTiles.push(tile);

            if (flippedTiles.length === 2) {
                moves++;
                $('#move-counter').text(moves);
                if ($(flippedTiles[0]).data('emoji') === $(flippedTiles[1]).data('emoji')) {
                    $(flippedTiles[0]).addClass('matched');
                    $(flippedTiles[1]).addClass('matched');
                    matchedTiles.push(...flippedTiles);
                    flippedTiles = [];
                    if (matchedTiles.length === tiles.length) {
                        clearInterval(timer);
                        showWinMessage();
                    }
                } else {
                    setTimeout(() => {
                        $(flippedTiles[0]).removeClass('flipped').text('');
                        $(flippedTiles[1]).removeClass('flipped').text('');
                        flippedTiles = [];
                    }, 1000);
                }
            }
        }
    }

    // Function to display the winning message
    function showWinMessage() {
        $('#final-moves').text(moves);
        $('#final-time').text($('#timer').text());
        $('#win-message').fadeIn();
        startConfetti();
    }

    // Function to start the confetti effect
    function startConfetti() {
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            const timeLeft = end - Date.now();
            if (timeLeft <= 0) {
                return;
            }
            confetti({
                particleCount: 50,
                startVelocity: 30,
                spread: 360,
                origin: {
                    x: Math.random(),
                    y: Math.random() - 0.2
                }
            });
            requestAnimationFrame(frame);
        }());
    }

    // Event listener for tile clicks
    $('#game-board').on('click', '.tile', function () {
        flipTile(this);
    });

    // Event listener for restart button
    $('#restart-button').click(function () {
        resetGame();
        $('#win-message').hide();
    });

    // Event listener for close button in win message
    $('#close-button').click(function () {
        $('#win-message').hide();
    });

    // Initialize the game on page load
    resetGame();
});
