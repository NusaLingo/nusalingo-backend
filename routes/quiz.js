const express = require('express');
const router = express.Router();

// import database
const connection = require('../config/database');
const { body, validationResult } = require('express-validator');

/**
 * INDEX QUIZ
 */

router.get('/', (req, res) => {
  connection.query('SELECT * FROM question ORDER BY id ASC', (err, rows) => {
    if(err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });

    } else {
      return res.status(200).json({
        status: true,
        message: 'List Data Quiz',
        data: rows
      });
    }
  });
});

/**
 * STORE QUIZ
 */

router.post('/store', [

  //validation
  body('title').notEmpty(),
  body('option1').notEmpty(),
  body('option2').notEmpty(),
  body('option3').notEmpty(),
  body('option4').notEmpty(),
  body('correctAnswer').notEmpty()
    
], (req, res) => {
    
    const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
    
        //define formData
        let formData = {
          title: req.body.title,
          option1: req.body.option1,
          option2: req.body.option2,
          option3: req.body.option3,
          option4: req.body.option4,
          correctAnswer: req.body.correctAnswer
        }
    
        // insert query
    connection.query('INSERT INTO question SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
              status: false,
              message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
              status: true,
              message: 'Insert Data Successfully',
              data: rows[0]
            })
        }
    });
});

/**
 * SHOW QUIZ
 */

router.get('/:id', function (req, res) {
  let id = req.params.id;

  connection.query(`SELECT * FROM question WHERE id = ${id}`, function (err, rows) {
    if(err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    }

    if (rows.length <= 0) {
      return res.status(404).json({
        status: false,
        message: 'Data Quiz Not Found!',
      });

    } else {
      return res.status(200).json({
        status: true,
        message: 'Detail Data Quiz',
        data: rows[0]
      });
    };
  });
});

/**
 * UPDATE QUIZ
 */

router.patch('/update/:id', [

  //validation
  body('title').notEmpty(),
  body('option1').notEmpty(),
  body('option2').notEmpty(),
  body('option3').notEmpty(),
  body('option4').notEmpty(),
  body('correctAnswer').notEmpty()

], (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(422).json({
          errors: errors.array()
      });
  }

  //id quiz
  let id = req.params.id;

  //data quiz
  let formData = {
    title: req.body.title,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
    correctAnswer: req.body.correctAnswer
  }

  // update query
  connection.query(`UPDATE question SET ? WHERE id = ${id}`, formData, function (err, rows) {
      //if(err) throw err
      if (err) {
          return res.status(500).json({
              status: false,
              message: 'Internal Server Error',
          })
      } else {
          return res.status(200).json({
              status: true,
              message: 'Update Data Successfully!'
          })
      }
  })

});

/**
 * DELETE QUIZ
 */
router.delete('/delete/(:id)', function(req, res) {

  let id = req.params.id;

  connection.query(`DELETE FROM question WHERE id = ${id}`, function(err, rows) {
      //if(err) throw err
      if (err) {
          return res.status(500).json({
              status: false,
              message: 'Internal Server Error',
          })
      } else {
          return res.status(200).json({
              status: true,
              message: 'Delete Data Successfully!',
          })
      }
  })
});


module.exports = router;