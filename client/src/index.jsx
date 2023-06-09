import ReactDOM from 'react-dom/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import CallContextProvider from './hooks/useCall';
import App from './App';
import { store, persistor } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        leads: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        users: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

//    https://recrm.herokuapp.com/graphql
const client = new ApolloClient({
  // uri: 'http://localhost:4000/graphql',
  uri: 'https://recrm.herokuapp.com/graphql',
  //  uri: 'https://crm-server-v1.herokuapp.com/graphql',
  cache,
});

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
        <BrowserRouter>
          <ApolloProvider client={client}>
            <CallContextProvider>
              <App />
            </CallContextProvider>
          </ApolloProvider>
        </BrowserRouter>
      </HelmetProvider>
    </PersistGate>
  </Provider>
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
