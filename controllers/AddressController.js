import AddressModel from "../models/addressmodel.js";
import UserModel from "../models/usermodel.js";



export const AddAdress = async (req, res) => {
    try {
        const { address_line, city, state, pincode, country, mobile, _id } = req.body;

        if (!address_line || !city || !state || !pincode || !country || !mobile) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                error: true,
            });
        }

        const savedAddress = await AddressModel.create({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
        });

        const user = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { address_details: savedAddress._id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: true,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address added successfully",
            data: savedAddress,
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to add address",
            error: true,
        });
    }
};


export const GetAddress = async (req, res) => {
    try {
         
        const { userId } = req.body;

        console.log("User ID:", userId);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
                error: true,
            });
        }

        const user = await UserModel.findById(userId).populate('address_details');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: true,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address retrieved successfully",
            data: user.address_details,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve address",
            error: true,
        });
    }
}



export const editAddress = async (req, res) => {
    try {
        const {
            _id,
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
        } = req.body;

        // Check if all required fields are present
        if (
            !_id || 
            !address_line || 
            !city || 
            !state || 
            !pincode || 
            !country || 
            !mobile
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                error: true,
            });
        }

        // Update the address in the database
        const updatedAddress = await AddressModel.findByIdAndUpdate(
            _id,
            {
                address_line,
                city,
                state,
                pincode,
                country,
                mobile,
            },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
                error: true,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: updatedAddress,
        });

    } catch (error) {
        console.error("Edit Address Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update address",
            error: true,
        });
    }
};
