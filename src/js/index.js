require('../sass/main.scss');

let popupTemplate = require('../templates/popup.hbs');
let commentsTemplate = require('../templates/comments.hbs');

var myMap;
var clusterer;

ymaps.ready(init);

function init() {
    myMap = new ymaps.Map('map', {
        center: [55.751574, 37.573856],
        zoom: 11
    }, {
        searchControlProvider: 'yandex#search',
    });

    clusterer = new ymaps.Clusterer({
        preset: 'twirl#invertedRedClusterIcons',
        groupByCoordinates: false,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false
    });

    myMap.geoObjects.add(clusterer);

    myMap.events.add('click', (e) => {
        const coords = e.get('coords');

        ymaps.geocode(coords).then((res) => {
            if (!isOpenPopup()) {
                const title = res.geoObjects.get(0).properties.get('name');
                openPopup(title, e.get('offsetX'), e.get('offsetY'), coords);
            } else {
                closePopup();
            }
        })
    });
}

function openPopup(title, offsetX, offsetY, coords) {
    const commentsPopup = document.createElement('div');

    commentsPopup.innerHTML = popupTemplate({title: title});
    commentsPopup.id = 'commentsPopup';
    commentsPopup.className = 'container';
    commentsPopup.style.left = `${offsetX}px`;
    commentsPopup.style.top = `${offsetY}px`;

    document.body.appendChild(commentsPopup);

    document.querySelector('.close_button').onclick = function () {
        closePopup();
    };

    commentsPopup.querySelector('#addCommentButton').onclick = function () {
        const senderNameInput = commentsPopup.querySelector('#senderNameInput'),
              placeInput = commentsPopup.querySelector('#placeInput'),
              messageTextArea = commentsPopup.querySelector('#messageTextArea'),
              comment = {
                title: title,
                senderName: senderNameInput.value,
                place: placeInput.value,
                message: messageTextArea.value
              };

        addCommentToLocalStorage(coords, comment);
        updateComments(coords);
        addMarkerOnMap(coords);
        senderNameInput.value = '';
        placeInput.value = '';
        messageTextArea.value = '';
    }
}

function addCommentToLocalStorage(key, comment) {
    const comments = window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : [];
    comments.push(comment);
    window.localStorage.setItem(key, JSON.stringify(comments));
}

function addMarkerOnMap(coords) {
    const comments = JSON.parse(window.localStorage.getItem(coords));
    const lastComment = comments[comments.length - 1];

    const content = `<a href="#">${lastComment.title}</a><br>${lastComment.message}`;
    const myPlacemark = new ymaps.Placemark(coords, {
        balloonContentHeader: lastComment.place,
        balloonContentBody: content,
        balloonContentFooter: lastComment.time,
    });

    myPlacemark.events.add('click', function (e) {
        if (!isOpenPopup()) {
            openPopup(lastComment.title, e.get('offsetX'), e.get('offsetY'), coords);
            updateComments(coords);
        }
    });

    myMap.geoObjects.add(myPlacemark);
    clusterer.add(myPlacemark);
}

function updateComments(key) {
    const comments = window.localStorage.getItem(key) ? JSON.parse(window.localStorage.getItem(key)) : [];

    const popup = document.querySelector('#commentsPopup');
    const commentsPanel = popup.querySelector('#comments');

    commentsPanel.innerHTML = commentsTemplate({comments});
}

function isOpenPopup() {
    return !!document.querySelector('.close_button');
}

function closePopup() {
    const popup = document.querySelector('#commentsPopup');
    document.body.removeChild(popup);
}