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
        { this.renderContent() }
      </div>
    );
  }

  renderContent() {
    const { isFetchingHotel, deviceOrientationNotSupported } = this.state;

    if(isFetchingHotel) {
      return this.renderInterstitial();
    }

    return <button> <CameraImg width='100px' height='100px' /></button>

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
        <button onClick={event => this.inputEl.click()}
          style={{
            backgroundColor: 'transparent'
          }}>
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

}

export default App;
