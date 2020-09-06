//  categories is the main data structure for the app; it looks like this:
//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
	let ids = [];
	let offset = Math.floor(Math.random() * 183) * 100;
	const results = await axios.get(`https://jservice.io/api/categories/?count=100&offset=${offset}`);

	while (ids.length < 6) {
		let random = Math.floor(Math.random() * 100);
		if (!ids.includes(results.data[random].id)) {
			ids.push(results.data[random].id);
		}
	}
	return ids;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
	const category = await axios.get(`https://jservice.io/api/category?id=${catId}`);
	let clueArr = [];

	for (let clue of category.data.clues) {
		let clueObj = { question: clue.question, answer: clue.answer, showing: null };
		clueArr.push(clueObj);
	}

	const categoryObj = {
		title: category.data.title,
		clues: shuffle(clueArr)
	};

	return categoryObj;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {
	const table = $(`<table>
	<thead>
		  <tr>
				<td>${categories[0].title}</td>
				<td>${categories[1].title}</td>
				<td>${categories[2].title}</td>
				<td>${categories[3].title}</td>
				<td>${categories[4].title}</td>
				<td>${categories[5].title}</td>
		  </tr>
	</thead>
	<tbody>		
		  <tr>
				<td data-category=0 data-clue=0 >?</td>
				<td data-category=1 data-clue=0 >?</td>
				<td data-category=2 data-clue=0 >?</td>
				<td data-category=3 data-clue=0 >?</td>
				<td data-category=4 data-clue=0 >?</td>
				<td data-category=5 data-clue=0 >?</td>
		  </tr>
		  <tr>
				<td data-category=0 data-clue=1 >?</td>
				<td data-category=1 data-clue=1 >?</td>
				<td data-category=2 data-clue=1 >?</td>
				<td data-category=3 data-clue=1 >?</td>
				<td data-category=4 data-clue=1 >?</td>
				<td data-category=5 data-clue=1 >?</td>
		  </tr>
		  <tr>
				<td data-category=0 data-clue=2 >?</td>
				<td data-category=1 data-clue=2 >?</td>
				<td data-category=2 data-clue=2 >?</td>
				<td data-category=3 data-clue=2 >?</td>
				<td data-category=4 data-clue=2 >?</td>
				<td data-category=5 data-clue=2 >?</td>
		  </tr>
		  <tr>
				<td data-category=0 data-clue=3 >?</td>
				<td data-category=1 data-clue=3 >?</td>
				<td data-category=2 data-clue=3 >?</td>
				<td data-category=3 data-clue=3 >?</td>
				<td data-category=4 data-clue=3 >?</td>
				<td data-category=5 data-clue=3 >?</td>
		  </tr>
		  <tr>
				<td data-category=0 data-clue=4 >?</td>
				<td data-category=1 data-clue=4 >?</td>
				<td data-category=2 data-clue=4 >?</td>
				<td data-category=3 data-clue=4 >?</td>
				<td data-category=4 data-clue=4 >?</td>
				<td data-category=5 data-clue=4 >?</td>
		  </tr>
		  
	</tbody>
</table>`);

	$('.game').append(table);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
	const clue = +evt.target.dataset.clue;
	const cat = +evt.target.dataset.category;
	const question = categories[cat].clues[clue].question;
	const answer = categories[cat].clues[clue].answer;
	const showing = categories[cat].clues[clue].showing;
	if (showing === null) {
		evt.target.innerHTML = question;
		categories[cat].clues[clue].showing = 'question';
		$(this).css({ color: 'white', fontSize: '.5em' });
	} else if (showing === 'question') {
		evt.target.innerHTML = answer;
		categories[cat].clues[clue].showing = 'answer';
		$(this).css({ backgroundColor: '#28a200' });
	} else {
		return;
	}
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
	$('button').text('LOADING...');
	$('.game').empty();
	categories = [];
	$('.loader').css('visibility', 'visible');
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
	$('.loader').css('visibility', 'hidden');
	$('button').text('RESTART');
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
	showLoadingView();
	let catIds = await getCategoryIds();
	for (let catId of catIds) {
		categories.push(await getCategory(catId));
	}
	fillTable();
	hideLoadingView();
}

/** On click of start / restart button, set up game. */

$('button').on('click', setupAndStart);

/** On page load, add event handler for clicking clues */

$(function() {
	$('.game').on('click', 'tbody > tr > td', handleClick);
});

// shuffle function based on Fisher Yates algorithm from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
