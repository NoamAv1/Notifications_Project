const { Client } = require('pg');

let client_details = {
    user: 'postgres',
    host: 'localhost',
    password: '123456',
    port: 5432
}
let client = new Client(client_details);

const create_db = async () => {
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS notifications;`);
    await client.query(`CREATE DATABASE notifications;`);
    await client.end();

    client_details.database = 'notifications';
    client = new Client(client_details);
    client.connect();
    
    console.log('DB successfully created');
};

const create_table_users = async () => {
    const query = `
    CREATE TABLE users (
        user_id serial PRIMARY KEY,
        created_at TIMESTAMP,
        duration int,
        time_period int,
        blocked_notifications TEXT []
    );`
    try {
        await client.query(query);
        console.log('Table users is successfully created');
    } catch (err) {
        console.error(err);
    }
};

const insert_table_users = async (id, date, duration, time_period, blocked_notifications) => {
    const query = `
        INSERT INTO users (
            user_id, created_at, duration, time_period, blocked_notifications
        )
        VALUES ('${id}'', '${date}', '${duration}', '${time_period}', '${blocked_notifications}}')
        `;

    try {
        await client.query(query);
        console.log('Data insert successful');
    } catch (err) {
        console.error(err);
    }
};

const update_blocked_notifications = async (id, blocked_notifications) => {
    const query = `
        UPDATE users
        SET blocked_notifications = ${blocked_notifications}
        WHERE user_id = '${id}'
        `;

    try {
        await client.query(query);
        console.log('Data update successful');
    } catch (err) {
        console.error(err);
    }
};

const get_blocked_notifications = async (id) => {
    let result = {}

    const query = `
    SELECT blocked_notifications 
    FROM users 
    WHERE id = ${id}
    `;

    client.query(query)
    .then(res => {
        for (let row of res.rows) {
            result = {
                ...result,
                row
            }
        }
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        console.log('Table is successfully created');
        return result;
    });
};

module.exports = {
    create_db, create_table_users, insert_table_users, update_blocked_notifications, get_blocked_notifications
};