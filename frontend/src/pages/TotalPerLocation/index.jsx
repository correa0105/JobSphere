import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import axios from '../../services/axios';
import { Container } from '../../styles/GlobalStyles';
import Title from '../../components/Title';

export default function Dashboard() {
  const [locationReport, setLocationReport] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredJob, setFilteredJob] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Ano atual
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocationReport = async () => {
      if (!selectedMonth || !selectedYear) return; // Não faz a requisição se o mês ou o ano não estiverem definidos

      try {
        const response = await axios.get(
          `/job/totalPerLocation?month=${selectedMonth}&year=${selectedYear}`,
        );
        setLocationReport(response.data.jobs);
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

    fetchLocationReport();
  }, [selectedMonth, selectedYear, navigate]);

  const handleLocationChange = (event) => {
    const location = event.target.value;
    setSelectedLocation(location);
    const filtered = locationReport.find((job) => job.location === location);
    setFilteredJob(filtered);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <Container className="mt-4 mt-lg-5 mx-3 mx-lg-auto">
      <Title text="Work Report by Location" />

      {/* Seletor de Mês e Ano */}
      <section className="d-flex gap-2 mt-3">
        <select value={selectedMonth} onChange={handleMonthChange} className="form-select">
          {months.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>

        <select value={selectedYear} onChange={handleYearChange} className="form-select">
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </section>

      <section className="mt-3">
        <label htmlFor="locationSelect" className="d-flex flex-column form-label">
          Select a Location:
          <select
            id="locationSelect"
            className="form-select mt-2"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            <option value="">Choose a Location</option>
            {locationReport.map((job) => (
              <option key={job.location} value={job.location}>
                {job.location}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="d-flex gap-3 flex-column bg-light p-4 rounded mt-3">
        {filteredJob ? (
          <div className="d-flex flex-column gap-2 p-3 bg-white rounded shadow-lg">
            <p>Location: {filteredJob.location}</p>
            <p>Total Hours: {filteredJob.totalHours}H</p>
            <p>Hourly Rate: {filteredJob.valuePerHour}H</p>
            <p>Number Of Days Worked: {filteredJob.locationCount}</p>
            <p>Total Billed: £{filteredJob.totalPayment.toFixed(2)}</p>
          </div>
        ) : (
          <p className="text-center">Select a location to view the report.</p>
        )}
      </section>
    </Container>
  );
}
