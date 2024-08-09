const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const fs = require("fs")
const YAML = require('yaml')
const cors = require('cors')


require('dotenv').config();

/**
 * Routes
 */
const userRoutes = require("./routes/user.route");
const taskRoutes = require("./routes/task.route");

/**
 * Sequelize && allows the app to 
 * create all tables in the database
 */
const sequelize = require('./utils/database');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'PATCH', 'PUT', 'PUT', 'DELETE');
	next();
})

/**
 * Log all requests
 */
app.use(morgan('dev'));

app.use(cors())
/**
 * Endpoints
 */
app.use("/api", userRoutes);
app.use("/api/tasks", taskRoutes);

/**
 * Swagger documentation
 */
const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


(async ()=>{
	//Development mode
	if(process.env.PGDATABASE == undefined) process.env.PGDATABASE = 'projeasy_db';
	if(process.env.PGUSER == undefined) process.env.PGUSER = 'root';
	if(process.env.PGPASSWORD == undefined) process.env.PGPASSWORD = '';
	if(process.env.PGHOST == undefined) process.env.PGHOST = 'localhost';

	try{
		//Create all tables before bootstrap the app
		await sequelize.sync(
			{ force:false }
		).then(async()=>{

			//Création d'un compte utilisateur par defaut (admin)
			const su = {
				lastname: 'admin',
		        name: 'admin',
		        email: 'admin@admin.projeasy',
		        password: 'admin',
		        role: 'admin'
			}
			await sequelize.query(`SELECT * FROM USERS WHERE email ='admin@admin.projeasy';`).then( async (response)=>{
				if(response[0].length ==0) {
					await User.create(su);
				}
			})
			
		})

		app.listen(process.env.EXTERNAL_PORT || 3000);
	}catch(error){
		console.log(error)
	}

})()

