/*
+----------------+
| CODE DIRECTORY |
+----------------+

>> INITIALIZATION
>> GENERAL FUNCTIONS
>> NAVIGATION BAR
>> STACK PAGE
>> CARD PAGE
>> STUDY PAGE
*/

/*
+----------------+
| INITIALIZATION |
+----------------+
*/

// //----- TEMPLATES -----//
const templates = document.querySelector('template').content.children;

// //----- NAVIGATION -----//
const nav = document.querySelector('.nav__breadcrumbs'),
	breadCrumbs = Array.from(nav.children);

// //----- PAGES -----//
const stackPage = document.querySelector('#stack-page'),
	cardPage = document.querySelector('#card-page'),
	studyPage = document.querySelector('#study-page'),
	pages = {
		stack: stackPage,
		card: cardPage,
		study: studyPage,
	},
	pageArr = Object.keys(pages); // for animations

// //----- STACK SECTION -----//
const addStackbtn = stackPage.querySelector('.stack-add'),
	saveStackbtn = stackPage.querySelector('.save'),
	cancelStackbtn = stackPage.querySelector('.cancel'),
	addStackField = stackPage.querySelector('.stack-name'),
	stackInput = stackPage.querySelector('#stack-name'),
	stackContainer = stackPage.querySelector('.stack-grid').childNodes[1].childNodes[1],
	searchStack = stackPage.querySelector('.search-bar');

// //----- CARD SECTION -----//
const cardOptions = cardPage.querySelector('.card__options'),
	cardGrid = cardPage.querySelector('.card-grid'),
	deleteStack = document.querySelector('.header').children[2],
	cardPageTitle = document.querySelector('.header').children[0],
	editStackNameField = cardPage.querySelector('.stack__edit'),
	cardHeader = cardPage.querySelector('.header'),
	newStackNameField = cardPage.querySelector('[name="stack-name"]');

// //----- STUDY SECTION -----//
const studyCard = studyPage.querySelector('.study__card'),
	studyBtn = studyPage.querySelector('.study__btn'),
	cardCountDisplay = studyPage.querySelectorAll('.study__timer span')[0],
	studyTimer = studyPage.querySelectorAll('.study__timer span')[1];

// //----- DATA -----//
const stacks = JSON.parse(localStorage.getItem('stacks')) || {};

// //----- FLAGS -----//
let currStackName = 'Science',
	currStack = stacks[currStackName],
	currPage = 'stack';

// //----- INITIAL FUNCTION CALLS -----//
hidePages();
loadButtons(stacks);
changePage(currPage);
updateBreadCrumbs();
loadServiceWorker();
/*
+-------------------+
| GENERAL FUNCTIONS |
+-------------------+
*/

// SERVICE WORKER
function loadServiceWorker() {
	if ('serviceWorker' in navigator) {
		// register service worker
		navigator.serviceWorker.register('service-worker.js');
	}
}

// PERFORMANCE TEST
function testPerformance(n = 0) {
	console.time(`Adding ${n} cards`);
	for (let i = 0; i < n; i++) {
		addCard({
			id: i,
			front: `TEST NUMBER ${i} THIS IS THE FRONT HELLO WORLD I AM A TEST`,
			back: `TEST NUMBER ${i} THIS IS THE BACK HELLO WORLD I AM A TEST`,
		});
	}
	console.timeEnd(`Adding ${n} cards`);
}

// GENERATE TEST DATA
function createTestData() {
	const testData = {
		'Math': {
			'lastID': 10,
			'cards': [
				{ 'id': 1, 'front': '1+1', 'back': '2' },
				{ 'id': 2, 'front': '2+2', 'back': '4' },
				{ 'id': 3, 'front': '3+3', 'back': '6' },
				{ 'id': 4, 'front': '4+4', 'back': '8' },
				{ 'id': 5, 'front': '5+5', 'back': '10' },
				{ 'id': 6, 'front': '6+6', 'back': '12' },
				{ 'id': 7, 'front': '7+7', 'back': '14' },
				{ 'id': 8, 'front': '8+8', 'back': '16' },
				{ 'id': 9, 'front': '9+9', 'back': '18' },
				{ 'id': 10, 'front': '10+10', 'back': '20' },
			],
		},
		'Science': {
			'lastID': 3,
			'cards': [
				{ 'id': 1, 'front': 'different organs of the body that work together to accomplish a function', 'back': 'organ system' },
				{ 'id': 2, 'front': 'the number of major organ systems that make the human body function', 'back': '11' },
				{ 'id': 3, 'front': 'the organ system that moves blood through the body', 'back': 'circulatory system' },
			],
		},
		'Javascript': {
			'lastID': 10,
			'cards': [
				{ 'id': 1, 'front': 'Inside which HTML element do we put the JavaScript?\n\n<script>\n<javascript>\n<scripting>\n<js>', 'back': '<script>' },
				{ 'id': 2, 'front': 'The external JavaScript file must contain the <script> tag. True or False?', 'back': 'False' },
				{ 'id': 3, 'front': 'How can you add a comment in a JavaScript?', 'back': '//This is a comment' },
				{ 'id': 4, 'front': 'How to insert a comment that has more than one line?', 'back': '/*This comment has\nmore than one line*/' },
				{ 'id': 5, 'front': 'How do you round the number 7.25, to the nearest integer?', 'back': 'Math.round(7.25)' },
				{ 'id': 6, 'front': 'How do you find the number with the highest value of x and y?', 'back': 'Math.max(x, y)' },
				{ 'id': 7, 'front': 'JavaScript is the same as Java. True or False?', 'back': 'False' },
				{ 'id': 8, 'front': 'Which event occurs when the user clicks on an HTML element?\n\nonchange\nonmouseover\nonmouseclick\nonclick', 'back': 'onclick' },
				{ 'id': 9, 'front': 'What will the following code return:\n\nBoolean(10 > 9)', 'back': 'true' },
				{ 'id': 10, 'front': 'Is JavaScript case-sensitive?', 'back': 'Yes' },
			],
		},
		'History': {
			'lastID': 3,
			'cards': [
				{ 'id': 1, 'front': 'What year was Kodigo Bootcamp created?', 'back': '2020' },
				{ 'id': 2, 'front': 'What year did the COVID 19 outbreak begin?', 'back': '2019' },
				{ 'id': 3, 'front': 'Who was Charles Babbage?', 'back': 'A mathematician, philosopher, inventor and mechanical engineer, Babbage originated the concept of a digital programmable computer.' },
			],
		},
	};
	for (let data in testData) {
		stacks[data] = testData[data];
	}

	updateStacks();
}

// UPDATE STACKS IN LOCAL STORAGE
function updateStacks() {
	localStorage.setItem('stacks', JSON.stringify(stacks));
}

// CHANGE PAGE
function changePage(nextPage = 'stack') {
	const hidePage = pages[currPage],
		showPage = pages[nextPage],
		currPageDepth = pageArr.indexOf(currPage),
		nextPageDepth = pageArr.indexOf(nextPage);

	// Set direction of animation
	let direction = 'down';
	if (currPageDepth > nextPageDepth) direction = 'right';
	if (currPageDepth < nextPageDepth) direction = 'left';

	// Add animation class to hide page
	hidePage.classList.add(`fade-out-${direction}`);

	// Wait for page to hide
	setTimeout(() => {
		// Hide page from DOM and remove animation class
		hidePage.style.display = 'none';
		hidePage.classList.remove(`fade-out-${direction}`);

		// Show page in DOM and add animation class
		showPage.removeAttribute('style');
		showPage.classList.add(`fade-in-${direction}`);

		// Wait for page to show and remove animation class
		setTimeout(() => {
			showPage.classList.remove(`fade-in-${direction}`);
		}, 200);
	}, 200);

	currPage = nextPage;
}

// UPDATE BREADCRUMBS
function updateBreadCrumbs(toPage) {
	// Index of crumbs to show
	let showIndex = 0;

	// Hide all crumbs
	breadCrumbs.forEach((crumb, i) => (crumb.style.display = 'none'));

	switch (toPage) {
		case 'card':
			showIndex = 2;
			breadCrumbs[2].textContent = currStackName;
			break;
		case 'study':
			showIndex = 4;
			break;
	}

	// Show crumbs up to index n
	for (let i = 0; i <= showIndex; i++) {
		breadCrumbs[i].removeAttribute('style');
	}
}

// HIDE ALL PAGES
function hidePages() {
	for (let page in pages) {
		pages[page].style.display = 'none';
	}
}

/*
+----------------+
| NAVIGATION BAR |
+----------------+
*/

nav.addEventListener('click', (e) => {
	const page = e.target.dataset.page;

	// Change page
	if (page) changePage(page);
});

/*
+-------------+
| STACKS PAGE |
+-------------+
*/

// SEARCH A SPECIFIC STACK USING THE SEARCH FORM
searchStack.addEventListener('keyup', function (e) {
	const term = e.target.value.toLowerCase();
	// PUT STACK BUTTONS IN A VARIABLE
	stackButtons = document.querySelectorAll('.stack-btn');
	Array.from(stackButtons).forEach(function (button) {
		const title = button.textContent;
		if (title.toLowerCase().indexOf(term) != -1) {
			button.parentElement.removeAttribute('style');
		} else {
			button.parentElement.style.display = 'none';
		}
	});
});

// REDIRECT TO THEIR RESPECTIVE CARD PAGE
stackContainer.addEventListener('click', (e) => {
	const parent = e.target.parentElement,
		targetStackName = parent.dataset.stackName;

	// If element clicked has dataset and is therefore a stack button
	if (targetStackName) {
		// Update flags
		currStack = stacks[targetStackName];
		currStackName = targetStackName;

		// Update DOM elements
		cardPageTitle.innerText = targetStackName;
		updateBreadCrumbs('card');

		// Load cards
		loadCards();

		// Change page
		changePage('card');
	}
});

// HIDE INPUT FIELDS BY DEFAULT
addStackField.parentElement.style.display = 'none';
editStackNameField.style.display = 'none';

// HIDE ADD BUTTON AND SHOW INPUT FIELD FOR ADDING A NEW STACK
addStackbtn.addEventListener('click', (e) => {
	const target = e.target;
	target.parentElement.style.display = 'none';
	addStackField.parentElement.style = 'null';
});

// SAVE NEW STACK
saveStackbtn.addEventListener('click', () => {
	const stackInputText = stackInput.value.trim(),
		stackExists = stacks[Object.keys(stacks).find((key) => key.toLowerCase() === stackInputText.toLowerCase())];

	if (stackExists !== undefined) {
		alert('Stack already exists, please enter a different stack name.');
		return 0;
	} else {
		if (stackInputText) {
			stacks[stackInputText] = { lastID: 0, cards: [] };
			// ---update local storage---
			updateStacks();

			// ---create the new button and add to DOM---
			const newStackButton = templates[0].cloneNode(true);
			newStackButton.children[0].textContent = stackInputText;
			newStackButton.dataset.stackName = stackInputText;
			addStackField.parentElement.insertAdjacentElement('afterend', newStackButton);

			// ---hide input field and redisplay add button---
			addStackbtn.parentElement.style = 'null';
			addStackField.parentElement.style.display = 'none';
			// ---reset input value---
			stackInput.value = '';
		}
	}
});

// CANCEL ADDING NEW STACK
cancelStackbtn.addEventListener('click', () => {
	addStackbtn.parentElement.style = 'null';
	addStackField.parentElement.style.display = 'none';
	stackInput.value = '';
});

// FUNCTION FOR PRE-LOADING EXISTING STACK BUTTONS
function loadButtons(stackArray) {
	const oldBtn = Array.from(stackContainer.children);

	// Delete old buttons
	oldBtn.forEach((btn, i) => {
		if (i > 1) btn.remove();
	});

	// Add updated buttons
	Object.keys(stackArray).forEach((key) => {
		const newStackButton = templates[0].cloneNode(true);
		newStackButton.children[0].textContent = key;
		newStackButton.dataset.stackName = key;
		addStackField.parentElement.insertAdjacentElement('afterend', newStackButton);
	});
}

/*
+------------+
| CARDS PAGE |
+------------+
*/

// //----- CARD FUNCTIONS -----//

// ADD EVENT LISTENER TO EDIT STACK NAME / DELETE STACK
cardHeader.addEventListener('click', clickCardHeader);

// FUNCTION FOR CHECKING WHAT TYPE OF BUTTON IS CLICKED (DELETE/RENAME)
function clickCardHeader(e) {
	const target = e.target;
	if (target.className.includes('edit')) {
		cardHeader.style.display = 'none';
		newStackNameField.value = currStackName;
		editStackNameField.removeAttribute('style');
	}
	if (target.className.includes('delete')) {
		let stackToDelete = document.querySelector(`[data-stack-name="${currStackName}"]`);
		stackToDelete.remove();
		delete stacks[currStackName];
		updateStacks();
		alert('Stack successfully deleted');
		updateBreadCrumbs();
		changePage('stack');
	}
}

// SAVE/CANCEL THE STACK NAME CHANGE
editStackNameField.addEventListener('click', editStackName);

// FUNCTION FOR DETERMINING IF THE USER CLICKED SAVE OR CANCEL
function editStackName(e) {
	const target = e.target;

	if (target.className.includes('cancel')) {
		editStackNameField.style.display = 'none';
		cardHeader.removeAttribute('style');
	}

	if (target.className.includes('save')) {
		const newStackName = newStackNameField.value.trim();
		if (newStackName) {
			cardPageTitle.textContent = newStackName;
			renameStack(stacks, currStackName, newStackName);
			updateStacks();
			loadButtons(stacks);
			editStackNameField.style.display = 'none';
			cardHeader.removeAttribute('style');
			newStackNameField.value = '';
			currStackName = newStackName;
			updateBreadCrumbs('card');
		}
	}
}

// FUNCTION FOR DETERMINING WHAT STACK SHOULD BE DELETED FROM LOCALSTORAGE/STACKS OBJECT
function renameStack(obj, fromKey, toKey) {
	obj[toKey] = obj[fromKey];
	if (fromKey != toKey) delete obj[fromKey];
}

// ADD CARD
function addCard(cardObj) {
	// Update local storage
	currStack.cards.push(cardObj);
	updateStacks();

	// Create new card element
	const newCard = templates[2].cloneNode(true);

	newCard.dataset.id = cardObj.id;
	newCard.querySelector('.card__front p').textContent = cardObj.front;
	newCard.querySelector('.card__back p').textContent = cardObj.back;

	// Add Card to DOM
	cardOptions.parentNode.nextElementSibling.insertAdjacentElement('afterend', newCard);
}

// LOAD CARDS
function loadCards() {
	console.time('Loading Time');
	const frag = document.createDocumentFragment(),
		oldCards = Array.from(cardOptions.closest('.row').children),
		newCards = currStack.cards;

	// Delete Old Elements
	oldCards.forEach((element, i) => {
		if (i != 0) element.remove();
		else element.removeAttribute('style');
	});

	// Prepend Each Card to Fragment
	newCards.forEach((card) => {
		const newCard = templates[2].cloneNode(true);

		newCard.dataset.id = card.id;
		newCard.querySelector('.card__front p').textContent = card.front;
		newCard.querySelector('.card__back p').textContent = card.back;

		frag.prepend(newCard);
	});

	// Append Fragment to DOM
	cardOptions.closest('.row').append(frag);
	console.timeEnd('Loading Time');
}

// DELETE CARD
function deleteCard(id) {
	// Find Card to Delete
	const deleteIndex = currStack.cards.findIndex((card) => card.id == id);

	// Delete Card
	currStack.cards.splice(deleteIndex, 1);

	// Update Local Storage
	updateStacks();

	// Remove from DOM
	document.querySelector(`[data-id="${id}"]`).remove();
}

// //----- CARD CLICK EVENT HANDLERS ----//

// HANDLES CLICKS ON ADD, STUDY BUTTONS
function clickOptions(e) {
	const target = e.target;

	// Add Card
	if (target.className.includes('add')) {
		const editCard = templates[1].cloneNode(true);
		editCard.dataset.action = 'add';

		// Show Edit Card
		cardOptions.parentElement.insertAdjacentElement('afterend', editCard);
		cardOptions.parentElement.style.display = 'none';
	}

	// Start "STUDY"
	if (target.className.includes('study')) {
		if (currStack.cards.length) {
			// Update breadcrumbs
			breadCrumbs[4].textContent = 'Study';
			updateBreadCrumbs('study');

			// Set timer off
			isTimed = false;

			// Start study session
			startStudy();

			changePage('study');
		} else {
			alert('There are no cards in this stack');
		}
	}

	if (target.className.includes('timed')) {
		if (currStack.cards.length) {
			// Update breadcrumbs
			breadCrumbs[4].textContent = 'Timed';
			updateBreadCrumbs('study');

			// Set timer on
			isTimed = true;

			// Start timed study session
			startStudy();
			changePage('study');
		} else {
			alert('There are no cards in this stack');
		}
	}
}

// HANDLES CLICKS ON SAVE, CANCEL, EDIT, DELETE BUTTONS
function clickCardGrid(e) {
	const target = e.target;
	// Save Card Button
	if (target.className.includes('save')) {
		const parent = target.closest('.col-12'),
			action = parent.dataset.action,
			frontNode = parent.querySelector('[name="card-front"]'),
			backNode = parent.querySelector('[name="card-back"]'),
			front = frontNode ? frontNode.value.trim() : '',
			back = backNode ? backNode.value.trim() : '';

		// If adding new card
		if (action == 'add' && front && back) {
			const id = ++currStack.lastID;

			// Add Card
			addCard({ id, front, back });

			// Reset Input Fields
			frontNode.value = '';
			backNode.value = '';
		}

		// If editing card
		if (action == 'edit' && front && back) {
			const editedCard = parent.previousElementSibling,
				id = editedCard.dataset.id,
				editItem = currStack.cards.find((card) => card.id == id);

			// Edit Card Object
			editItem.front = front;
			editItem.back = back;

			// Update Local Storage
			updateStacks();

			// Edit DOM Card Contents
			editedCard.querySelector('.card__front p').textContent = front;
			editedCard.querySelector('.card__back p').textContent = back;

			// Show Edited Card
			editedCard.removeAttribute('style');
			parent.remove();
		}

		// If deleting card
		if (action == 'delete') {
			const id = +parent.dataset.id;
			deleteCard(id);
		}

		// Update Breadcrumbs
		updateBreadCrumbs('card');
	}

	// Edit Card Button
	if (target.className.includes('edit')) {
		const parent = target.closest('.col-12'),
			id = parent.dataset.id,
			editItem = currStack.cards.find((card) => card.id == id),
			editCard = templates[1].cloneNode(true);

		// Modify Edit Card Attributes
		editCard.dataset.action = 'edit';
		editCard.querySelector('[name="card-front"]').value = editItem.front;
		editCard.querySelector('[name="card-back"]').value = editItem.back;

		// Show Edit Card
		parent.insertAdjacentElement('afterend', editCard);
		parent.style.display = 'none';
	}

	// Cancel Button
	if (target.className.includes('cancel')) {
		const parent = target.closest('.col-12'),
			action = parent.dataset.action;

		// If adding card
		if (action == 'add') {
			cardOptions.parentElement.removeAttribute('style');
			parent.remove();
		}

		// If editing card
		if (action == 'edit') {
			parent.previousElementSibling.removeAttribute('style');
			parent.remove();
		}

		// If deleting card
		if (action == 'delete') {
			target.parentElement.previousElementSibling.removeAttribute('style');
			target.closest('.col-12').removeAttribute('data-action');
			target.parentElement.remove();
		}
	}

	// Delete Card
	if (target.className.includes('delete')) {
		const confirmBtn = templates[1].querySelector('.card__btn').cloneNode(true);

		// Add confirm buttons
		target.parentElement.insertAdjacentElement('afterend', confirmBtn);
		target.parentElement.style.display = 'none';

		// Set action data
		target.closest('.col-12').dataset.action = 'delete';
	}
}

// //----- CARD EVENTS -----//

// ADD, STUDY
cardOptions.addEventListener('click', clickOptions);

// SAVE, CANCEL, EDIT, DELETE
cardGrid.addEventListener('click', clickCardGrid);

/*
+------------+
| STUDY PAGE |
+------------+
*/
// //----- FLASH CARD VARIABLES -----//
let studySet,
	studyCardCount,
	timerID,
	flashCardAnimation,
	cardIndex = 0,
	isTimed = false,
	timeAllotment = 0;

// //----- FLASH CARD FUNCTIONS -----//

// SHUFFLE CARDS
function shuffleCards(cardArr) {
	// Create new array to shuffle
	let shuffledArr = [...cardArr];

	// Shuffle cards
	for (let i = shuffledArr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
	}

	return shuffledArr;
}

// START STUDY SESSION
function startStudy() {
	// Reset study buttons
	studyBtn.children[0].removeAttribute('disabled');
	studyBtn.children[2].removeAttribute('disabled');

	// Clear existing interval if any
	clearInterval(timerID);
	timerID = undefined;

	// Enable flash card flip
	studyCard.addEventListener('click', clickFlipCard);

	// Reset study variables
	studySet = shuffleCards(currStack.cards);
	studyCardCount = studySet.length;
	cardIndex = 0;

	// Initialize card count
	updateCardCount();

	// Display time if timed
	if (isTimed) {
		timeAllotment = studySet.length * 5;
		studyTimer.textContent = timeStringBuilder(timeAllotment);
		studyTimer.removeAttribute('style');
	} else {
		studyTimer.textContent = '';
	}

	// Initialize card
	updateCard(studySet[cardIndex], 'down');
}

// UPDATE CARD
function updateCard(newCard, direction) {
	const cardFront = studyPage.querySelector('.study__card-front p'),
		cardBack = studyPage.querySelector('.study__card-back p');

	let animationIn, animationOut;

	// Set animations
	switch (direction) {
		case 'down':
			animationIn = 'fade-in-down';
			animationOut = 'fade-out-down';
			break;
		case 'right':
			animationIn = 'rotate-in-right';
			animationOut = 'rotate-out-right';
			break;
		case 'left':
			animationIn = 'rotate-in-left';
			animationOut = 'rotate-out-left';
			break;
	}

	// Animate card out
	studyCard.classList.add(animationOut);

	// Animate card in
	setTimeout(() => {
		// Remove animation out
		studyCard.classList.remove(animationOut);

		// Update contents
		cardFront.textContent = newCard.front;
		cardBack.textContent = newCard.back;

		// Reset card flip status
		studyCard.children[0].style.transition = 'unset';
		studyCard.children[0].classList.remove('flipped');

		// Add animation in
		studyCard.classList.add(animationIn);
		setTimeout(() => {
			// Remove animation in
			studyCard.classList.remove(animationIn);
			studyCard.children[0].removeAttribute('style');
		}, 200);
	}, 200);
}

// UPDATE CARD COUNT
function updateCardCount() {
	cardCountDisplay.textContent = `${studyCardCount - studySet.length}/${studyCardCount}`;
}

// START TIMER
function startTimer(timeInSec) {
	// Reset timer if already running
	clearInterval(timerID);

	// Create new timer
	updateDOMTimer();
	timerID = setInterval(updateDOMTimer, 1000);

	// Update DOM Timer
	function updateDOMTimer() {
		// Update DOM timer
		if (timeInSec < 10) studyTimer.style.color = '#d2222d';
		else studyTimer.removeAttribute('style');

		studyTimer.textContent = timeStringBuilder(timeInSec);

		// Decrement time
		timeInSec--;

		// End timer and reset ID
		if (timeInSec < 0) {
			// Reset timer ID
			clearInterval(timerID);
			timerID = undefined;

			// Show time ran out message
			updateCard({ front: 'YOUR TIME IS UP!', back: 'YOUR TIME IS UP!' }, 'down');

			// Disable buttons and card flip
			studyCard.removeEventListener('click', clickFlipCard);
			studyBtn.children[0].disabled = true;
			studyBtn.children[2].disabled = true;
		}
	}
}

// BUILD TIME STRING
function timeStringBuilder(timeInSec) {
	let hours = Math.floor(timeInSec / 3600),
		mins = Math.floor(timeInSec / 60) % 60,
		secs = timeInSec % 60,
		timeString = '';

	// Building time string
	if (hours > 0) timeString += hours.toString().padStart(2, '0') + ':';
	if (timeInSec >= 60) {
		timeString += mins.toString().padStart(2, '0') + ':';
		timeString += secs.toString().padStart(2, '0');
	} else {
		timeString += secs;
	}

	return timeString;
}

// //----- FLASH CARD CLICK EVENT HANDLERS -----//

// STUDY BUTTONS CORRECT, WRONG, RESET
function clickStudyBtn(e) {
	const button = e.target.className.match(/correct|wrong|reset/);

	// If target clicked is a button
	if (button) {
		// Start timer if timed
		if (isTimed && !timerID && (button == 'correct' || button == 'wrong')) {
			startTimer(timeAllotment);
		}

		// If correct
		if (button == 'correct') {
			// Set animation
			flashCardAnimation = 'left';

			// Remove card from study set
			studySet.splice(cardIndex, 1);

			// Update card count
			updateCardCount();
		}

		// If wrong
		if (button == 'wrong') {
			// Set animation
			flashCardAnimation = 'down';

			// Increment index
			cardIndex++;
		}

		// Reset flash card
		if (button == 'reset') {
			// Reset timer ID
			clearInterval(timerID);
			timerID = undefined;

			// Start study
			startStudy();
			return;
		}

		// Reset card index if index is out of range
		if (!studySet[cardIndex]) cardIndex = 0;

		// Update cards
		if (studySet[cardIndex]) {
			// If set still has cards
			updateCard(studySet[cardIndex], flashCardAnimation);
		} else {
			// If there are no more cards
			updateCard({ front: 'DONE!', back: 'DONE!' }, 'down');

			// Reset timer ID
			clearInterval(timerID);
			timerID = undefined;

			// Disable buttons and card flip
			studyCard.removeEventListener('click', clickFlipCard);
			studyBtn.children[0].disabled = true;
			studyBtn.children[2].disabled = true;
		}
	}
}

// FLASH CARD FLIP
function clickFlipCard(e) {
	e.target.children[0].classList.toggle('flipped');
}

// //----- FLASH CARD EVENTS -----//

// STUDY BUTTONS CORRECT, WRONG, RESET
studyBtn.addEventListener('click', clickStudyBtn);
