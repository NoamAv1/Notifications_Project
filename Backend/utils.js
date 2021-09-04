const moment= require('moment');
const { v4: uuidv4 } = require('uuid');
const db = require("./db");

/**
 * Geneterating a random int between the min and max values.
 * Including both min and max values.
 * 
 * @param {int} min - the minimun value
 * @param {int} max - the maximun value
 * @returns {int} a random value between min to max including.
 */
const get_rnd_integer = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
};

/**
 * Generation a user and adding one to the db.
 * Returning the values it created.
 * 
 * @returns {obj} user - with id, durtaion and time_period values.
 */
const generate_user = () => {
    const user_id = uuidv4();
    const created_at = moment().format('YYYY-MM-DD');
    const duration = utils.get_rnd_integer(1000, 4000);
    const time_period = utils.get_rnd_integer(1000, 4000);

    try{
        db.insert_table_users(user_id, created_at, duration, time_period, {});

        return {id: user_id, duration: duration, time_period: time_period}
    }
    catch(err) {
        console.erro(err);
        throw new Error("Error on insert into table", err)
    }
};

/**
 * Constant of the notifications
 */
const notifications_arr = [
    {
        id: 'error',
        type: 'error',
        text: 'Last items with limited time offer'
    },
    {
        id: 'warning',
        type: 'warning',
        text: 'Limited edition books for next auction'
    },
    {
        id: 'info1',
        type: 'info',
        text: 'Big sale next week'
    },
    {
        id: 'info2',
        type: 'info',
        text: 'New auction next month'
    },
    {
        id: 'success',
        type: 'success',
        text: 'New books with limited edition coming next week'
    }
];

/**
 * Genertating a random notification that isn't on the blocked_notifications param.
 * 
 * @param {array<string>} blocked_notifications 
 * @returns {obj} notification - with the details of the notification.
 */
const generate_notification = (blocked_notifications) => {
    let rand = get_rnd_integer(0, notifications_arr.length - 1);
    let notification = notifications_arr[rand];

    while(blocked_notifications.includes(notification.id)){
        rand = get_rnd_integer(0, notifications_arr.length - 1);
        notification = notifications_arr[rand];
    }

    return notification;
}

module.exports = {
    generate_notification, generate_user
}