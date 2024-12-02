import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Card } from 'react-bootstrap';
import { get } from 'lodash';
import { toast } from 'react-toastify';

import axios from '../../services/axios';
import * as actions from '../../store/modules/auth/actions';

import { Container } from '../../styles/GlobalStyles';
import InputSelect from './styled';
import Input from '../../components/Input';
import Title from '../../components/Title';
import Button from '../../components/Button';

export default function JobsCreate() {
  const [job, setJob] = useState({ employer: 'Fletch' });
  const [employer, setEmployer] = useState([]);
  const [isFixed, setIsFixed] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleChange(e) {
    setJob({ ...job, [e.target.name]: e.target.value });
  }

  function handleSelect(e) {
    setJob({ ...job, employer: e.target.options[e.target.selectedIndex].text });
  }

  function handleFixedChange(e) {
    setIsFixed(e.target.checked);
    if (!e.target.checked) setSelectedDays([]);
  }

  function handleDayChange(e) {
    const { name, checked } = e.target;
    setSelectedDays((prevDays) =>
      checked ? [...prevDays, name] : prevDays.filter((day) => day !== name),
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const jobData = {
      ...job,
      ...(selectedDays.length > 0 && { dayWeek: selectedDays.map(Number) }),
    };

    try {
      await axios.post('/job/', jobData);
      toast.success('Job registered successfully!');
      setJob({});
      setIsFixed(false);
      setSelectedDays([]);
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

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`/employer/`);
        setEmployer(response.data);
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
    getData();
  }, [dispatch, navigate]);

  return (
    <Container className="mt-4 mt-lg-5 mx-3 mx-lg-auto">
      <Card.Body>
        <Title text="Register Work" />
        <Form onSubmit={(e) => handleSubmit(e)}>
          <InputSelect>
            <span>Employer</span>
            <select name="employer" value={job.employer} onChange={handleSelect}>
              {employer.map((employerResult) => (
                <option key={employerResult.name} value={employerResult.name}>
                  {employerResult.name}
                </option>
              ))}
            </select>
          </InputSelect>
          <Input
            className="mt-2"
            text="Hours Worked"
            value={job.numberOfHours || ''}
            name="numberOfHours"
            onChange={(e) => handleChange(e)}
            type="text"
          />
          <Input
            className="mt-2"
            text="Hourly Rate"
            value={job.valuePerHour || ''}
            name="valuePerHour"
            onChange={(e) => handleChange(e)}
            type="text"
          />
          <Input
            className="mt-2"
            text="Place"
            value={job.location || ''}
            name="location"
            onChange={(e) => handleChange(e)}
            type="text"
          />

          <Form.Check className="my-0 p-0 mt-3 d-flex">
            <Form.Check.Label
              className="bg-primary d-flex justify-content-center align-items-center"
              style={{
                minWidth: '11rem',
                height: '33px',
                color: '#fff',
                fontSize: '1.2rem',
              }}
            >
              Fixed
            </Form.Check.Label>
            <div
              className="d-flex align-items-center"
              style={{
                background: '#eee',
                width: '100%',
                paddingLeft: '.6rem',
                paddingRight: '.5rem',
              }}
            >
              <Form.Check.Input
                type="checkbox"
                className="m-0"
                checked={isFixed}
                onChange={(e) => handleFixedChange(e)}
                style={{ width: '8%', height: '40%' }}
              />
            </div>
          </Form.Check>
          {!isFixed && (
            <Input
              className="mt-2"
              text="Date"
              value={job.specificDate || ''}
              name="specificDate"
              onChange={(e) => handleChange(e)}
              type="date"
            />
          )}
          {isFixed && (
            <>
              <Input
                className="mt-2"
                text="Start"
                value={job.initialDate || ''}
                name="initialDate"
                onChange={(e) => handleChange(e)}
                type="date"
              />
              <Input
                className="mt-2"
                text="End"
                value={job.finalDate || ''}
                name="finalDate"
                onChange={(e) => handleChange(e)}
                type="date"
              />
              <div className="mt-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <Form.Check
                    key={day}
                    type="checkbox"
                    label={day}
                    name={String(index)}
                    checked={selectedDays.includes(String(index))}
                    onChange={(e) => handleDayChange(e)}
                  />
                ))}
              </div>
            </>
          )}
          <Button className="btn w-100 btn-primary mt-4" text="Register" type="submit" />
        </Form>
      </Card.Body>
    </Container>
  );
}
