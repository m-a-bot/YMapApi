ymaps.ready(['AnimatedLine']).then(function () {

    var pointA = [55.800878, 49.105866],
        pointB = [55.812818, 49.108274],
        pointC = [55.800418, 49.111860],
        pointD = [55.788094, 49.119731],
        pointE = [55.792422, 49.122413]
        /**
         * Создаем мультимаршрут.
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
         */
        multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
                pointA,
                pointB,
                pointC,
                pointD,
                pointE
            ],
            params: {
                //Тип маршрутизации - пешеходная маршрутизация.
                routingMode: 'pedestrian'
            }
        }, {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
            boundsAutoApply: true
        });

    var myMap = new ymaps.Map('map', {
            center: [55.800878, 49.105866],
            zoom: 9
        }, {
            searchControlProvider: 'yandex#search'
        }),

        // Создаём макет содержимого.
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        ),

        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Собственный значок метки',
            panoLayer: 'yandex#panorama',
            balloonContent: 'Это красивая метка'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/myPlaceMap4.png',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38],
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),


        myPlacemark1 = new ymaps.Placemark(pointB, {
            hintContent: 'Чаша',
            panoLayer: 'yandex#panorama',
            balloonContent: 'улица Сибгата Хакима, 4'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/myPlaceMap1.png',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38],
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),

        myPlacemark2 = new ymaps.Placemark([55.800418, 49.111860], {
            hintContent: 'Дворец земледельцев',
            balloonContent: 'Федосеевская ул., 36',
            panoLayer: 'yandex#panorama',
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/myPlaceMap3.png',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38],
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),

        myPlacemark3 = new ymaps.Placemark([55.788094, 49.119731], {
            hintContent: 'Памятник Фёдору Ивановичу Шаляпину',
            balloonContent: 'ул. Баумана, 78, корп. 2',
            panoLayer: 'yandex#panorama',
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/myPlaceMap5.gif',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38],
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),


        myPlacemarkWithContent = new ymaps.Placemark([55.792422, 49.122413], {
            hintContent: 'Собственный значок метки с контентом',
            panoLayer: 'yandex#panorama',
            balloonContent: 'А эта — новогодняя',
            iconContent: '12'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#imageWithContent',
            // Своё изображение иконки метки.
            iconImageHref: 'images/myPlaceMap2.png',
            // Размеры метки.
            iconImageSize: [48, 48],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-24, -24],
            // Смещение слоя с содержимым относительно слоя с картинкой.
            iconContentOffset: [15, 15],
            // Макет содержимого.
            iconContentLayout: MyIconContentLayout,
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        });

    // Функция, устанавливающая для метки макет содержимого ее балуна.
    function setBalloonContentLayout (placemark, panorama) {
        // Создание макета содержимого балуна.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="panorama" style="width:256px;height:156px"></div>', {
                // Переопределяем функцию build, чтобы при формировании макета
                // создавать в нем плеер панорам.
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    BalloonContentLayout.superclass.build.call(this);
                    // Добавляем плеер панорам в содержимое балуна.
                    this._openPanorama();
                },
                // Аналогично переопределяем функцию clear, чтобы удалять
                // плеер панорам при удалении макета с карты.
                clear: function () {
                    this._destroyPanoramaPlayer();
                    BalloonContentLayout.superclass.clear.call(this);
                },
                // Добавление плеера панорам.
                _openPanorama: function () {
                    if (!this._panoramaPlayer) {
                        // Получаем контейнер, в котором будет размещаться наша панорама.
                        var el = this.getParentElement().querySelector('#panorama');
                        this._panoramaPlayer = new ymaps.panorama.Player(el, panorama, {
                            controls: ['panoramaName']
                        });
                    }
                },
                // Удаление плеера панорамы.
                _destroyPanoramaPlayer: function () {
                    if (this._panoramaPlayer) {
                        this._panoramaPlayer.destroy();
                        this._panoramaPlayer = null;
                    }
                }
            });
        // Устанавливаем созданный макет в опции метки.
        placemark.options.set('balloonContentLayout', BalloonContentLayout);
    }

    // В этой функции выполняем проверку на наличие панорамы в данной точке.
    // Если панорама нашлась, то устанавливаем для балуна макет с этой панорамой,
    // в противном случае задаем для балуна простое текстовое содержимое.
    function requestForPanorama (e) {
        var placemark = e.get('target'),
            // Координаты точки, для которой будем запрашивать панораму.
            coords = placemark.geometry.getCoordinates(),
            // Тип панорамы (воздушная или наземная).
            panoLayer = placemark.properties.get('panoLayer');

        placemark.properties.set('balloonContent', "Идет проверка на наличие панорамы...");

        // Запрашиваем объект панорамы.
        ymaps.panorama.locate(coords, {
            layer: panoLayer
        }).then(
            function (panoramas) {
                if (panoramas.length) {
                    // Устанавливаем для балуна макет, содержащий найденную панораму.
                    setBalloonContentLayout(placemark, panoramas[0]);
                } else {
                    // Если панорам не нашлось, задаем
                    // в содержимом балуна простой текст.
                    placemark.properties.set('balloonContent', "Для данной точки панорамы нет.");
                }
            },
            function (err) {
                placemark.properties.set('balloonContent',
                    "При попытке открыть панораму произошла ошибка: " + err.toString());
            }
        );
    }

    
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



    // Слушаем на метках событие 'balloonopen': как только балун будет впервые открыт,
    // выполняем проверку на наличие панорамы в данной точке и в случае успеха создаем
    // макет с найденной панорамой.
    // Событие открытия балуна будем слушать только один раз.
    myPlacemark.events.once('balloonopen', requestForPanorama);
    myPlacemark1.events.once('balloonopen', requestForPanorama);
    myPlacemark2.events.once('balloonopen', requestForPanorama);
    myPlacemark3.events.once('balloonopen', requestForPanorama);
    myPlacemarkWithContent.events.once('balloonopen', requestForPanorama);


    myMap.geoObjects
        .add(myPlacemark)
        .add(myPlacemark1)
        .add(myPlacemark2)
        .add(myPlacemark3)
        .add(myPlacemarkWithContent);

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects.add(multiRoute);
});
