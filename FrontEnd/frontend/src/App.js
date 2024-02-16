import Login from './components/login/Login';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="App">
      <Login />
      <ToastContainer />
    </div>
  );
}

export default App;