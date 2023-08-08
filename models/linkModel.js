import mongoose from "mongoose"

const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  platform: {
    type: String,
    required: [true,"please add a platform"]
  },
  url: {
    type: String,
    required: [true,"please add a link"]
  }
},{
  timestamps: true
})

const Link = mongoose.model("Link",linkSchema)

export default Link