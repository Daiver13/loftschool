/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
	return new Promise((resolve) => {
		setTimeout(resolve, seconds * 1000)
	})
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
	return new Promise((resolve) => {
		let xhr = new XMLHttpRequest(),
			url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

		xhr.open('GET', url, true);
	    xhr.send();
		xhr.onload = function() {
	    	if(this.status == 200) {
	      		let cities = JSON.parse(this.responseText);
	      		resolve(cities.sort((a, b) => a.name.localeCompare(b.name)));
	    	}
	    }
	})
}

export {
    delayPromise,
    loadAndSortTowns
};
