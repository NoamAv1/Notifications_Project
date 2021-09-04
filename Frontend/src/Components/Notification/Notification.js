import React, { useState } from 'react';
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
  setOpen
}) {
  const classes = useStyles();
  const [randomAlert, setRandomAlert] = useState(0);

  /**
   * closing the notification.
   * Added a setTimeout to prevent the alert to switch in the middle on closing animation.
   * 
   * @param event - the event type getting from the button (Not used)
   * @param reason - the reason of the event, getting from the matrial ui API
   */
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setTimeout(function () {
      setRandomAlert(getRndInteger(0, alertArray.length - 1))
    }, 500);
  };

  /**
   * Geneterating a random int between the min and max values.
   * Including both min and max values.
   * 
   * PARTS MOVEWILL MOVE TO BACKEND 
   * 
   * @param {int} min - the minimun value
   * @param {int} max - the maximun value
   * @returns {int} a random value between min to max including.
   */
  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  };
  
  
  /**
   * An arry that including all the alerts components.
   * 
   * PARTS MOVEWILL MOVE TO BACKEND 
   */
  const alertArray = [
    (<Alert severity="error" >
      <div className={classes.notificationBlock}>
        <Typography variant="body1">
          Last items with limited time offer 
        </Typography>
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} style={{marginLeft: "15px"}}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Alert>),
    (<Alert severity="warning">
      <div className={classes.notificationBlock}>
        <Typography variant="body1">
          Limited edition books for next auction
        </Typography>
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} style={{marginLeft: "15px"}}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Alert>),
    (<Alert severity="info">
      <div className={classes.notificationBlock}>
        <Typography variant="body1">
          Big sale next week
        </Typography>
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} style={{marginLeft: "15px"}}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Alert>),
    (<Alert severity="info">
      <div className={classes.notificationBlock}>
        <Typography variant="body1">
          New auction next month
        </Typography>
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} style={{marginLeft: "15px"}}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Alert>),
    (<Alert severity="success">
      <div className={classes.notificationBlock}>
        <Typography variant="body1">
          New books with limited edition coming next week
        </Typography>
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} style={{marginLeft: "15px"}}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </Alert>),
  ];

  /**
   * Genertaing a random value between 1 to 4 secs for the auto hide of the notification.
   */
  const autohideDuration = getRndInteger(1000, 4000);

  return (
    <div className={classes.root}>
      <Snackbar 
        open={open} 
        autoHideDuration={autohideDuration} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        {alertArray[randomAlert]}
      </Snackbar>
    </div>
  );
}