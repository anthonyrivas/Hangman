var game = {
	words: [],
	totalWords: null,
	getTotalWords: function () { return this.words.length },
	progressBar: null,
	guessedWords: [],
	guessedWordsContainer: null,
	letters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
	wins: 0,
	winContainer: null,
	losses: 0,
	lossContainer: null,
	remainingGuesses: 5,
	remainingContainer: null,
	complete: false,
	word: "",
	correct: [],
	wordContainer: null,
	incorrect: [],
	incorrectContainer: null,
	guessedLetters: [],
	start: function () {
		if (this.words.length !== 0) {
			this.progressBar = document.getElementById("progressBar");
			this.word = this.words[Math.floor(Math.random() * this.words.length)];
			this.correct = [];
			this.wordContainer = document.getElementById("word");
			this.incorrect = [];
			this.incorrectContainer = document.getElementById("letterContainer");
			this.remainingGuesses = 12;
			this.remainingContainer = document.getElementById("guessCounter");
			this.remainingContainer.textContent = this.remainingGuesses;
			this.guessedLetters = [];
			this.splitWord = [];
			this.winContainer = document.getElementById("winCounter");
			this.lossContainer = document.getElementById("lossCounter");
			this.guessedWordsContainer = document.getElementById('guessedWords');
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
		this.remainingContainer.textContent = this.remainingGuesses;
	},
	updateWins: function () {
		this.winContainer.textContent = this.wins;
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
		this.lossContainer.textContent = this.losses;
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
window.onload = function () {
	game.makeButtons();
	var para = "You can put any paragraph of text copied from the internet here. This will replace all non-letter and space characters with nothing, and change all letters to lowercase. Then it will split the string on spaces, check for duplicates and words smaller than 3 characters, and store that as 'listOfWords'.";
	game.words = game.generateWordList(para);
	game.totalWords = game.getTotalWords();
	game.start();
	document.onkeyup = function (e) {
		var choice = e.key;
		game.letterChosen(choice);
	}
}
