const { Client } = require('pg');

let client_details = {
    user: 'postgres',
    host: 'localhost',
    password: '123456',
    port: 5432
}
let client = new Client(client_details);

/**
 * Creating the db using node-postgres
 */
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

/**
 * Creating the user table
 */
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

/**
 * Creating a user.
 * 
 * @param {uuid} id - the user id
 * @param {*} duration - each user has is own unqiue duration of the notification
 * @param {*} time_period - each user has is own unqiue time period for the notification to show
 */
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
/**
 * Updating the blocked notification column in DB.
 * 
 * @param {uuid} user_id 
 * @param {array<string>} blocked_notifications 
 */
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

/**
 * fetching the user blocked_notifications column
 * 
 * @param {uuid} user_id 
 * @returns an array with the data of the blocked_notifications of the user
 */
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