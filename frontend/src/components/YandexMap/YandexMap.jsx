import { useEffect, useRef } from 'react';

import './YandexMap.scss';

const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
const SCRIPT_ID = 'yandex-maps-api';

function loadYandexMaps() {
  if (window.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  return new Promise((res, rej) => {
    const existingScript = document.getElementById(SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        res(window.ymaps);
      });

      existingScript.addEventListener('error', rej);

      return;
    }

    const script = document.createElement('script');

    script.id = SCRIPT_ID;
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
    script.async = true;

    script.onload = () => res(window.ymaps);
    script.onerror = rej;

    document.head.appendChild(script);
  })
}


function YandexMap(props) {
  const {
    latitude, longitude, title, address,
  } = props;

  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || !YANDEX_MAPS_API_KEY) {
      return undefined;
    }

    let map;

    loadYandexMaps()
      .then(ymaps => {
        ymaps.ready(() => {
          if (!mapContainerRef.current) return;

          const coordinates = [ Number(latitude), Number(longitude) ];

          map = new ymaps.Map(
            mapContainerRef.current,
            {
              center: coordinates,
              zoom: 16,
              controls: [ 'zoomControl', 'fullscreenControl' ]
            },
            {
              suppressMapOpenBlock: true,
            }
          );

          const placemark = new ymaps.Placemark(
            coordinates,
            {
              balloonContentHeader: title,
              balloonContentBody: address,
            },
            {
              preset: 'islands#blueIcon',
            }
          );

          map.geoObjects.add(placemark);
        })
      })
      .catch(error => {
        console.error('Yandex Maps loading error', error);
      });

    return () => map?.destroy();

  }, [latitude, longitude, title, address]);

  if (!latitude || !longitude) {
    return (
      <p className="yandex-map yandex-map--empty">
        Координаты офиса не указаны
      </p>
    );
  }

  if (!YANDEX_MAPS_API_KEY) {
    return (
      <p className="yandex-map yandex-map--empty">
        Карта будет доступна после подключения API
      </p>
    )
  }

  return (
    <div
      ref={mapContainerRef}
      className="yandex-map"
      aria-label={`Карта: ${address}`}
    />
  )
}

export default YandexMap;