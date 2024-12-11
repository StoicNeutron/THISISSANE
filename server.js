var express = require('express');
var app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts'); // I added this

//connect to database for storage
mongoose.connect('mongodb://127.0.0.1:27017/test');
const db = mongoose.connection;
db.once('open', () => {
  console.log('connected to mongo');
});

// const mascotSchema = new mongoose.Schema({
//   name: String,
//   organization: String,
//   birth_year: Number,
// });

// configure session middleware to pass data between screens
const MongoStore = require('connect-mongo');
app.use(session({
  secret: 'MySecretCode',
  saveUninitialized: true,
  resave: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/test',
    autoRemove: 'interval',
    autoRemoveInterval: 10 // In minutes. Default
  })
}));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(expressLayouts); // I added this
app.use(express.static('public')); // I added this
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use res.render to load up an ejs view file

/*
// index page
app.get('/', function(req, res) {
  var tagline = "No programming concept is complete without a cute animal mascot.";

  //database work must be async so wrapped it in a function
  async function getData() {

    //save mascots to database in this version for long term persistence. If data entry screen, replace this section with one record and use fields
    const Mascot = await mongoose.model('Mascot', mascotSchema);
      const mascot = new Mascot ({ name: 'Sammy', organization: 'DigitalOcean', birth_year: 2012}); 
      await mascot.save();
      const mascot2 = new Mascot ({name: 'Tux', organization: 'Linux', birth_year: 1996}); 
      await mascot2.save();
      const mascot3 = new Mascot ({name: 'Moby Dock', organization: 'Docker', birth_year: 2013}); 
    await mascot3.save();

  let mascots = await Mascot.find({}).exec();

  //store in session 
    req.session.mascots = mascots;

    res.render('pages/index', {
        mascots: mascots,
        tagline: tagline
    });
  }

getData()
});

// about page
app.get('/about', function(req, res) {
  const mascots2 = req.session.mascots;
  res.render('pages/about-4', 
  {mascots2: mascots2});
});
*/
// Commented all the above codes
// Added codes here

const studentSchema = new mongoose.Schema({
  name: String,
  g_number: String,
  email: String,
});
const Student = mongoose.model('Student', studentSchema);

// handle / route and redirect to /student
app.get('/', (req, res) => {
  res.redirect('/student');
});

// student screen: GET
app.get('/student', (req, res) => {
  res.render("student.ejs", {footerData: "@Copyright 2023 GMU"});
});

// Student screen: submit POST
app.post('/student/submit', async (req, res) => {
  req.session.formData = req.body; // Save to session
  console.log('Session Data:', req.session.formData);

  // Save to database
  try {
    const student = new Student({
      name: req.body.name,
      g_number: req.body.g_number,
      email: req.body.email,
    });
    await student.save();
    console.log('Student saved to database:', student);
  } catch (err) {
    console.error('Error saving student to database:', err);
    return res.status(500).send('Error saving student data.');
  }

  res.redirect('/contact'); // Redirect to the contact page
});


// contact screen: GET
app.get('/contact', (req, res) => {
  const data = req.session.formData ||
  {
    name: "Error! Require from Student Page!",
    g_number: "Error! Require from Student Page!",
    email: "Error! Require from Student Page!"
  };
  res.render('contact', { data, footerData: "@Copyright 2023 GMU" });
});

app.listen(8080);
console.log('Server is listening on port 8080');