import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'
export default function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage ] = useState('')
    const [loading, setLoading] = useState(false)


    function handleSubmit(e) {
        e.preventDefault()

        
        sign();
        async function sign(){ 
        try {
            setError('');
            setMessage('');
            setLoading(true);
            await resetPassword(emailRef.current.value)
            setMessage("check your inbox for further instructions ")
        } catch {
            setError('failed to reset password')
        }
        setLoading(false)
        };
    }
    return (
        <div className="loginpage">
            <Card  className="">
                <Card.Body>
                    <h2 className="">Password Reset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label className="form-name">Email <br/></Form.Label>
                        <Form.Control className="form-control" type="email" ref={emailRef} required />
                    </Form.Group><br/>
                    <Button disabled={loading}  type="submit" className="">Reset Password</Button>
                </Form>
            </Card><br/>
            <div>
                <Link to="/login">login</Link>
                    <br />
                need an account ? <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
}
 
