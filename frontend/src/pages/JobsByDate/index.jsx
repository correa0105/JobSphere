import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import axios from '../../services/axios';
import { Container } from '../../styles/GlobalStyles';
import Title from '../../components/Title';

export default function JobsByDate() {
  const [selectedDate, setSelectedDate] = useState('');
  const [jobs, setJobs] = useState([]);

  const navigate = useNavigate();

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleEditClick = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleDeleteClick = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await axios.delete(`/job/${jobId}`);
      toast.success('Job deleted successfully.');
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      const errors = get(err, 'response.data.errors', []);
      errors.forEach((error) => toast.error(error));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  useEffect(() => {
    const fetchJobsByDate = async () => {
      if (!selectedDate) return;

      try {
        const response = await axios.get(`/job/byDate?date=${selectedDate}`);
        setJobs(response.data.jobs);
      } catch (err) {
        const errors = get(err, 'response.data.errors', []);
        const status = get(err, 'response.status', 0);

        if (status === 401) {
          toast.error('You need to log in again.');
          navigate('/login');
        }
        errors.forEach((error) => toast.error(error));
      }
    };

    fetchJobsByDate();
  }, [selectedDate, navigate]);

  return (
    <Container className="mt-4 mt-lg-5 mx-3 mx-lg-auto">
      <Title text="Jobs by Date" />
      <section className="mt-3">
        <label htmlFor="dateSelect" className="d-flex flex-column form-label">
          Select the Date:
          <input
            type="date"
            id="dateSelect"
            className="form-control mt-2"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </label>
      </section>
      <section className="d-flex gap-3 flex-column bg-light p-4 rounded mt-3">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="d-flex flex-column gap-2 p-3 bg-white rounded shadow-lg">
              <p>Place: {job.location}</p>
              <p>Hours Worked: {job.number_of_hours}H</p>
              <p>Hourly Rate: £{job.value_per_hour}</p>
              <p>Date: {formatDate(job.workDate)}</p>
              <div className="d-flex gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => handleEditClick(job.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger w-100"
                  onClick={() => handleDeleteClick(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No jobs found for this date.</p>
        )}
      </section>
    </Container>
  );
}
