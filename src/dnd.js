/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрощено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
	let newDiv = document.createElement('div');

	let width = random(200, 1),
		height = random(200, 1);

	newDiv.classList.add('draggable-div');
	newDiv.style.position = 'absolute';
	newDiv.style.backgroundColor = '#' + random(0xffffff).toString(16);
	newDiv.style.width = width + 'px';
	newDiv.style.height = height + 'px';
	newDiv.style.top = random(window.innerHeight - height) + 'px';
    newDiv.style.left = random(window.innerWidth - width) + 'px';

	return newDiv;
}

function random(max, min = 1) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {
    target.addEventListener('mousedown', (e) => {

        function move(e) {
            target.style.left = e.pageX - shiftX + 'px';
            target.style.top = e.pageY - shiftY + 'px';
        }

        let shiftX = e.pageX - target.getBoundingClientRect().left + pageXOffset;
        let shiftY = e.pageY - target.getBoundingClientRect().top + pageYOffset;

        document.addEventListener('mousemove', move);

        target.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', move);
        })
    });
    target.addEventListener('mouseover', () => {
        target.style.boxShadow = '0 0 10px rgba(0,0,0,.4)';
    });
    target.addEventListener('mouseout', () => {
        target.style.boxShadow = 'none';
    });
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
