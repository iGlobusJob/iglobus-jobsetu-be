import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import connectToDb from './config/databaseConfig';
import VendorRouter from './routes/vendorRoutes';
import CandidateRouter from './routes/candidateRoutes';
import AdminRouter from './routes/adminRoutes';
import CommonRouter from './routes/commonRoutes';
import RecruiterRouter from './routes/recruiterRoutes';
import ClientRouter from './routes/clientRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY!;

// Swagger setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(
    session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(morgan('dev'));
app.use(cors({
    exposedHeaders: ["*"]
}));

connectToDb();
app.use('/', VendorRouter);
app.use('/',ClientRouter)
app.use('/', CandidateRouter);
app.use('/', AdminRouter);
app.use('/', CommonRouter);
app.use('/',RecruiterRouter)

app.listen(port, () => {
    console.log(`Server is running at  http://localhost:${port}`);
});
