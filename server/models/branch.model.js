import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'district'
    },
    // Other branch fields
    name: String,
    address: String,
    // Add more fields as needed
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", BranchSchema);

export default Branch;

  
  