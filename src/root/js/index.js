require('../sass/main.scss');


let ready = () => {
	let friends,
		inputLeft = document.querySelector('#search-left'),
		inputRight = document.querySelector('#search-right'),
		buttonSave = document.querySelector('#button-save'),
		local = JSON.parse(localStorage.getItem('friendsFilter')) || [];

	let vkApi = (method, options) => {
	    if (!options.v) {
	        options.v = '5.68';
	    }

	    return new Promise((resolve, reject) => {
	        VK.api(method, options, data => {
	            if (data.error) {
	                reject(new Error(data.error.error_msg));
	            } else {
	                resolve(data.response);
	            }
	        });
	    });
	}

	let vkInit = () => {
	    return new Promise((resolve, reject) => {
	        VK.init({ 
	        	apiId: 6199790 
	        });
	        VK.Auth.getLoginStatus(function(response) { 
	            if (response.session) {
	                resolve();
	            } else {
	                VK.Auth.login(response => {
	                    if (response.session) {
	                        resolve();
	                    } else {
	                        reject(new Error('Не удалось авторизоваться'));
	                    }
	                }, 2);
	            }
	        });
	    });
	}

	let template = (item, deleteButton = false) => `
	    <li draggable="true" data-id="${item.id}" class="friends__item">
	        <img src="${item.photo_200}" alt="">
	        <p>${item.first_name} ${item.last_name}</p>
	        <span class="button ${deleteButton ? 'delButton' : 'addButton'}"></span>
	    </li>`;

	let rightList = id => local.push(id);
	let leftList = id => local = local.filter(item => item !== id);

	let isSearch = (item, value) => {
		return `${item.first_name} ${item.last_name}`.toLowerCase().includes(value.toLowerCase())
	};

	let render = () => {
	    document.querySelector('#friends-left-list').innerHTML = friends
	        .filter(item => !local.includes(String(item.id)) && isSearch(item, inputLeft.value))
	        .map(item => template(item))
	        .join('');
	    document.querySelector('#friends-right-list').innerHTML = friends
	        .filter(item => local.includes(String(item.id)) && isSearch(item, inputRight.value))
	        .map(item => template(item, true))
	        .join('');
	}

	buttonSave.addEventListener('click', function (e) {
	    e.preventDefault();

	    localStorage.setItem('friendsFilter', JSON.stringify(local));
	});

	document.addEventListener('keyup', function(e) {
	    ['search-left', 'search-right'].includes(e.target.id) && render();
	});

	document.addEventListener('dragstart', function (e) {
	    e.dataTransfer.setData('text', e.target.closest('[data-id]').dataset.id)
	});

	document.addEventListener('dragover', function (e) {
	    e.target.closest('.friends__list') && e.preventDefault();
	});

	document.addEventListener('click', function (e) {
		if (e.target.classList.contains('button')) {
	        const id = e.target.closest('[data-id]').dataset.id;

	        e.target.classList.contains('delButton') && leftList(id);
	        e.target.classList.contains('addButton') && rightList(id);
	        
	        render();
        }
	});

	document.addEventListener('drop', function (e) {
	    e.preventDefault();

	    let id = e.dataTransfer.getData('text');
	    let add = document.querySelector(`[data-id="${id}"] .button`).classList.contains('addButton');

	    add && e.target.closest('.friends__list').classList.contains('list_right') && rightList(id);
	    !add && e.target.closest('.friends__list').classList.contains('list_left') && leftList(id);

	    render();
	});

	vkInit()
	  .then(() => vkApi('friends.get', { fields: 'photo_200' }))
	  .then(response => friends = response.items)
	  .then(render)
}

document.addEventListener("DOMContentLoaded", ready);
