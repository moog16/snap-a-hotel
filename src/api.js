import serialize from 'serialize-javascript';

export const fetchHotel = (latitude, longitude, heading) => {
  return new Promise(resolve => {
    fetch('https://snapit.live/search', {
      method: 'POST',
      body: serialize({
        latitude,
        longitude,
        bearing: heading
      })
    }).then((res) => {
      res.json().then(data => resolve(data));
    });

  });
}
