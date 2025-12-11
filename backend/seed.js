require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Student = require('./models/Student');
const Batch = require('./models/Batch');
const User = require('./models/User');

async function seedDatabase() {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri === 'inmemory') {
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('Using in-memory MongoDB for seeding');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Student.deleteMany({});
    await Batch.deleteMany({});
    await User.deleteMany({});

    // Create default user
    const defaultUser = new User({
      email: 'admin@attendance.com',
      password: 'admin123',
      name: 'Administrator'
    });
    await defaultUser.save();
    console.log('Default user created: admin@attendance.com / admin123');

    // Create batches
    const batch1 = new Batch({ name: 'Batch A', year: 2024 });
    const batch2 = new Batch({ name: 'Batch B', year: 2024 });
    await batch1.save();
    await batch2.save();

    // Create students
    const students = [
      { name: 'John Doe', rollNumber: '001', batch: batch1._id },
      { name: 'Jane Smith', rollNumber: '002', batch: batch1._id },
      { name: 'Mike Johnson', rollNumber: '003', batch: batch2._id },
      { name: 'Sarah Wilson', rollNumber: '004', batch: batch2._id },
    ];

    await Student.insertMany(students);
    // Create attendance records for last 7 days for each student
    const Attendance = require('./models/Attendance');
    const statuses = ['present','late','undertime','absent'];
    const today = new Date();
    const attendanceDocs = [];
    const allStudents = await Student.find({});
    for (const s of allStudents) {
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        attendanceDocs.push({
          student: s._id,
          batch: s.batch,
          date: d,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          note: ''
        });
      }
    }
    if (attendanceDocs.length) await Attendance.insertMany(attendanceDocs);
    console.log('Sample data seeded successfully');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();