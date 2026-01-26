const express = require('express');
const port = process.env.PORT || 3000;
const activitiesRouter = require('./routes/activities');
const memberRouter = require('./routes/members');
const depensesRouter = require('./routes/depenses');
const queteRouter = require('./routes/quete');
const lotBilletRouter = require('./routes/lot_billet');
const billetsRouter = require('./routes/billets');
const sansBilletRouter = require('./routes/sans_billet');
const utilisateursRouter = require('./routes/utilisateurs');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use('/api/activities', activitiesRouter);
app.use('/api/members', memberRouter);
app.use('/api/depenses', depensesRouter);
app.use('/api/quete', queteRouter);
app.use('/api/lot_billet', lotBilletRouter);
app.use('/api/billets', billetsRouter);
app.use('/api/sans_billets', sansBilletRouter);
app.use('/api/utilisateurs', utilisateursRouter);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Swagger docs available at http://localhost:5000/api-docs");
});