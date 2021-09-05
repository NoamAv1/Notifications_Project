import React, { useEffect, useState } from 'react';
import { 
  makeStyles,
  Typography,
  Snackbar,
  IconButton,
 } from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  notificationBlock: {
    display: 'flex',
  }
}));

export default function Notification({
  open,
  setOpen,
  user
}) {
  const classes = useStyles();

  const [notification, setNotification] = useState({
    id: '', 
    type: '', 
    text: ''
  });
  /**
   * A default function to post a query to the server,
   * For convient use with fetch post feature.
   * 
   * @param {string} url - the path we are looking for 
   * @param {*} data  - an object that have the data we want to send
   * @returns the reponse from the server
   */
 const postData = async (url, data) => {
    const response = await fetch(url, {
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    });

    return response; 
  };

  /**
   * Handling the click on the close notification.
   * Also blocking the notification to be seen again.
   * 
   * @param {event} e 
   */

  const handleClick = (e) => {
    setOpen(false);
    postData("/update_blocked_notifications", {user_id: user.user_id, notification_id: notification.notification_id});
  };

  /**
   * Creating a useEffect that will run everytime, creating a never ending loop with the interval.
   * It will show and get a new notification each time.
   */
  useEffect(() => {
    let interval;
    if(user){
      interval = setInterval(() => {
        postData("/get_notification", {user_id: user.user_id}).then(async response => {
          try {
          const new_notification = await response.json()
          setNotification(new_notification);
          setOpen(true);
        } catch(error) {
          console.error(error)
        }
        });
      }, user.time_period);
    }

    return () => clearInterval(interval);
  });


  /**
   * To create a chnageable Alert we need to dynamily create the Alert component and return the new component each time we render.
   * 
   * @returns the Alert component if we have a notification else empty string.
   */
  const renderAlert = () => { 
    if(notification.id === ''){
      return ""
    }
    return (
      (<Alert severity={notification.type} >
        <div className={classes.notificationBlock}>
          <Typography variant="body1">
            {notification.text}
          </Typography>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClick} style={{marginLeft: "15px"}}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </Alert>))
  };

  const handleClose = (e) => {
    setOpen(false);
  };
  
  return (
    <div className={classes.root}>
      {notification.id !== '' &&
      (<Snackbar 
        open={open} 
        autoHideDuration={user ? Number(user.duration) : 2000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          {renderAlert()}
      </Snackbar>)}
    </div>
  );
}