const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5c45fbd66c6c873b48feb2c8')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://nodeuser:nodeUser@cluster0-f5zqi.mongodb.net/shop?retryWrites=true')
  .then( result => {
    User.findOne().then(user => {
      if(!user){
        const user = new User({
          name:"DM",
          email:'imdm004@gmail.com',
          cart: {
            items:[]
          }
        });
        user.save(); 
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });