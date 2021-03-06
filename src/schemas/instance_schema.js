import { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Schema for dates containing text info for that date
const InstanceSchema = new Schema(
  {
  // Instance info
    key: { type: String, unique: true },
    password: { type: String },
    status: String,
    log: [String],
    dbName: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

InstanceSchema.pre('save', function beforeyYourModelSave(next) {
  const instance = this;

  if (!instance.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(instance.password, salt);

  instance.password = hash;
  return next();
});

InstanceSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  const instance = this;
  bcrypt.compare(candidatePassword, instance.password, (err, isMatch) => {
    if (err) {
      console.log(err);
      return callback(err);
    }
    return callback(null, isMatch);
  });
};

export default InstanceSchema;
