import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import Link from "../models/linkModel.js"
import uploadImage from "../utils/ImageUpload.js"
import { v2 as cloudinary } from "cloudinary"
import { v4 as uuidv4 } from 'uuid'


const Register = asyncHandler(async (req,res) => {
  const { firstname,lastname,username,email,password,} = req.body

  if (!firstname || !lastname || !username || !email || !password) {
    res.status(400)
    throw new Error("Please add all the fields")
  }

  const userExists = await User.findOne({ email })
  const usernameExists = await User.findOne({ username })

  if (userExists) {
    res.status(400)
    throw new Error("User Already Exists")
  }

  if (usernameExists) {
    res.status(400)
    throw new Error("Username Already Exists")
  }

  const salt = await bcrypt.genSalt(10)
  const hashpassword = await bcrypt.hash(password,salt)

  const user = await User.create({
    firstname,
    lastname,
    username,
    email,
    password: hashpassword
  })



  if (user) {
    res.status(201)
    res.json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: "Register Successfully"
    })
  } else {
    res.status(400)
    throw new Error("Something went wrong")
  }
})

const Login = asyncHandler(async (req,res) => {
  const { email,password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error("Please add all the fields")
  }

  const user = await User.findOne({ email })

  console.log(user._id)
  if (user && await (bcrypt.compare(password,user.password))) {
    res.status(201).json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: "Login Successfully.."
    })
  } else {
    res.status(400)
    throw new Error("Something went wrong")
  }

})
const GetUser = asyncHandler(async (req,res) => {

  const user = await User.find({ username: req.params.username })

  const links = await Link.find({ user: user[0]._id })

  if (user) {
    res.status(200).json({
      firstname: user[0].firstname,
      lastname: user[0].lastname,
      username: user[0].username,
      email: user[0].email,
      links,
      message: "Get User"
    })
  }
})

const imageUpload = asyncHandler(async (req,res) => {

  const { image } = req.body

  // console.log(req.body)

  const user = await User.findById(req.user.id)

  const image_id = uuidv4().split('-')[0]

  const imageId = uuidv4().split('-')[0]

  const imageUrl = await uploadImage(image,imageId)

  // if (result) {
  //   user.profileImage = {
  //     public_id: result.public_id,
  //     url: result.secure_url
  //   }

  //   user.save()
  //   res.status(200).json({
  //     message: "Image Uploaded"
  //   })
  // } else {
  //   res.status(400).json({
  //     message: "Something went wrong"
  //   })
  // }

})


const getLink = asyncHandler(async (req,res) => {
  const links = await Link.find({ user: req.user.id })

  if (links) {
    res.status(200).json(
      links
    )
  }

})

const AddLink = asyncHandler(async (req,res) => {
  const { platform,url } = req.body

  if (!platform || !url) {
    throw new Error("Please add all the fields")
  }

  const link = await Link.create({
    user: req.user.id,
    platform,
    url
  })

  if (link) {
    res.status(200).json(
      link
    )
  }
  else {
    res.status(400).json({
      message: "Something went wrong"
    })
  }

})
const updateLink = asyncHandler(async (req,res) => {

  console.log(req.body)

  const link = await Link.findById(req.params.id)

  const linkChanges = {
    platform: req.body.platform || link.platform,
    url: req.body.url || link.url
  }

  if (!link) {
    res.status(400)
    throw new Error("Link not found")
  }
  if (link.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error("User not authorized")
  }

  const updatedLink = await Link.findByIdAndUpdate(req.params.id,{ $set: linkChanges },{ new: true })

  if (updatedLink) {
    res.status(200).json(
      updatedLink
    )
  }
  else {
    res.status(400).json({
      message: "Something went wrong"
    })
  }
})
const deleteLink = asyncHandler(async (req,res) => {

  if (!req.user.id) {
    res.status(400)
    throw new Error("User not found")
  }

  const link = await Link.findById(req.params.id)
  if (!link) {
    res.status(400)
    throw new Error("Link not found")
  }
  if (link.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error("User not authorized")
  }
  const deleted = await Link.deleteOne({ _id: link._id })

  if (deleted) {
    res.status(200).json(deleted)
  } else {
    res.status(400).json({
      message: "Something went wrong"
    })
  }
})
// const Login = asyncHandler(async (req,res) => { })
// const Login = asyncHandler(async (req,res) => { })

const generateToken = (id) => {
  return jwt.sign({ id },process.env.JWT_SECRET,{
    expiresIn: '30d'
  })
}

export {
  Register,
  Login,
  GetUser,
  imageUpload,
  getLink,
  AddLink,
  updateLink,
  deleteLink
}