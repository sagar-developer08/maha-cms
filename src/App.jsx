import React, { Suspense } from "react";

import Routes from "src/routes/routes";
import Loader from "src/components/common/Loader/Index";
import LangContext from "src/utils/LanguageContext";
import { store, persistor } from "src/store/index";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "./App.css";

function App() {
  const [lang, setLang] = React.useState("en");

  return (
    <>
      <LangContext.Provider value={{ lang, setLang }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ToastContainer
              position="top-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover={false}
              theme="light"
            />
            <Suspense fallback={<Loader />}>
              <Routes />
            </Suspense>
          </PersistGate>
        </Provider>
      </LangContext.Provider>
    </>
  );
}

export default App;
