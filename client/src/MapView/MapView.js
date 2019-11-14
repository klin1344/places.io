import React from 'react';
import '../App.css';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

// import RequestHelper from '../RequestHelper';
import Control from 'react-leaflet-control';
import Button from 'react-bootstrap/Button';
// import MockEndpoints from '../RequestController/MockEndpoints';
import RequestController from '../RequestController/RequestController';
const PAGE_LIMIT = 10;

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.map = undefined;
        this.layer = undefined;
        this.state = {
            currentZoom: 10
        };
    }
    componentDidMount() {
        this.map.leafletElement.on('zoomend', () => {
            this.setState({ currentZoom: this.map.leafletElement.getZoom() });
        });

        // generate markers


    }
    
    handleClick(e) {
        this.props.updateLatLngFunc({ lat: e.latlng.wrap().lat, lng: e.latlng.wrap().lng });
    }

    handleViewClick() {
        const southWestBounds = this.map.leafletElement.getBounds().getSouthWest().wrap();
        const northEastBounds = this.map.leafletElement.getBounds().getNorthEast().wrap();
        const upperLeft = [northEastBounds.lat, southWestBounds.lng].map(x => Number(x));
        const bottomRight = [southWestBounds.lat, northEastBounds.lng].map(x => Number(x));

        RequestController.view(upperLeft, bottomRight, 0, PAGE_LIMIT)
            .then(res => {
                this.props.updateCurrentDataPoints(res.data.entries);
                this.props.updateBoundingBox(upperLeft, bottomRight);
            })
            .catch(err => console.log(err));
    }

    mapCenter() {
        const riceCampusCoordinate = [29.749907, -95.358421]
        return riceCampusCoordinate
    }

    render() {
        return (
            <Map ref={(ref) => { this.map = ref; }} onClick={(this.handleClick.bind(this))} center={this.mapCenter(this)} zoom={10}
                style={{ height: '90vh', width: '100%' }}>
                <TileLayer ref={(ref) => {this.layer = ref}}
                    attribution='&amp;copy <a href="https://github.com/rice-comp413-blue/places.io">BlueTeam</a> | places.io'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            
                {this.props.markers.filter((b) => b.storyid !== this.props.selectedStory).map(marker => {
                    return (
                        <Marker
                            key={marker.storyid}
                            position={[marker.lat, marker.long]}>   
                            <Popup>
                                <h5>Description</h5><br /> {marker.text}
                                {marker.image_url ? <img src={marker.image_url} style={{height:'100px'}}/> : <p className="missing">No image attached.</p>}
                                <p>Story Id: {marker.storyid}</p>
                            </Popup>
                        </Marker>
                    )

                })}
                {this.props.markers.filter((b) => b.storyid === this.props.selectedStory).map(marker => {
                    return (
                        <ActiveMarker
                            key={marker.storyid}
                            position={[marker.lat, marker.long]}>   
                            <Popup>
                                <h5>Description</h5><br /> {marker.text}
                                {marker.image_url ? <img src={marker.image_url} style={{height:'100px'}}/> : <p className="missing">No image attached.</p>}
                                <p>Story Id: {marker.storyid}</p>
                            </Popup>
                        </ActiveMarker>
                    )

                })}
                
                {this.props.mode === 'view' && this.state.currentZoom > 6 ?
                    <Control position="topright" >
                        <Button onClick={this.handleViewClick.bind(this)}>
                            Query
                        </Button>
                    </Control>
                    : null}
            </Map>
        );
    }
}
const ActiveMarker = props => {
    const initMarker = ref => {
      if (ref) {
        ref.leafletElement.openPopup()
      }
    }
    return <Marker ref={initMarker} {...props}/>
 }

export default MapView;