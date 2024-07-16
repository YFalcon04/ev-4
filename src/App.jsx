import ReactDOM from 'react-dom/client'
/* Incorporar bs5 */
import 'bootstrap/dist/css/bootstrap.min.css';

/* Incorporar iconos */
import 'bootstrap-icons/font/bootstrap-icons.css';

import TodoList from './components/TodoList';

ReactDOM.createRoot(document.getElementById('root')).render(<TodoList/>);
