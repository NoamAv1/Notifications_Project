import React, { useState } from 'react';
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
    background: 'linear-gradient(to right, #ff4b1f 0%, #1fddff  51%, #ff4b1f  100%)',
    backgroundSize:' 200% auto',
    border: '10px',
    borderRadius: 3,
    boxShadow: '0 0 20px #eee',
    color: 'white',
    height: 48,
    padding: '0 30px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    transition: '0.5s',
    "&:hover": {
      backgroundPosition: "right center",
      color: '#fff',
      textDecoration: 'none'
    }
  }
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useState(null);

  /**
   * Handling the click on the button.
   * Generating a user and disabling the button.
   */
  const handleClick = () => {
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
        <Notification open={open} setOpen={setOpen} user={user} />
      </header>
    </div>
  );
}

export default App;
