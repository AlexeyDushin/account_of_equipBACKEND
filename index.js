import express from 'express'
import cors from 'cors'
import employeeRoutes from './routes/employees.js'; 
import typeEquipRoutes from './routes/typeEquips.js';
import equipRoutes from './routes/equips.js'; 
import empEquipRoutes from './routes/empEquips.js';
import officeEmployeesRoutes from './routes/officeEmployees.js';
import inventoryRoutes from './routes/inventory.js'

const PORT = 5000;
const app = express()
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json('server on')
})

app.use('/employees', employeeRoutes);
app.use('/typeEquips', typeEquipRoutes);
app.use('/equips', equipRoutes); 
app.use('/empEquips', empEquipRoutes);
app.use('/officeEmployees', officeEmployeesRoutes);
app.use('/inventory', inventoryRoutes);

async function startApp() {
    try {
        app.listen(PORT, () => console.log('Сервер запущен на http://localhost:' + PORT)) 
    } catch (error) {
        console.log(error)
    }
}
startApp()