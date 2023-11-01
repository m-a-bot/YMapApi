ymaps.ready(['AnimatedLine']).then(init);

function init(ymaps) {
    // Создаем карту.
    var myMap = new ymaps.Map("map", {
        center: [55.800878, 49.105866],
        zoom: 16
    }, {
        searchControlProvider: 'yandex#search'
    });

    var metro_bauman = [55.787205, 49.121438];

    var point1 = [55.788096, 49.119731],
        point2 = [55.812853, 49.108331];

    var metro_kozya_sloboda = [55.816674, 49.098292];


    // Создаем ломаные линии.
    var firstAnimatedLine = new ymaps.AnimatedLine([
        [55.787215, 49.121452],
        [55.787449, 49.121330],
        [55.788170, 49.119863],
        [55.788093, 49.119732]
    ], {}, {
        // Задаем цвет.
        strokeColor: "#ED4543",
        // Задаем ширину линии.
        strokeWidth: 5,
        // Задаем длительность анимации.
        animationTime: 4000
    });
    var secondAnimatedLine = new ymaps.AnimatedLine([
        [55.788093, 49.119732],
        [55.788170, 49.119863],
        [55.789798, 49.116769],
        [55.790526, 49.117851],
        [55.793535, 49.111189],
        [55.795812, 49.114073],
        [55.795946, 49.113686],
        [55.796075, 49.113734],

        [55.796353, 49.111562],
        [55.796998, 49.110056],
        [55.797327, 49.109572],
        [55.797587, 49.109423],
        [55.797549, 49.109836],
        [55.797623, 49.109867],
        [55.797670, 49.109416],
        [55.798903, 49.109469],

        [55.802205, 49.106899],
        [55.802407, 49.106251],

        [55.801745, 49.103181],
        [55.801799, 49.102673],
        [55.802038, 49.102362],
        [55.803333, 49.101910],
        [55.809557, 49.102882],

        [55.811959, 49.102915],
        [55.812482, 49.106822],
        [55.812728, 49.108321]
    ], {}, {
        strokeColor: "#1E98FF",
        strokeWidth: 5,
        animationTime: 4000
    });

    var AnimatedLine3 = new ymaps.AnimatedLine([
        [55.812728, 49.108321],
        [55.812314, 49.102752],
        [55.812863, 49.102131],
        [55.813033, 49.102175],
        [55.813918, 49.101349],
        [55.815031, 49.100806],
        [55.815804, 49.100162],
        [55.815899, 49.098557],
        [55.816674, 49.098292]
    ], {}, {
        strokeColor: "#1E98FF",
        strokeWidth: 5,
        animationTime: 4000
    });
    // Добавляем линии на карту.
    myMap.geoObjects.add(firstAnimatedLine);
    myMap.geoObjects.add(secondAnimatedLine);
    myMap.geoObjects.add(AnimatedLine3);
    // Создаем метки.
    var firstPoint = new ymaps.Placemark(metro_bauman, {}, {
        iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/placeMarkMetro.png',
            // Размеры метки.
            iconImageSize: [30, 42],
    });
    var secondPoint = new ymaps.Placemark(point1, {}, {
        iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/myPlaceMark1.png',
            // Размеры метки.
            iconImageSize: [30, 42],
    });
    var thirdPoint = new ymaps.Placemark(point2, {}, {
        iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/myPlaceMark2.png',
            // Размеры метки.
            iconImageSize: [30, 42],
    });
    var Point4 = new ymaps.Placemark(metro_kozya_sloboda, {}, {
        iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/placeMarkMetro1.png',
            // Размеры метки.
            iconImageSize: [30, 42],
    });
    // Функция анимации пути.
    function playAnimation() {
        // Убираем вторую линию.
        secondAnimatedLine.reset();
        AnimatedLine3.reset();
        // Добавляем первую метку на карту.
        myMap.geoObjects.add(firstPoint);
        // Анимируем первую линию.
        firstAnimatedLine.animate()
            // После окончания анимации первой линии добавляем вторую метку на карту и анимируем вторую линию.
            .then(function() {
                myMap.geoObjects.add(secondPoint);
                return secondAnimatedLine.animate();
            })
            // После окончания анимации второй линии добавляем третью метку на карту.
            .then(function() {
                myMap.geoObjects.add(thirdPoint);
                return AnimatedLine3.animate();
            })
            .then(function(){
                myMap.geoObjects.add(Point4);
                
                return ymaps.vow.delay(null, 2000);
            })
            // После паузы перезапускаем анимацию.
            .then(function() {
                // Удаляем метки с карты.
                myMap.geoObjects.remove(firstPoint);
                myMap.geoObjects.remove(secondPoint);
                myMap.geoObjects.remove(thirdPoint);
                myMap.geoObjects.remove(Point4);
                // Убираем вторую линию.
                secondAnimatedLine.reset();
                AnimatedLine3.reset();
                // Перезапускаем анимацию.
                playAnimation();
            });
    }

    

    // Запускаем анимацию пути.
    playAnimation();

    
}

