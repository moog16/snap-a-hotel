import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { getBrowserOrientation, getCurrentLocation } from './browserUtils';
import serialize from 'serialize-javascript';

class App extends Component {

  constructor(props) {
    super(props);
    this.onHeadingChange = this.onHeadingChange.bind(this);
    this.state = {
      heading: 0,
      data: '',
      lat: null,
      lng: null,
    };
  }

  componentDidMount() {
    getCurrentLocation();
    window.addEventListener("deviceorientation", this.onHeadingChange);
  }

  onHeadingChange(event) {
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

    const hng = heading + adjustment;
    const phase = hng < 0 ? 360 + hng : hng;
    const textContent = (360 - phase | 0) + "°";

    this.setState({ heading: hng });
  }

  handleLocation = (coords, heading) => {
    const { latitude, longitude } = coords;
    console.log('heading', heading)
    this.setState({
      lat: latitude,
      lng: longitude
    })
    fetch('https://snap-a-hotel.loyaltywallet.io/search', {
      method: 'POST',
      body: serialize({
        latitude,
        longitude,
        bearing: heading
      })
    }).then((res) => {
      console.log('MEOWMEOW')
      res.json().then((data) => {
        console.log(data);
        this.setState({ data });
      })
    })
  }

  render() {
    const { heading, data, lng, lat } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={(event) => {
              console.log('heading1: ', heading)
              getCurrentLocation().then(coords => this.handleLocation(coords, heading));
            }}
          />
        </p>

        <h1>hello5</h1>
        <div>
          Hotel:
          <br />
          { data.name }
          <br />
          { data.id }
        </div>
        <div>
          long: { lng }
        </div>
        <div>
          lat: { lat }
        </div>
        <div>
          heading: { heading }
        </div>
      </div>
    );
  }
}

export default App;
