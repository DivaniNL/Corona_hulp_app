import React, { useEffect, setFiles, useRef, useState } from 'react'
import { Form, Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom"
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from 'react-google-maps'
import * as data from './data/markers.json';
import firebase from 'firebase';
import makeMarker from './makemarker';
export default function Dashboard() {
    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const [loading, setLoading] = useState(false)
    const history = useHistory();
    let POIlist = [];
    let POIOwn = [];
    const senderRef = useRef();
    const descRef = useRef();
    const catRef = useRef();
    let lati;
    let long;
    let test;
    const ownitems = [];
    var usertest = "";
 
    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('failed to log out')
        }
    }

// function getLocation() {
//     console.log("test btn");
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   }
// }

function showPosition(position) {
   console.log(position.coords.latitude, position.coords.longitude);
    lati = position.coords.latitude;
    long = position.coords.longitude;
    console.log(lati, long);
    sessionStorage.setItem('lati', lati);
    sessionStorage.setItem('long', long);
    console.log(sessionStorage.getItem('lati'));
  }

    // firebase.database().ref("/").on("value", activities => {
    //     activities.forEach(activity => {
    //           POIlist.push(activity.val());
    //     });
    // })
    useEffect(() => {
        var markers = firebase.database().ref("markers")
        markers.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                POIlist.push(childData);

            });
            sessionStorage.setItem('POIlist', JSON.stringify(POIlist))
        })
        
        var user = firebase.database().ref("user")
        user.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if(childData.emailadress == currentUser.email){
                    usertest = childData.fullname;
                    // console.log(currentUser);
                    console.log(childData.image);
                    sessionStorage.setItem('username', childData.fullname);
                    sessionStorage.setItem('id', currentUser.uid);
                    sessionStorage.setItem('image', childData.image);
                } else {
                    // console.log("123")
                }

            });

        })
        

        // firebase.database.ref("user").orderByChild("emailadress").equalTo(currentUser.email).once("value", function (snapshot) {
        //  snapshot.forEach(function(schildSnapShot){
        //      var cellNum=schildSnapShot.val().CellNum;
        //         console.log(cellNum);
        // });
        // });
    });



    function sendMarker(desc_sended, category_sended) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);

          } else { 
          }
        //   console.log(usertest);
        console.log(sessionStorage.getItem('image'));
        let newMarker = { action: category_sended, image: sessionStorage.getItem('image'), id: currentUser.uid , desc: desc_sended, lat: parseFloat(sessionStorage.getItem('lati')), lng: parseFloat(sessionStorage.getItem('long')), sender: sessionStorage.getItem('username') }
        firebase.database().ref('markers').push(newMarker).then(() => {

        });
    }
   function renderOproepen(){

        var own_markers = firebase.database().ref("markers")
        let table = document.createElement("table");
        own_markers.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();

                // console.log(sessionStorage.getItem('username'));

                document.getElementById("demo").appendChild(table)
                if(sessionStorage.getItem('username') == childData.sender){
                    // console.log("je hebt een item op jouw naam");
                    var descs = childData.desc;
                    var sender = childData.sender;
                    let tr = document.createElement("tr");
                    table.appendChild(tr);

                    let desctd = document.createElement("td");
                    tr.appendChild(desctd);

                    let sendertd = document.createElement("td");
                    tr.appendChild(sendertd);

                    desctd.innerHTML = descs;   
                    sendertd.innerHTML = sender;        
                }
                
                POIOwn.push(childData);
                // console.log(ownitems)

            });
            
        })

        return ownitems;
        

    }
    function postImage(current){
        const storageRef = firebase.storage().ref("/");
        storageRef.child(`images/${current}`).getDownloadURL()
        .then((url) => {
            let avatar = document.createElement("img");
            avatar.setAttribute('src', url);
            avatar.classList.add("popup_avatar");
            document.getElementById("avatar_div").appendChild(avatar);
            if(document.getElementById("avatar_div").children.length > 1){
            document.getElementById("avatar_div").removeChild(document.getElementById("avatar_div").firstChild);
            }
            
        })

        
    }
    function makeMarker(e) {
        e.preventDefault()


        send();
        async function send() {
            try {
                setError('');
                setLoading(true);
                await sendMarker( descRef.current.value, catRef.current.value)
                history.push("/");
                window.location.reload();
            } catch {
                setError('failed to make a marker')
            }
            setLoading(false)
        };
    }
    function Map() {


        // console.log("test")
        // console.log(data.markers);
        // console.log(JSON.stringify(POIlist));
        var list = JSON.parse(sessionStorage.getItem('POIlist'));
        // console.log(list);
        const [selectedMarker, setSelectedMarker] = useState(null);
        const getFilename = (id) => data.actions[id].filename;
        const getAction = (id) => data.actions[id].action;
        return (<GoogleMap
            defaultZoom={12}
            defaultCenter={{ lat: 52.076918, lng: 5.106366 }}
            options={{ gestureHandling: "greedy" }}>
            {

                list.map(marker =>

                    <Marker

                        key={marker.id}
                        position={{ lat: marker.lat, lng: marker.lng }}

                        onClick={() => {
                            setSelectedMarker(marker);
                            console.log(marker)
                        }}
                        // ${getFilename(marker.action)}
                        icon={{
                            url: `/dist/svg/${getFilename(marker.action)}`,
                            scaledSize: new window.google.maps.Size(45, 45)
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
                    <div id="popup" style={{ width: '220px', overflow: 'hidden' }}>
                        <h2>{getAction(selectedMarker.action)}</h2>
                        <p>{selectedMarker.sender}</p>
                        <p>{selectedMarker.desc}</p>
                        <div id="avatar_div">
                        {postImage(selectedMarker.image)}
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
        )
    }



  



    const WrappedMap = withScriptjs(withGoogleMap(Map));

    return (
        
        <div>

            <div style={{ float: "left", height: "80vh", width: "75vw" }}>

             
                <WrappedMap
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyC2oopGaIUCARgdwcLX02cztRtOG4Vcvwg`}
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div style={{ height: "100%" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                />

            </div>
            <div style={{ border: "1px solid black", float: "right",   height: "40vh", width: "25vw" }}>

                <Card className="">
                    <Card.Body>
                        <h2 className="text-center mb-4">Log In</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Card.Body>
                    <Form  name="locform"id="markerform"onSubmit={makeMarker}>
                        {/* <Form.Group id="sender">
                            <Form.Label>Sender</Form.Label>
                            <Form.Control type="text" ref={senderRef} required />
                        </Form.Group> */}
                        <Form.Group id="desc">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" ref={descRef} required />
                        </Form.Group>
                        
                        <Form.Group id="category">
                            <Form.Label>Category</Form.Label>
                              <Form.Control as="select" ref={catRef} required>
                                <option value = "0">Boodschappen doen</option>
                                <option value = "1">Fietsen</option>
                                <option value = "2">Hardlopen</option>
                                <option value = "3">Hond Uitlaten</option>
                                <option value = "4">Wandelen</option>
                            </Form.Control >
                        </Form.Group>
                        <Button disabled={loading} type="submit" className="w-100">Log In</Button>
                    </Form>
                </Card>
            </div>
            <div style={{ border: "1px solid black", float: "right", height: "40vh", width: "25vw" }}>

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
            <div id="demo">
            {renderOproepen()}
            
            </div>
        </div>
    );
}