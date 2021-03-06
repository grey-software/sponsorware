const express = require('express');
const mongoose = require('mongoose');
var request = require('request');
const bodyParser = require('body-parser');
const app = express();
const User = require('./user');

//Later change this so that you don't hard code the user
mongoose
  .connect(
    'mongodb+srv://sponsordatacluster.pmien.mongodb.net/retryWrites=true&w=majority/SponsorDataCluster',
    {
      dbName: 'SponsorDataCluster',
      user: 'OsamaSaleh289',
      pass: 'punkKUVoJWPmNVVU',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('MongoDB Connected');
  });

const port = 8080;
var sponsorships = require('./sponsorships-August-2020.json');

app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.post('/sponsorsWebhook', async (req, res) => {
  var payload = '';
  await req.on('readable', () => {
    payload = req.read();
    payload = JSON.parse(payload);

    //Unpacking payload
    if (payload != null) {
      const user = {
        login: payload['sponsorship']['sponsor']['login'],
        tier_name: payload['sponsorship']['tier']['name'],
        creation_date: payload['sponsorship']['created_at'],
        privacy: payload['sponsorship']['privacy_level'],
      };

      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        login: payload['sponsorship']['sponsor']['login'],
        tier_name: payload['sponsorship']['tier']['name'],
        creation_date: payload['sponsorship']['created_at'],
        privacy: payload['sponsorship']['privacy_level'],
      });

      const sponsor = sponsorships.find(
        (item) => item['sponsor_handle'] === user.login,
      );
      //Action cases
      switch (payload['action']) {
        //User doesn't exist in our database
        case 'created': {
          sponsorships.push(user);
          newUser
            .save()
            .then((result) => {
              console.log(result);
              //res.send("Sponsor added to database");
            })
            .catch((err) => {
              console.log(err);
              //res.status(400).send("Unable to save user");
            });
          break;
        }

        //Update user privacy
        case 'edited': {
          if (sponsor['is_public'] == 'true') {
            sponsor['is_public'] = 'false';
          } else {
            sponsor['is_public'] = 'true';
          }

          break;
        }

        //Update User Sponsorship amount
        case 'tier_changed': {
          sponsor['tier_name'] = user.tier_name;
          break;
        }

        case 'cancelled': {
          //Remove Sponsor
          const index = sponsorships.indexOf(sponsor);
          sponsorships = sponsorships.slice(index + 1);
          break;
        }

        default:
          {
            console.log('Invalid Action Case');
          }
          break;
      }
      /*var jsonContent = JSON.stringify(sponsorships);
      fs.writeFile(
        'sponsorships-August-2020.json',
        jsonContent,
        'utf8',
        function (err) {
          if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
          }
        },
      );*/
    }
  });
  req.on('end', () => {
    res.send('200 OK');
  });

  var options = {};

  async function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.status(200).json({Result: '200'});
    }
  }
  request(options, callback);
});

//For testing on Postman
app.listen(port, () => console.log(`Listening on port ${port}!`));
