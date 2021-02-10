import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
const database = firebase.database().ref('speed');
class App extends Component {
  constructor(props){
    super(props)
    
    this.state = {
      name: 10,
      phone: 10,
      array: []

    }
  }

  componentDidMount() {

    database.on('child_added', snap => {

      const map = snap.val();
      this.setState({
        name: map.userName,
        phone: map.userPhone,
        array: [...this.state.array, map]
      })
      console.log(this.state.array)
    })
  }
  activateLasers(){
    console.log("test")
    var newItem = { userName: 'testmaxjakedylan', userPhone: 54535 }
    firebase.database().ref('speed').push(newItem);
    
  }
  function2(){
    database.once('value', snap => {

      for(let i = 0; i < 3; i++){
        console.log(snap.child("userName"));
      }
    })
  }
  render(){
    return (
      <div>
        <button onClick={this.function2}>dsdsds</button>

        <h1>The value is {this.state.name}</h1>
        <button onClick={this.activateLasers}>
          Activate Lasers
        </button>
      </div>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

export default App;