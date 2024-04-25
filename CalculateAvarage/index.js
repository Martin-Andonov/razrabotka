const sql = require('mssql');

module.exports = async function (context, myTimer) {
    const pool = new sql.ConnectionPool(process.env.SqlConnectionString);
    await pool.connect();

    try {
        const result = await pool.request()
            .query(`UPDATE Movies SET AverageRating = (SELECT AVG(Rating) FROM Ratings WHERE Ratings.MovieTitle = Movies.Title)`);
        
        context.log('Average ratings updated successfully.');
    } catch (error) {
        context.log.error(error);
    } finally {
        pool.close();
    }
};