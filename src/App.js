import React, { Component } from 'react';
import logo from './assets/logo.svg';
import CameraImg from './assets/Camera';
import './App.css';
import { getCurrentLocation, getHeading } from './browserUtils';
import { fetchHotel } from './api';
import Spinner from './Spinner';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      heading: 0,
      data: '',
      lat: null,
      lng: null,
      deviceOrientationNotSupported: false
    };
  }

  componentDidMount() {
    if (window.DeviceOrientationEvent) {
      // https://developers.google.com/web/fundamentals/native-hardware/device-orientation/
      window.addEventListener("deviceorientation", event => {
        this.setState({ heading: getHeading(event) });
      });
    } else {
      this.setState({
        deviceOrientationNotSupported: true
      });
    }
  }

  handleLocation = (coords, heading) => {
    const { latitude, longitude } = coords;
    this.setState({
      lat: latitude,
      lng: longitude
    });

    fetchHotel(latitude, longitude, heading)
      .then(data => {
        if(data && data.link) {
          document.location = data.link;
        } else {
          this.setState({ isFetchingHotel: false });
        }
      });
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        { this.renderContent() }
      </div>
    );
  }

  renderContent() {
    const { isFetchingHotel, deviceOrientationNotSupported } = this.state;

    if(isFetchingHotel) {
      return this.renderInterstitial();
    }

    return (
      <div>
        {
          deviceOrientationNotSupported ? (
            <div style={{ marginTop: '50px' }}>
              Your device doesn't have a compass. Sorry!
            </div>
          ) : (
            <div>
              { this.renderCameraButton() }
              { this.renderLocationData() }
            </div>
          )
        }
      </div>
    )
  }

  renderInterstitial() {
    return (
      <div style={{ marginTop: '50px' }}>
        <Spinner style={{ height: '50px' }}/>
        <p style={{ color: 'grey' }}>
          <i>Searching for your hotel...</i>
        </p>
      </div>
    );
  }

  renderCameraButton() {
    return (
      <p className="App-intro">
        <button onClick={event => this.inputEl.click()}>
          <CameraImg width='100px' height='100px' />
          <input
            type="file"
            accept="image/*"
            capture="camera"
            ref={el => this.inputEl = el}
            className='hidden'
            onChange={event => {
              this.setState({ isFetchingHotel: true });
              getCurrentLocation()
                .then(coords => this.handleLocation(coords, this.state.heading));
            }}
          />
        </button>
      </p>
    );
  }

  renderLocationData() {
    const { heading, data, lng, lat } = this.state;

    return (
      <div>
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
