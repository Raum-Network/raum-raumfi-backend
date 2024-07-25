const db = require("../../../../db");

exports.getLiquidity = async (req, res) => {

    const client = await db.pool.connect();
    try {
        const values = [req.query.receiver];

        const addQuery = `
            SELECT *
            FROM add_liquidities
            WHERE receiver = $1
            ORDER BY timestamp DESC;
        `;
        const addLiquidity = (await client.query(addQuery, values)).rows;

        const removeQuery = `
            SELECT *
            FROM remove_liquidities
            WHERE receiver = $1
            ORDER BY timestamp DESC;
        `;
        const removeLiquidity = (await client.query(removeQuery, values)).rows;
        res.status(200).json({
            success: true,
            data: { addLiquidity, removeLiquidity }
        });
    } catch (err) {
        res.status(401).json({
            success: false,
            data: { "msg": "Something went wrong!" }
        });
    } finally {
        client.release();
    }
    
};
