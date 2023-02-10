const express = require('express');

const app = express();
app.use(express.urlencoded());

app.get('/', (req, res) => {
    console.log(req.body);
    res.send({ message: 'Hello World', ...req.body });
});
app.get('/user/:id', (req, res) => {
    console.log(req.params);
    res.send({ message: 'Hello World', ...req.params });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});