const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyparser = require('body-parser');
const exphandle = require('express-handlebars');

const app = express();
const port = process.env.PORT || 5000;

app.engine('handlebars', exphandle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended :false
}));

app.use(express.static(`${__dirname}/public`));
app.get('/', (req,res) => {
    res.render('index',{
        stripePublishableKey : keys.stripePublishableKey
    });
});
app.get('/success', (req,res) => {
    res.render('success');
});
app.post('/charge', (req,res) =>{
    const amount  = 2500;
   stripe.customers.create({
       email :req.body.stripeEmail,
       source : req.body.stripeToken

   })
       .then(customer => stripe.charges.create({
           amount,
           description : "Product Name",
           currency : "usd",
           customer : customer.id
       }))
       .then(charge => res.render("success"));
});
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

