const express = require('express');
const router = express.Router();
const events = require('../services/events')

/* GET events listing. */
router.get('/:eventId?', function(req, res, next) {
  let options = {
    eventId: req.params.eventId
  }

  events.getEvent(options, async (err, data) => {
    if (err) {
      return res.send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

router.post('/', function (req, res, next) {
  console.log('From post of event => ', req.body);
  let options = {
    start: req.body.start,
    rendering: req.body.rendering,
    backgroundColor: req.body.backgroundColor,
    title: req.body.title
};

  events.addEvent(options, async (err, data) => {
    if (err) {
      return res.send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

module.exports = router;
