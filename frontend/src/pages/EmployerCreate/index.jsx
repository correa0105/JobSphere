import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Card } from 'react-bootstrap';
import { get } from 'lodash';
import { toast } from 'react-toastify';

import axios from '../../services/axios';
import * as actions from '../../store/modules/auth/actions';

import { Container } from '../../styles/GlobalStyles';
import Input from '../../components/Input';
import Title from '../../components/Title';
import Button from '../../components/Button';

export default function EmployerCreate() {
  const [employer, setEmployer] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e) {
    setEmployer({ ...employer, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post('/employer/', employer);
      toast.success('Registered Employer!');
      setEmployer('');
    } catch (err) {
      const errors = get(err, 'response.data.errors', []);
      const status = get(err, 'response.status', 0);

      if (status === 401) {
        toast.error('You need to log in again.');
        navigate('/login');
        dispatch(actions.loginFailure());
      }

      errors.forEach((error) => toast.error(error));
    }
  }

  return (
    <Container className="mt-4 mt-lg-5 mx-3 mx-lg-auto">
      <Card.Body>
        <Title text="Register Employer" />
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Input
            className="mt-2"
            text="Employer Name"
            value={employer.name || ''}
            name="name"
            onChange={(e) => handleChange(e)}
            type="text"
          />
          <Button className="btn w-100 btn-primary mt-4" text="Register" type="submit" />
        </Form>
      </Card.Body>
    </Container>
  );
}
