import mongoose from "mongoose";
import User from "../models/User.js"
import Transaction from "../models/Transaction.js";




export const getAdmins = async(req,res)=>{

  try {
     const admins = await User.find({role:"admin"}).select("-password");
     res.status(200).json(admins);
  } catch (error) {
    res.status(404).json({message:error.message})
  }
}





export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Convert id explicitly to ObjectId
    const userId = new mongoose.Types.ObjectId(id);

    // Aggregation pipeline
    const userWithStats = await User.aggregate([
      { 
        $match: { _id: userId } // Explicit ObjectId conversion
      },
      {
        $lookup: {
          from: "affiliatestats", // MongoDB collection name
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: { path: "$affiliateStats", preserveNullAndEmptyArrays: true } } // Avoid errors if empty
    ]);

    if (!userWithStats || userWithStats.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const affiliateSales = userWithStats[0]?.affiliateStats?.affiliateSales || [];

    // Fetch all transactions in one query using $in for better performance
    const saleTransactions = await Transaction.find({
      _id: { $in: affiliateSales },
    });

    res.status(200).json({
      user: userWithStats[0],
      sales: saleTransactions,
    });

    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







