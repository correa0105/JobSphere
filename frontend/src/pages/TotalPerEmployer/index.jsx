import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import axios from '../../services/axios';
import { Container } from '../../styles/GlobalStyles';
import Title from '../../components/Title';

export default function EmployerReport() {
  const [employerReport, setEmployerReport] = useState(null);
  const [employers, setEmployers] = useState([]);
  const [selectedEmployer, setSelectedEmployer] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Mês atual
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Ano atual
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await axios.get('/employer/');
        setEmployers(response.data);
      } catch (err) {
        toast.error('Error loading jobs.');
      }
    };
    fetchEmployers();
  }, []);

  const fetchReport = async (employerId, month, year) => {
    try {
      const response = await axios.get(
        `/job/totalHoursPerEmployer?employer=${employerId}&month=${month}&year=${year}`,
      );
      setEmployerReport(response.data);
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

  const handleEmployerChange = async (event) => {
    const employerId = event.target.value;
    setSelectedEmployer(employerId);

    if (employerId) {
      fetchReport(employerId, selectedMonth, selectedYear);
    } else {
      setEmployerReport(null);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    if (selectedEmployer) {
      fetchReport(selectedEmployer, event.target.value, selectedYear);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    if (selectedEmployer) {
      fetchReport(selectedEmployer, selectedMonth, event.target.value);
    }
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
      <Title text="Hours Report by Employer" />
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
        <label htmlFor="employerSelect" className="d-flex flex-column form-label">
          Select Employer:
          <select
            id="employerSelect"
            className="form-select mt-2"
            value={selectedEmployer}
            onChange={handleEmployerChange}
          >
            <option value="">Choose an Employer</option>
            {employers.map((employer) => (
              <option key={employer.id} value={employer.name}>
                {employer.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {/* Seletor de Mês e Ano */}
      <section className="d-flex gap-3 flex-column bg-light p-4 rounded mt-3">
        {employerReport ? (
          <div className="d-flex flex-column gap-2 p-3 bg-white rounded shadow-lg">
            <p>Employer: {employerReport.employer}</p>
            <p>Total Hours: {employerReport.totalHours}H</p>
            <p>Total Billed: £{employerReport.totalAmount.toFixed(2)}</p>
            <p>Month: {employerReport.month}</p>
          </div>
        ) : (
          <p className="text-center">Select an employer to view the report.</p>
        )}
      </section>
    </Container>
  );
}
