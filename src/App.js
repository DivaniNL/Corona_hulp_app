import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import firebase from './firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import Signup from './Components/signup'
import { Container } from 'react-bootstrap'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './Components/dashboad'
import Login from './Components/login'
import PrivateRoute from './Components/PrivateRoute'


const database = firebase.database().ref('markers');

class App extends Component {

 activateLasers = (actioni, desci, idi, lati, lngi, senderi) =>{
      // var bcrypt = require('bcryptjs');
      // var salt = bcrypt.genSaltSync(10);
      // var hash = bcrypt.hashSync(password, salt);
      console.log("test")
      var newItem = { action: actioni, desc: desci, id: idi, lat: lati, lng: lngi, sender: senderi }
       firebase.database().ref('actions').push(newItem);
   }
  render(){
    return (
          <div className="container-fluid p-0" >
                <Router>
                    <AuthProvider>
                        <Switch>
                            <PrivateRoute exact path="/" component={Dashboard} abc={this.state}/>
                            <Route path="/signup" component={Signup} />
                            <Route path="/login" component={Login} />
                        </Switch> 
                    </AuthProvider>
                </Router>
          </div>
   );
    
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

export default App;