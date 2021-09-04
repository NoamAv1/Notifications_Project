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
            created_on TIMESTAMP NOT NULL,
            clicked_on JSON
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

const insert_table_users = async () => {
    const query = `
        INSERT INTO users (
            email, firstName, lastName, age
        )
        VALUES ('johndoe@gmail.com', 'john', 'doe', 21)
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

const update_table_users = async () => {
    const query = `
        UPDATE users
        SET age = 22
        WHERE email = 'johndoe@gmail.com'
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