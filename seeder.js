const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Report = require('./models/Report');
const Recognize = require('./models/Recognize');
const Recommend = require('./models/Recommend');
const Repair = require('./models/Repair');
const React = require('./models/React');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
// const bootcamps = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
// );

// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
// );

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
// );

// Import into DB
// const importData = async () => {
//   try {
//     await Bootcamp.create(bootcamps);
//     await Course.create(courses);
//     await User.create(users);
//     console.log('Data Imported...'.green.inverse);
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

// Delete data
const deleteData = async () => {
  try {
    await Report.deleteMany();
    await Recognize.deleteMany();
    await Recommend.deleteMany();
    await React.deleteMany();
    await Repair.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
