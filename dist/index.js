"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_1 = __importDefault(require("./config/swagger"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const databaseConfig_1 = __importDefault(require("./config/databaseConfig"));
const candidateRoutes_1 = __importDefault(require("./routes/candidateRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const commonRoutes_1 = __importDefault(require("./routes/commonRoutes"));
const recruiterRoutes_1 = __importDefault(require("./routes/recruiterRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
// Import all models to ensure collections are created
require("./model/adminModel");
require("./model/candidateModel");
require("./model/candidateJobModel");
require("./model/clientModel");
require("./model/jobsModel");
require("./model/recruiterModel");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
// Swagger setup
const swaggerDocs = (0, swagger_jsdoc_1.default)(swagger_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({
    exposedHeaders: ["*"]
}));
(0, databaseConfig_1.default)();
app.use('/', clientRoutes_1.default);
app.use('/', candidateRoutes_1.default);
app.use('/', adminRoutes_1.default);
app.use('/', commonRoutes_1.default);
app.use('/', recruiterRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running at  http://localhost:${port}`);
});
