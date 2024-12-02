import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './store';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import ContainerRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Header />
          <div style={{ minHeight: '100vh' }}>
            <ContainerRoutes />
            <ToastContainer closeButton={false} autoClose={1000} position="top-right" />
          </div>
          <Footer />
          <GlobalStyles />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
