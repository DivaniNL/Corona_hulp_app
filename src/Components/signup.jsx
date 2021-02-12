import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import firebase from './../firebase';

const database = firebase.database().ref('user');

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const NameRef = useRef();
    const ImgUrlRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        if (passwordRef.current.value.length < 6) return setError("Password to small. Password needs to consist of at least 6 characters.");
        if (passwordRef.current.value !== passwordConfirmRef.current.value) return setError("passwords do not match");
        try {
            setError('');
            setLoading(true);
            
            await signup(emailRef.current.value, passwordRef.current.value);
            // saveUserInfoToDb(emailRef.current.value, NameRef.current.value, ImgUrlRef.current.value);
            history.push("/");
        } catch {
            setError('failed to create an account');
        }
        setLoading(false);
    }
    function fileSelectHandler(event) {
        console.log(event)
    }
    
    // function saveUserInfoToDb(email, name, ImgUrl ){
    //     let newUser = { emailadress: email, fullname: name, userImage: ImgUrl}
    //     firebase.database().ref('user').push(newUser).then(() => {
    //         console.log("yes");
    //     });
    // }

    return (
        <div>
            <Card className="p-3">
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="naam">
                        <Form.Label>voledige naam</Form.Label>
                        <Form.Control type="text" ref={NameRef} required />
                    </Form.Group>
                    <Form.Group id="naam">
                        <Form.Label>user image</Form.Label>
                        <Form.Control type="file" onChange={fileSelectHandler()} required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef}  required />
                    </Form.Group>
                    <Form.Group id="passwordconfirm" >
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>
                    <Button disabled={loading} type="submit" className="w-100">Sign Up</Button>
                </Form>
            </Card>
            <div>
            Already have an account ? <Link to="/login">Login</Link> 
            </div>
        </div>
    )
}
 
