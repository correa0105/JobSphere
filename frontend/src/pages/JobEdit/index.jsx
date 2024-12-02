import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../services/axios';
import { Container } from '../../styles/GlobalStyles';
import Title from '../../components/Title';

export default function JobEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    numberOfHours: '',
    valuePerHour: '',
    workDate: '',
    location: '',
    employer: '',
  });

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`/job/myjob/${id}`);
        const { numberOfHours, valuePerHour, workDate, location, employer } = response.data.job;
        setJobData({
          numberOfHours,
          valuePerHour,
          workDate: workDate.split('T')[0],
          location,
          employer,
        });
      } catch (err) {
        toast.error('Error loading job data.');
        navigate('/');
      }
    };

    fetchJobData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/job/myjob/${id}`, jobData);
      toast.success('Job updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Error updating job.');
    }
  };

  return (
    <Container className="mt-4 mt-lg-5 mx-3 mx-lg-auto">
      <Title text="Editar Trabalho" />
      <form onSubmit={handleUpdate} className="mt-4">
        <label htmlFor="numberOfHours" className="form-label w-100 d-flex flex-column gap-2 mt-3">
          Hours Worked:
          <input
            type="number"
            id="numberOfHours"
            name="numberOfHours"
            className="form-control"
            value={jobData.numberOfHours}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="valuePerHour" className="form-label w-100 d-flex flex-column gap-2 mt-3">
          Hourly Rate:
          <input
            type="number"
            id="valuePerHour"
            name="valuePerHour"
            className="form-control"
            value={jobData.valuePerHour}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="workDate" className="form-label w-100 d-flex flex-column gap-2 mt-3">
          Job Date:
          <input
            type="date"
            id="workDate"
            name="workDate"
            className="form-control"
            value={jobData.workDate}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="location" className="form-label w-100 d-flex flex-column gap-2 mt-3">
          Place:
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={jobData.location}
            onChange={handleChange}
            required
          />
        </label>
        <label htmlFor="employer" className="form-label w-100 d-flex flex-column gap-2 mt-3">
          Employer:
          <input
            type="text"
            id="employer"
            name="employer"
            className="form-control"
            value={jobData.employer}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary mt-3">
          Save Changes
        </button>
      </form>
    </Container>
  );
}
