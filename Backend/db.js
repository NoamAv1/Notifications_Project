const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '123456',
    port: 5432
});

const create_db = async () => {
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS notifications;`);
    await client.query(`CREATE DATABASE notifications;`);
    await client.end();

    client.database = "notifications";
};

const create_table_users = async () => {
    await client.connect();
    const query = `
        CREATE TABLE [IF NOT EXISTS] users (
            user_id serial PRIMARY KEY,
            created_at TIMESTAMP NOT NULL,
            duration int NOT NULL,
            time_period int NOT NULL,
            blocked_notifications TEXT []
        );`;
    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Table users is successfully created');
    });
    await client.end();
};

const insert_table_users = async (id, date, duration, time_period, blocked_notifications) => {
    const query = `
        INSERT INTO users (
            user_id, created_at, duration, time_period, blocked_notifications
        )
        VALUES ('${id}'', '${date}', '${duration}', '${time_period}', '${blocked_notifications}}')
        `;
    
    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data insert successful');
    });
    await client.end();
}

const update_blocked_notifications = async (id, blocked_notifications) => {
    const query = `
        UPDATE users
        SET blocked_notifications = ${blocked_notifications}
        WHERE user_id = '${id}'
        `;

    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        if (err) {
            console.error(err);
            return;
        }
        console.log('Data update successful');
    });
    await client.end();
}

const get_blocked_notifications = async (id) => {
    let result = {}

    const query = `
    SELECT blocked_notifications 
    FROM users 
    WHERE id = ${id}
    `;

    client.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        for (let row of res.rows) {
            result = {
                ...result,
                row
            }
        }
    });

    return result;
}

module.exports = {
    create_db, create_table_users, insert_table_users, update_blocked_notifications, get_blocked_notifications
}