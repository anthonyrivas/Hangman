window.onload = function () {
	// Creating our primary game object. This object contains the entirety of the game and all of its methods.
	var game = {
		words: [],
		totalWords: null,
		getTotalWords: function () { return this.words.length },
		progressBar: document.getElementById("progressBar"),
		guessedWords: [],
		guessedWordsContainer: document.getElementById('guessedWords'),
		letters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
		wins: 0,
		winContainer: document.getElementById("winCounter"),
		losses: 0,
		lossContainer: document.getElementById("lossCounter"),
		remainingGuesses: 12,
		remainingContainer: document.getElementById("guessCounter"),
		complete: false,
		word: "",
		correct: [],
		wordContainer: document.getElementById("word"),
		incorrect: [],
		incorrectContainer: document.getElementById("letterContainer"),
		guessedLetters: [],
		start: function () {
			if (this.words.length !== 0) {
				this.word = this.words[Math.floor(Math.random() * this.words.length)];
				this.correct = [];
				this.incorrect = [];
				this.remainingGuesses = 12;
				this.remainingContainer.textContent = this.remainingGuesses.toString();
				this.guessedLetters = [];
				this.splitWord = [];
				this.createArrayFromString();
				this.correctGuessUpdate();
				this.incorrectGuessUpdate();
				this.updateProgress();
			} else {
				var credits = "You have defeated all of the words in the game. Well played!<br>Total Wins: " + this.wins + "<br>Total Losses: " + this.losses + "<br>Guessed Words: ";
				for (var i = 0; i < this.guessedWords.length; i++) {
					credits = credits + "<br>" + this.guessedWords[i];
				}
				document.getElementById('game').innerHTML = credits
			}
		},
		createArrayFromString: function () {
			for (var i = 0; i < this.word.length; i++) {
				if (this.splitWord.indexOf(this.word.charAt(i)) == -1) {
					this.splitWord.push(this.word.charAt(i));
				}
			}
		},
		checkValidGuess: function (guess) {
			guess = guess.toLowerCase();
			if (this.letters.indexOf(guess) !== -1 && this.guessedLetters.indexOf(guess) === -1) {
				return true;
			} else {
				return false;
			}
		},
		guess: function (guess) {
			this.guessedLetters.push(guess);
			if (this.splitWord.indexOf(guess) !== -1) {
				this.correct.push(guess);
				this.correctGuessUpdate();
			} else {
				this.incorrect.push(guess);
				this.incorrectGuessUpdate();
				this.remainingGuesses--;
			}
			this.updateRemainingGuesses();
			if (this.correct.length === this.splitWord.length) {
				this.wins++;
				this.updateWins();
				this.start();
			}
			if (this.remainingGuesses === 0) {
				this.losses++;
				this.updateLosses();
				this.start();
			}
		},
		correctGuessUpdate: function () {
			var wordDisplay = ""
			for (var i = 0; i < this.word.length; i++) {
				if (this.correct.indexOf(this.word.charAt(i)) !== -1) {
					wordDisplay = wordDisplay + this.word.charAt(i) + " "
				} else {
					wordDisplay = wordDisplay + "_ "
				}
			}
			this.wordContainer.textContent = wordDisplay;
		},
		incorrectGuessUpdate: function () {
			this.incorrectContainer.textContent = this.incorrect.join(", ");
		},
		updateRemainingGuesses: function () {
			this.remainingContainer.textContent = this.remainingGuesses.toString();
		},
		updateWins: function () {
			this.winContainer.textContent = this.wins.toString();
			var index = this.words.indexOf(this.word);
			this.guessedWords.push(this.word);
			var newDiv = document.createElement("div");
			newDiv.setAttribute("class", "guessedWord");
			newDiv.textContent = this.word;
			this.guessedWordsContainer.appendChild(newDiv);
			if (index !== -1) {
				this.words.splice(index, 1);
			}
		},
		updateLosses: function () {
			this.lossContainer.textContent = this.losses.toString();
		},
		updateProgress: function () {
			this.progressBar.textContent = this.guessedWords.length + " / " + this.totalWords + " Words Guessed";
		},
		makeButtons: function () {
			for (var i = 0; i < this.letters.length; i++) {
				var button = document.createElement("button");
				button.setAttribute("class", "button");
				button.setAttribute("data-letter", game.letters[i]);
				button.textContent = game.letters[i];
				document.getElementById("buttons").appendChild(button);
			}

			var buttonArr = document.getElementsByClassName("button");
			for (var i = 0; i < buttonArr.length; i++) {
				buttonArr[i].onclick = function () {
					game.letterChosen(this.getAttribute("data-letter"));
				}
			}
		},
		letterChosen: function (choice) {
			var isValidGuess = game.checkValidGuess(choice);
			if (isValidGuess) {
				game.guess(choice);
			}
		},
		generateWordList: function (para) {
			var listOfWords = para.replace(/[^A-Za-z\s]+/g, '').toLowerCase().split(" ").filter(function (item, pos, self) {
				return self.indexOf(item) == pos && item.length > 2;
			});
			return listOfWords;
		}
	}

	// Initialize the game for the first time.

	//Create a button on the page for each letter
	game.makeButtons();
	//This paragraph will be broken in to a list of unique words to be used in the game using the game.generateWordList() function.
	var para = "You can put any paragraph of text copied from the internet here. This will replace all non-letter and space characters with nothing, and change all letters to lowercase. Then it will split the string on spaces, check for duplicates and words smaller than 3 characters, and store that as 'listOfWords'.";
	game.words = game.generateWordList(para);
	//Get a count of the number of words in the game.
	game.totalWords = game.getTotalWords();
	//Choose a word and ensure all initial game properties are set properly. 
	game.start();
	//Check for keypress and  begin playing using it.
	document.onkeyup = function (e) {
		var choice = e.key;
		game.letterChosen(choice);
	}
}
