import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import InjuredPage from './routes/injured';
import MiscPage from './routes/misc';
import InsuranceHolderAPage from './routes/insurance-holder-a';
import DriverOfA from './routes/driver-of-a';
import OtherInsuranceHolderPage from './routes/insurance-holder-b';
import DriverOfBPage from './routes/driver-of-b';
import WitnessesPage from './routes/witnesses';
import DisclaimerPage from './routes/disclaimer';
import ResultPage from './routes/request-result';

const basename =
  process.env.REACT_APP_BASENAME || '/frida-carclaims-frontend';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DisclaimerPage />,
  },
  {
    path: '/accident',
    element: <Root />,
  },
  {
    path: '/injured',
    element: <InjuredPage />,
  },
  {
    path: '/miscellaneous-damage',
    element: <MiscPage />,
  },
  {
    path: '/insurance-holder-a',
    element: <InsuranceHolderAPage />,
  },
  {
    path: '/driver-of-insurance-holder-a',
    element: <DriverOfA />,
  },
  {
    path: '/insurance-holder-b',
    element: <OtherInsuranceHolderPage />,
  },
  {
    path: '/driver-of-insurance-holder-b',
    element: <DriverOfBPage />,
  },
  {
    path: '/witnesses',
    element: <WitnessesPage />,
  },
  {
    path: '/results',
    element: <ResultPage />,
  },
], {
  basename: basename,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
