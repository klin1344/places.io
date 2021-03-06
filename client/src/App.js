import React from 'react';
import './App.css';
import MainApp from './MainApp/MainApp';
import PlacesNavbar from './Navbar/PlacesNavbar';
import About from './About/About';
import Spec from './Spec/Spec';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageId: 0
    }

    //  0: map view
    //  1: about page
    //  extensible
  }

  updatePageId(pageId) {
    this.setState({ pageId });
  }

  render() {
    return (
      <div className="App">
        <PlacesNavbar updatePageIdFunc={this.updatePageId.bind(this)} />
        {this.state.pageId === 0 ? <MainApp /> : this.state.pageId === 1 ? <About /> : <Spec/>}

      </div>
    );
  }
}

export default App;
