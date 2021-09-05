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


  const handleClick = (e) => {
    setOpen(false);
    postData("/update_blocked_notifications", {notification_id: notification.id});
  };

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