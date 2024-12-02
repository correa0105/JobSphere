import React from 'react';

import { Container } from '../../styles/GlobalStyles';

export default function Home() {
  return (
    <Container className="mt-4 mt-lg-5 mx-3 mx-lg-auto">
      <h2>
        Welcome the <span className="bg-primary text-white mx-1 p-2 px-3 rounded">JobSphere</span>
      </h2>
      <p className="mt-4 fs-4">
        This is a personal project that I started with the aim of better managing the work carried out
        and the payments associated with them.
      </p>
      <p className="fs-4">
        The <span className="text-secondary fw-bold">JobSphere</span> is a management application jobs
        where you can record hours worked, hourly pay rates, and group information by both employer and
        location. With filtering features jobs per period and automatically calculate total hours and
        pay, JobSphere facilitates control of time and remuneration, bringing clarity to the process of
        providing services.
      </p>
      <p className="fs-4">
        As a developer of <span className="text-secondary fw-bold">JobSphere</span>, I plan on future add
        a dashboard with detailed views on monthly income and reports to control pending payments, as
        well as functionality for history and performance analysis.
      </p>
      <p className="fs-4">
        Request access via email: <span className="fw-bold">correa.l@icloud.com</span>
      </p>
    </Container>
  );
}
