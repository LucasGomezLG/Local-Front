import React from 'react';
import './App.css';
import Productos from './components/productos/productos';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Locales from './components/locales/locales';

function App() {
  return (
    <BrowserRouter>
      <Switch>

        <Route path="/locales" render={(props) => <Locales {...props} />} />
        <Route path="/productos" render={(props) => <Productos {...props} />} />



      </Switch>
    </BrowserRouter>
  );
}

export default App;
