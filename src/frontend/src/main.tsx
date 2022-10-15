import React from 'react';
import ReactDOM from 'react-dom/client';

// Root component
import Root from './views/root/Root';

// router
import {BrowserRouter as Router} from "react-router-dom";

// redux
import {Provider} from 'react-redux';
import {PersistGate} from "redux-persist/integration/react";
import {store, persistor} from "./redux";

// helmet provider
import {HelmetProvider} from "react-helmet-async";

// window size provider
import WindowSizeProvider from "./providers/window-size-provider.component";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <WindowSizeProvider>
            <Router>
              <Root />
            </Router>
          </WindowSizeProvider>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
