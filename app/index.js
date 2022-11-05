// Requiring module
const express = require("express");
const app = express();
const path = require("path")
const process = require("process")

// Set public as static directory
app.use(express.static('public'));

app.set('views', path.join(__dirname, '/views'))

// Use ejs as template engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Render main template
app.get('/', (req, res) => {
    res.render('main')
})

// Server setup
app.listen(3000, () => {
    console.log("The server started running on port 3000")
});

process.on('SIGINT', () => {
    console.info("Interrupted")
    process.exit(0)
})