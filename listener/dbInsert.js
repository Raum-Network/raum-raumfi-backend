const db = require("../db");

const getLastCrawledLedger = async () => {
    const client = await db.pool.connect();
    try {
        const query = `
            SELECT *
            FROM event_listener_config
            ORDER BY lastCrawled DESC
            LIMIT 1;
        `;
        const res = await client.query(query);
        if (res.rows.length > 0) {
            return res.rows[0];
        } else {
            console.log(1)
            return 720319;
        }
    } catch (err) {
        console.log(err)
        return 720319;
    } finally {
        client.release();
    }
}

const updateLastCrawledLedger = async (newValue, id) => {
    const client = await db.pool.connect();
    try {
        const query = `
            UPDATE event_listener_config
            SET lastCrawledLedgerId = $1, lastCrawled = NOW()
            WHERE id = $2;
        `;
        const values = [newValue, id];
        const res = await client.query(query, values);
        console.log(res);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error inserting data', err);
    } finally {
        client.release();
    }
}

const swapTransaction = async (event, decodedValue) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const insertQuery = `
          INSERT INTO swaps (eventId, txHash, amountIn, amountOut, tokenAAddress, tokenBAddress, receiver, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `;
        const values = [event.id, event.txHash, decodedValue.amounts[0], decodedValue.amounts[1], decodedValue.path[0], decodedValue.path[1], decodedValue.to, new Date()];
        const res = await client.query(insertQuery, values);
        await client.query('COMMIT');
        console.log('Data inserted:', res.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error inserting data', err);
    } finally {
        client.release();
    }
};

const addLiquidityTransaction = async (event, decodedValue) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const insertQuery = `
          INSERT INTO add_liquidities (eventId, txHash, amountA, amountB, liquidity, pair, receiver, tokenA, tokenB, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `;
        const values = [event.id, event.txHash, decodedValue.amount_a, decodedValue.amount_b, decodedValue.liquidity, decodedValue.pair, decodedValue.to, decodedValue.token_a, decodedValue.token_b, new Date()];
        const res = await client.query(insertQuery, values);
        await client.query('COMMIT');
        console.log('Data inserted:', res.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error inserting data', err);
    } finally {
        client.release();
    }
};

const removeLiquidityTransaction = async (event, decodedValue) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        const insertQuery = `
          INSERT INTO remove_liquidities (eventId, txHash, amountA, amountB, liquidity, pair, receiver, tokenA, tokenB, timestamp)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `;
        const values = [event.id, event.txHash, decodedValue.amount_a, decodedValue.amount_b, decodedValue.liquidity, decodedValue.pair, decodedValue.to, decodedValue.token_a, decodedValue.token_b, new Date()];
        const res = await client.query(insertQuery, values);
        await client.query('COMMIT');
        console.log('Data inserted:', res.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error inserting data', err);
    } finally {
        client.release();
    }
};

module.exports = {
    swapTransaction,
    addLiquidityTransaction,
    removeLiquidityTransaction,
    getLastCrawledLedger,
    updateLastCrawledLedger
};

