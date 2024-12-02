import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { format } from 'date-fns';
import axios from '../../services/axios';
import { Container } from '../../styles/GlobalStyles';
import Title from '../../components/Title';
import { Button } from './styled';

export default function Dashboard() {
  const [day, setDay] = useState('today');
  const [jobs, setJobs] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentMonthName = format(new Date(), 'MMMM');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/job/getJobsTodayOrTomorrow?dateType=${day}`);
        const jobsData = response.data.jobs;

        setJobs(jobsData);

        const total = jobsData.reduce((acc, job) => acc + job.numberOfHours * job.valuePerHour, 0);
        setTotalPayment(total);
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

    const fetchTotalHours = async () => {
      try {
        const response = await axios.get(`/job/totalHours?month=${currentMonth}&year=${currentYear}`);
        setTotalHours(response.data.totalHours);
        setTotalAmount(response.data.totalAmount);
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

    fetchData();
    fetchTotalHours();
  }, [day, navigate, currentMonth, currentYear]);

  return (
    <Container className="mt-4 mt-lg-5 mx-3 mx-lg-auto">
      <Title text={`Dashboard - ${currentMonthName}`} />
      <div className="d-flex mt-3">
        <Button
          className="py-2 rounded-start"
          isActive={day === 'today'}
          onClick={() => setDay('today')}
        >
          Today
        </Button>
        <Button
          className="py-2 rounded-end"
          isActive={day === 'tomorrow'}
          onClick={() => setDay('tomorrow')}
        >
          Tomorrow
        </Button>
      </div>
      <section className="d-flex justify-content-center align-items-center bg-info rounded mt-3">
        <h4 className="text-white m-0 p-3">
          Value For {day === 'today' ? 'Today' : 'Tomorrow'}: £${totalPayment.toFixed(2)}
        </h4>
      </section>
      <section className="d-flex gap-3 flex-column bg-light p-4 rounded mt-3">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="d-flex flex-column gap-2 p-3 bg-white rounded shadow-lg">
              <p>Employer: {job.employer}</p>
              <p>Hours Worked: {job.numberOfHours}</p>
              <p>Hourly Rate: £${job.valuePerHour}</p>
              <p>Work Date: {new Date(job.workDate).toLocaleDateString()}</p>
              <p>Place: {job.location}</p>
            </div>
          ))
        ) : (
          <p className="text-center">No jobs found for {day === 'today' ? 'today' : 'tomorrow'}.</p>
        )}
      </section>
      <section className="d-flex flex-column gap-3 bg-secondary rounded mt-3 p-3">
        <span className="align-self-start bg-info rounded fs-4 px-2 py-1">Current Month</span>
        <h4 className="m-0 ms-1">Total Hours: {totalHours}H</h4>
        <h4 className="m-0 ms-1">Total Billed: £${totalAmount.toFixed(2)}</h4>
      </section>
    </Container>
  );
}
