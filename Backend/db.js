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
        user_id uuid PRIMARY KEY,
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

const create_user = async (id, duration, time_period) => {
    const query = `
        INSERT INTO users (
            user_id, duration, time_period
        )
        VALUES ('${id}', '${duration}', '${time_period}')
        ;`;

    try {
        await client.query(query);
        console.log('User created successful');
    } catch (err) {
        console.error(err);
    }
};

const update_blocked_notifications = async (user_id, blocked_notifications) => {
    const query = `
        UPDATE users
        SET blocked_notifications = '${blocked_notifications}'
        WHERE user_id = '${user_id}'
        ;`;

    try {
        await client.query(query);
        console.log('Data update successful');
    } catch (err) {
        console.error(err);
    }
};

const get_blocked_notifications = async (user_id) => {
    const query = `
    SELECT blocked_notifications 
    FROM users 
    WHERE user_id = '${user_id}'
    ;`;

    const res = await client.query(query);
    if(res && res.rows && res.rows[0].blocked_notifications){
        return res.rows[0].blocked_notifications;
    }

    return [];
};

module.exports = {
    create_db, create_table_users, create_user, update_blocked_notifications, get_blocked_notifications
};