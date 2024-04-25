const sql = require('mssql');

module.exports = async function (context, req) {
    context.log('SearchMovies function processed a request.');

    const searchQuery = req.query.search;

    const pool = new sql.ConnectionPool(process.env.SqlConnectionString);
    await pool.connect();

    try {
        const result = await pool.request()
            .input('SearchQuery', sql.NVarChar, `%${searchQuery}%`)
            .query(`SELECT * FROM Movies WHERE Title LIKE @SearchQuery`);
        
        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Error searching movies."
        };
    } finally {
        pool.close();
    }
};