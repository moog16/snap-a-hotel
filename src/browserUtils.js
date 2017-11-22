

// browser agnostic orientation
export const getBrowserOrientation = () => {
  const { orientation, mozOrientation, msOrientation } = window.screen;
  if (orientation && orientation.type) {
    return orientation.type;
  }
  return orientation ||
          mozOrientation ||
          msOrientation;

  /*
    'portait-primary':      for (screen width < screen height, e.g. phone, phablet, small tablet)
                              device is in 'normal' orientation
                            for (screen width > screen height, e.g. large tablet, laptop)
                              device has been turned 90deg clockwise from normal
    'portait-secondary':    for (screen width < screen height)
                              device has been turned 180deg from normal
                            for (screen width > screen height)
                              device has been turned 90deg anti-clockwise (or 270deg clockwise) from normal
    'landscape-primary':    for (screen width < screen height)
                              device has been turned 90deg clockwise from normal
                            for (screen width > screen height)
                              device is in 'normal' orientation
    'landscape-secondary':  for (screen width < screen height)
                              device has been turned 90deg anti-clockwise (or 270deg clockwise) from normal
                            for (screen width > screen height)
                              device has been turned 180deg from normal
  */

}


export const getCurrentLocation = () => {
  return new Promise(resolve => {

    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
    } else {
      alert('Geolocation is not supported for this Browser/OS version yet.');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      resolve({
        latitude,
        longitude
      });
    });

  });

};


export const getHeading = (event) => {
  var heading = event.alpha;
  const { width, height } = window.screen;
  const defaultOrientation = width > height ? 'landscape' : 'portrait';

  if (typeof event.webkitCompassHeading !== "undefined") {
    heading = event.webkitCompassHeading; //iOS non-standard
  }

  var orientation = getBrowserOrientation();

  if (typeof heading === "undefined" || heading === null) return;

  // what adjustment we have to add to rotation to allow for current device orientation
  var adjustment = 0;
  if (defaultOrientation === "landscape") {
    adjustment -= 90;
  }

  if (typeof orientation !== "undefined") {
    var currentOrientation = orientation.split("-");

    if (defaultOrientation !== currentOrientation[0]) {
      if (defaultOrientation === "landscape") {
        adjustment -= 270;
      } else {
        adjustment -= 90;
      }
    }

    if (currentOrientation[1] === "secondary") {
      adjustment -= 180;
    }
  }

  return heading + adjustment;
}
