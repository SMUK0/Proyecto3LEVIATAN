import React from 'react'
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css'
import '../css/app.css'

const App = () => {
  return (
    <div>
      App
        <button className='btn btn-success'>
          BOTON
        </button>
    </div>
    
  )
}

export default App

if (document.getElementById('root')) {
  const Index = ReactDOM.createRoot(document.getElementById("root"));

  Index.render(
      <React.StrictMode>
          <App/>
      </React.StrictMode>
  )
}
