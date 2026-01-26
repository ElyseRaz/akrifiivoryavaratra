const {Pool} = require('pg');
require('dotenv').config();



const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect((err: { stack: any; },client: any,release: () => void) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Database connected successfully');
    release();
}
);

module.exports = {
  query: (text: any, params: any) => pool.query(text, params),
  pool 
};