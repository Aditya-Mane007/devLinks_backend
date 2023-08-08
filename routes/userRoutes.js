import express from "express"
import { getLink,AddLink,GetUser,Login,Register,updateLink,deleteLink,imageUpload } from "../controllers/userController.js"
import protect from "../middlewares/authMiddleware.js"
const router = express.Router()


// Authentication And Authorization Routes
// Login
router.post("/login",Login)

// Register
router.post("/register",Register)

router.post("/imageUplaod",protect,imageUpload)

// Get User Details
router.get("/getUser/:username",GetUser)

//  Links Routes 
// Get User Link
router.get("/username",() => { })

// Get Links
router.get("/getlink",protect,getLink)

// Add Link  
router.post("/addlink",protect,AddLink)

// Update Link
router.put("/updatelink/:id",protect,updateLink)

// Delete Link
router.delete("/deletelink/:id",protect,deleteLink)

export default router