const sql = require('mssql');

module.exports = async function (context, req) {
    context.log('AddRating function processed a request.');

    const requestBody = req.body;

    if (!requestBody || !requestBody.title || !requestBody.rating) {
        return context.res.status(400).send('Please provide movie title and rating');
    }

    const pool = new sql.ConnectionPool(process.env.SqlConnectionString);
    await pool.connect();

    try {
        const result = await pool.request()
            .input('MovieTitle', sql.NVarChar, requestBody.title)
            .input('Opinion', sql.NVarChar, requestBody.opinion || '')
            .input('Rating', sql.Int, requestBody.rating)
            .input('Date', sql.DateTime, new Date())
            .input('Author', sql.NVarChar, requestBody.author || '')
            .query(`INSERT INTO Ratings (MovieTitle, Opinion, Rating, Date, Author) VALUES (@MovieTitle, @Opinion, @Rating, @Date, @Author)`);
        
        context.res = {
            status: 200,
            body: "Rating added successfully."
        };
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Error adding rating."
        };
    } finally {
        pool.close();
    }
};