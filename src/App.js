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


const database = firebase.database().ref('speed');

class App extends Component {
//  activateLasers = (email, firstName, lastName, password) =>{
//       var bcrypt = require('bcryptjs');
//       var salt = bcrypt.genSaltSync(10);
//       var hash = bcrypt.hashSync(password, salt);
//       console.log("test")
//       var newItem = { emailadres: email, voornaam: firstName, achternaam: lastName, wachtwoord: hash }
//        firebase.database().ref('speed').push(newItem);
//    }
  render(){
    return (
      <div>
          <Container className="d-flex align-items-center justify-content-center" style={{ minheight: "100vh" }}>
              <div className="w-100" style={{ maxWidth: '500px' }}>
                  <Router>
                      <AuthProvider>
                          <Switch>
                              <PrivateRoute exact path="/" component={Dashboard}/>
                              <Route path="/signup" component={Signup} />
                              <Route path="/login" component={Login} />
                          </Switch> 
                      </AuthProvider>
                  </Router>
                  
              </div>
          </Container>
      </div>
   );
    
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

export default App;