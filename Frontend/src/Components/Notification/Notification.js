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
  // const [alert, setAlert] = useState(null);

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

  useEffect(() => {
    let interval;
    console.log('user', user);

    if(user){
      interval = setInterval(() => {
        console.log('posing:', user.user_id);
        postData("/get_notification", {user_id: user.user_id}).then(async response => {
          console.log(response, 'response');
          try {
          const new_notification = await response.json()
          console.log(new_notification , 'new_notification from server to front');
          setNotification(new_notification);
        } catch(error) {
          console.error(error)
        }
        });
      }, user.time_period);
    }

    return () => clearInterval(interval);
  });

  // useEffect(() => {
  //   console.log('in useeffect setAlert');
  //     setAlert(
  //       (<Alert severity={notification.type} >
  //         <div className={classes.notificationBlock}>
  //           <Typography variant="body1">
  //             {notification.text}
  //           </Typography>
  //           <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} style={{marginLeft: "15px"}}>
  //             <CloseIcon fontSize="small" />
  //           </IconButton>
  //         </div>
  //       </Alert>)
  //     )
  //     setOpen(true);
  // },[notification])
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    postData("/update_blocked_notifications", {notification_id: notification.id});
  };

  return (
    <div className={classes.root}>
      {notification.id !== '' &&
      (<Snackbar 
        open={open} 
        autoHideDuration={user.durtaion} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
         <Alert severity={notification.type} key={notification.id} >
           <div className={classes.notificationBlock}>
             <Typography variant="body1">
               {notification.text}
             </Typography>
             <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} style={{marginLeft: "15px"}}>
               <CloseIcon fontSize="small" />
             </IconButton>
            </div>
         </Alert>
      </Snackbar>)}
    </div>
  );
}