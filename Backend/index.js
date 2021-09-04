const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.json({ message: "Hello from Express!" });
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});