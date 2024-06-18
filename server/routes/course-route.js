const router = require('express').Router();
const Course = require('../models').course;
const courseValidation = require('../validation').courseValidation;

router.use((req, res, next) => {
    console.log("A request is coming into course route");
    next();
});

//get all courses in the database
router.get('/', async (req, res) => {
    // populate  in the mongo is query object(thenable object), and use exec() to change the object to promise object
    try{let courseFound =await Course.find({}).populate('instructor',['username','email','password']).exec();
        return res.send(courseFound);
    }catch(err){
        return res.status(500).send(err);
    }
    });

//get a course by id
router.get('/:id', async (req, res) => {
    let {courseId} = req.params;
    try{let courseFound = await Course.findOne(courseId).populate('instructor',['email']).exec();
        return res.send(courseFound);
    }catch(err){
        return res.status(500).send(err);
    }
});

//create a new course
router.post('/', async (req, res) => {
    //validate the data before creating a course
    let { error } = courseValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //create a new course
    let{title, description, price} = req.body;
    if (req.user.isStudent) {
        return res.status(400)
        .send("Only instructor can create a course");
    }
    try{let newCourse = new Course({
        title, 
        description, 
        price, 
        instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send({
        message: "Course is created",
        savedCourse,
    });
    }catch(err){
    return res.status(500).send("can not create a course");
    }
});


//update a course
router.patch('/:id', async (req, res) => {
  //validate the data before updating a course
    let {error}= courseValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);}
    let {courseId} = req.params;
  // make sure the course exists
  try{
    let courseFound = await Course.findOne(courseId);
    if (!courseFound) {
        return res.status(400).send("Course not found, can not update the course");
    }
    // make sure the user is the instructor of the course
    if (courseFound.instructor.equals(req.user._id)) {
        let updateCourse = await Course.findOneAndUpdate(courseId, req.body, {
            new: true, 
            runValidators: true,
        });
        return res.send({
            message: "Course is updated successfully",
            updateCourse,
        });
    }else{
        return res.status(403).send("Only instructor can update the course");
    }
    }catch(err){
        return res.status(500).send(err);
}
});

//delete a course
router.delete('/:id', async (req, res) => {
    let {courseId} = req.params;
    // make sure the course exists
    try{
      let courseFound = await Course.findOne(courseId);
      if (!courseFound) {
          return res.status(400).send("Course not found, can not delete the course");
      }
      // make sure the user is the instructor of the course
      if (courseFound.instructor.equals(req.user._id)) {
          let deleteCourse = await Course.findOneAndDelete(courseId);
          return res.send({
              message: "Course is deleted successfully",
          });
      }else{
          return res.status(403).send("Only instructor can delete the course");
      }
      }catch(err){
          return res.status(500).send(err);
  }


        });


module.exports = router;