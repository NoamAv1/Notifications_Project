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
    color: 'primary'
  }
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <Button onClick={handleClick} className={classes.button} variant="outlined" color="primary">
          Click here to create a new user
        </Button>
        <Notification open={open} setOpen={setOpen} handleClick={handleClick} />
      </header>
    </div>
  );
}

export default App;
