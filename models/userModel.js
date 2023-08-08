import mongoose from "mongoose"

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true,"please add a first name"]
    },
    lastname: {
      type: String,
      required: [true,"please add a Last name"]
    },
    username: {
      type: String,
      required: [true,"Please add a username"],
      unique: true
    },
    email: {
      type: String,
      required: [true,"Please add an email address"],
      unique: true
    },
    password: {
      type: String,
      required: [true,"Please add a password"],
    },
    profileImage: {
      public_id: {
        type: String
      },
      url: {
        type: String
      }
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model("User",userSchema)

export default User
