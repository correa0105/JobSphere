import React from 'react';

import Logo from '../../assets/img/logo.png';

import Container from './styled';

export default function Footer() {
  return (
    <Container className="mt-4">
      <section>
        <p>
          All Rights Reserved @JobSphere - Since 2024{' '}
          <img src={Logo} alt="Logotipo MyMoney" width="22px" />
        </p>
      </section>
    </Container>
  );
}
