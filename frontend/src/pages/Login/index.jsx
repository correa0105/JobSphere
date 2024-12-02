import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Card } from 'react-bootstrap';

import * as actions from '../../store/modules/auth/actions';

import { Container } from '../../styles/GlobalStyles';
import Input from '../../components/Input';
import Title from '../../components/Title';
import Button from '../../components/Button';

export default function LoginForm() {
  const [user, setUser] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prevPath = useLocation().state;

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(actions.loginRequest({ user, prevPath: () => navigate(prevPath || '/') }));
  }

  return (
    <Container className="mt-4 mt-lg-5 mx-3 mx-lg-auto">
      <Card.Body>
        <Title text="Login" />
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Input
            className="mt-2"
            text="Email"
            name="email"
            onChange={(e) => handleChange(e)}
            type="email"
            placeholder="Enter your email"
          />
          <Input
            className="mt-2"
            text="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            type="password"
            placeholder="Enter your password"
          />
          <Button className="btn w-100 btn-primary mt-4" text="Access" type="submit" />
          <p className="mt-4 h4">
            Don&apos;t have access? <Link to="/register">Click here!</Link>
          </p>
        </Form>
      </Card.Body>
    </Container>
  );
}
