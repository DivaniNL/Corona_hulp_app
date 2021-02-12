import React, { useEffect, useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom"
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from 'react-google-maps'
import * as data from './data/markers.json';
import firebase from 'firebase';
export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory();
    let POIlist= [];
        
    
    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('failed to log out')
        }
    }
   
        // firebase.database().ref("/").on("value", activities => {
        //     activities.forEach(activity => {
        //           POIlist.push(activity.val());
        //     });
        // })
        useEffect(() => {
            var markers = firebase.database().ref("/")
            markers.on("child_added", function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    POIlist.push(childData);
                 
                });
                sessionStorage.setItem('POIlist', JSON.stringify(POIlist))
            })
           
        });

    
    function Map() {
        
        
        console.log("test")
        console.log(data.markers);
        console.log(JSON.stringify(POIlist));
        var list = JSON.parse(sessionStorage.getItem('POIlist'));
        console.log( list);
        const [selectedMarker, setSelectedMarker] = useState(null);
        const getFilename = (id) => data.actions[id].filename;
        const getAction = (id) =>data.actions[id].action;
        return (<GoogleMap 
                     defaultZoom={12} 
                     defaultCenter={{lat:52.076918, lng:5.106366}}
                     options={{ gestureHandling: "greedy" }}>
                         {
                             
                            list.map(marker => 
                                
                            <Marker 
                            
                            key={marker.id}
                            position={{lat:marker.lat, lng: marker.lng}}
                            
                            onClick={() =>{
                                setSelectedMarker(marker);
                                console.log(marker)
                            }}
                            // ${getFilename(marker.action)}
                                icon={{
                                    url: `/dist/svg/${getFilename(marker.action)}`,
                                scaledSize: new window.google.maps.Size(45,45)
                            }}
                            />)
                         }
                         {selectedMarker && (
                                <InfoWindow
                                    position={{
                                        lat: selectedMarker.lat,
                                        lng: selectedMarker.lng
                                    }}
                                    onCloseClick={() => {
                                        setSelectedMarker(null);
                                    }}
                                    >
                                        <div style={{width: '180px', overflow:'hidden'}}>
                                            <h2>{getAction(selectedMarker.action)}</h2>
                                            <p>{selectedMarker.sender}</p>
                                            <p>{selectedMarker.desc}</p>
                                        </div>
                                </InfoWindow>
                             )}
                </GoogleMap>         
        )
    }
    
    const WrappedMap = withScriptjs(withGoogleMap(Map));

    return ( 
        <div style={{ height:"80vh"}}>
            <WrappedMap 
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyC2oopGaIUCARgdwcLX02cztRtOG4Vcvwg`} 
                loadingElement={<div style={{height:"100%"}} />}
                containerElement={<div style={{height:"100%"}} />}
                mapElement={<div style={{height:"100%"}} />}
            />
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4 p-0">Profile</h2>
                    {error && <Alert variant="danger"> {error} </Alert>}
                    <strong>Email: </strong> {currentUser.email}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                        Update Profile
                    </Link>
                    </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2 p-0">
                <Button variant="link" onClick={handleLogout}>log Out</Button>
            </div>
        </div>
    );
}