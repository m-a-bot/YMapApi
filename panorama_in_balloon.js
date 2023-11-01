ymaps.ready(function () {
    // Для начала проверим, поддерживает ли плеер браузер пользователя.
    if (!ymaps.panorama.isSupported()) {
        // Если нет, то просто ничего не будем делать.
        return;
    }

    var panoramsData = {

        first_panorama: {
            angularBBox: [1856 / 8672 * 3 * Math.PI, 0, 1856 / 8672 * 1 * Math.PI, 2 * Math.PI],
            position: [0, 0, 0],
            tileSize: [542, 464],
            tileLevels: [{
                getTileUrl: function (x, y) {
                    return 'tiles/panorama1/yandex_office_hq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [7168, 3584];
                }
            }, {
                getTileUrl: function (x, y) {
                    return 'tiles/panorama1/yandex_office_lq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [512, 256];
                }
            }]
        },

        second_panorama: {
            angularBBox: [340 / 1084 * 3 * Math.PI, 0, 340 / 1084 * 1 * Math.PI, 2 * Math.PI],
            position: [0, 0, 0],
            tileSize: [512, 170],
            tileLevels: [{
                getTileUrl: function (x, y) {
                    return 'tiles/panorama2/yandex_office_hq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [1084, 340];
                }
            }, {
                getTileUrl: function (x, y) {
                    return 'tiles/panorama2/yandex_office_lq/' + x + '-' + y + '.jpg';
                },
                getImageSize: function () {
                    return [512, 256];
                }
            }]
        }

    }

    // Класс панорамы.
    function MyPanorama(obj) {
        ymaps.panorama.Base.call(this);
        this._angularBBox = obj.angularBBox;
        this._position = obj.position;
        this._tileSize = obj.tileSize;
        this._tileLevels = obj.tileLevels;
    }

    ymaps.util.defineClass(MyPanorama, ymaps.panorama.Base, {

        getAngularBBox: function () {
            return this._angularBBox;
        },
        getPosition: function () {
            return this._position;
        },
        getTileSize: function () {
            return this._tileSize;
        },
        getTileLevels: function () {
            return this._tileLevels;
        },
        getCoordSystem: function () {
            return ymaps.coordSystem.cartesian;
        }
    });

    var panoramas =  {
        
        'first': new MyPanorama(panoramsData.first_panorama),

        'second': new MyPanorama(panoramsData.second_panorama)

    }


    var myMap = new ymaps.Map('map', {
            center: [55.800878, 49.105866],
            zoom: 9,
            controls: []
        }),

        // При клике на метке будет открываться балун,
        // содержащий Яндекс.Панораму в текущей географической точке.
        myPlacemark1 = new ymaps.Placemark([55.790894, 49.114507], {
            // Для данной метки нужно будет открыть воздушную панораму.
            panoLayer: 'yandex#panorama'
        }, {
            preset: 'islands#redIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        }),

        myPlacemark2 = new ymaps.Placemark([55.800535, 49.111783], {
            // Для этой метки будем запрашивать наземную панораму.
            panoLayer: 'yandex#panorama'
        }, {
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        });

        myPlacemark3 = new ymaps.Placemark([55.792041, 49.122086], {
            // Для этой метки будем запрашивать наземную панораму.
            panoLayer: 'MyPanorama',
            customPanoName: 'first'
        }, {
            preset: 'islands#nightIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        });

        

        myPlacemark4 = new ymaps.Placemark([55.784238, 49.128059], {
            // Для этой метки будем запрашивать наземную панораму.
            panoLayer: 'MyPanorama',
            customPanoName: 'second'
        }, {
            preset: 'islands#redIcon',
            openEmptyBalloon: true,
            balloonPanelMaxMapArea: 0
        });

    // Функция, устанавливающая для метки макет содержимого ее балуна.
    function setBalloonContentLayout (placemark, panorama) {
        // Создание макета содержимого балуна.
        var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div id="panorama" style="width:356px;height:256px"></div>', {
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


        if (panoLayer == "MyPanorama")
        {
            var myPanoName = placemark.properties.get('customPanoName');

            var myPanorama = panoramas[myPanoName];

            setBalloonContentLayout(placemark, myPanorama);
        }
        else {
        ///
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
    }

    


    // Слушаем на метках событие 'balloonopen': как только балун будет впервые открыт,
    // выполняем проверку на наличие панорамы в данной точке и в случае успеха создаем
    // макет с найденной панорамой.
    // Событие открытия балуна будем слушать только один раз.
    myPlacemark1.events.once('balloonopen', requestForPanorama);
    myPlacemark2.events.once('balloonopen', requestForPanorama);
    myPlacemark3.events.once('balloonopen', requestForPanorama);
    myPlacemark4.events.once('balloonopen', requestForPanorama);

    myMap.geoObjects.add(myPlacemark1);
    myMap.geoObjects.add(myPlacemark2);
    myMap.geoObjects.add(myPlacemark3);
    myMap.geoObjects.add(myPlacemark4);

});
