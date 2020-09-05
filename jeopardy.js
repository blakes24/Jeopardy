//  this is the main data structure for the app; it looks like this:
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
	const results = await axios.get('http://jservice.io/api/categories/?count=100');

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
	const category = await axios.get(`http://jservice.io/api/category?id=${catId}`);
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

async function fillTable() {
	const table = $(`<table>
	<thead>
		  <tr>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
		  </tr>
	</thead>
	<tbody>
		  <tr>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
		  </tr>
		  <tr>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
		  </tr>
		  <tr>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
		  </tr>
		  <tr>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
		  </tr>
		  <tr>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
				<td>?</td>
		  </tr>
	</tbody>
</table>`);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
	let catIds = await getCategoryIds();
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO

// shuffle function based on Fisher Yates algorithm
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i);
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
