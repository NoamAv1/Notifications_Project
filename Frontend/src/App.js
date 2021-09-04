import React, { useState, useEffect } from 'react';
import Notification from './Components/Notification/Notification';

import { 
  makeStyles,
  Button,
 } from '@material-ui/core';

 const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center'
  },
  header: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white'
  },
  button: {
    color: 'primary'
  }
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useState(null);

  const handleClick = () => {
    setOpen(true);
    setDisabled(true);

    fetch("/generate_user").then(async response => {
      try {
       const new_user = await response.json()
       setUser(new_user);
     } catch(error) {
       console.error(error)
     }
    });
  };
  
  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <Button 
          onClick={handleClick} 
          className={classes.button} 
          variant="outlined" 
          color="primary"
          disabled={disabled}
        >
          {user ? "Hello, and welcome!" : "Generate a new user"}
        </Button>
        <Notification open={open} setOpen={setOpen} handleClick={handleClick} user={user} />
      </header>
    </div>
  );
}

export default App;
