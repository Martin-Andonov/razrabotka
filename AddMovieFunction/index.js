const { v4: uuidv4 } = require('uuid');
const sql = require('mssql');

module.exports = async function (context, req) {
    context.log('AddMovie function processed a request.');

    const requestBody = req.body;
    
    if (!requestBody || !requestBody.title) {
        return context.res.status(400).send('Please provide movie title');
    }

    const pool = new sql.ConnectionPool(process.env.SqlConnectionString);
    await pool.connect();

    try {
        const result = await pool.request()
            .input('Title', sql.NVarChar, requestBody.title)
            .input('Year', sql.NVarChar, requestBody.year || '')
            .input('Genre', sql.NVarChar, requestBody.genre || '')
            .input('Description', sql.NVarChar, requestBody.description || '')
            .input('Director', sql.NVarChar, requestBody.director || '')
            .input('Actors', sql.NVarChar, requestBody.actors || '')
            .query(`INSERT INTO Movies (Title, Year, Genre, Description, Director, Actors) VALUES (@Title, @Year, @Genre, @Description, @Director, @Actors)`);
        
        context.res = {
            status: 200,
            body: "Movie added successfully."
        };
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Error adding movie."
        };
    } finally {
        pool.close();
    }
};