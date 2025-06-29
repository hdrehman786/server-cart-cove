import UserModel from "../models/usermodel.js";
import mongoose from "mongoose";
import bcrypt, { truncates } from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../config/sendEmail.js";
import { forgotPasswordTemplate, verifyEmailTemplate } from "../utils/emailtemplate.js";
import genrateAccessToken from "../utils/genrateToken.js";
import genraterefReshToken from "../utils/genraterefreshToken.js";
import uploadimageCloudnary from "../utils/uploadimage.js";
import genrateOtp from "../utils/genrateotp.js";


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        error: true,
        success: false,
      });
    }
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({ name, email, password: hashedPassword });
    const verifyEmailUrl = `${process.env.CLIENT_URL}/user/verifyemail/${user._id}`;
    try {
      const result = await sendEmail({
        sendTo: email,
        subject: "Verify your email address - Rao's Group",
        html: verifyEmailTemplate(name, verifyEmailUrl),
      });

      if (!result) {
        console.log("Failed to send verification email.");
      }
    } catch (error) {
      console.log("Error sending verification email:", error);
    }

    // Send response with user data and token
    res.status(201).json({
      message: "User created successfully",
      error: false,
      success: true,
      data: user,
    })

  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const verifyEmail = async (req, res) => {
  try {

    const { code } = req.body;

    const user = await UserModel.updateOne({ _id: code }, {
      verify_email: true
    });

    if (!user) {
      res.status(404).json({
        message: "user not found",
        error: true,
        success: false
      })
    }

    res.status(200).json({
      message: "user verified successfully",
      error: false,
      success: true
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    })
  }
}
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        error: true,
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        error: true,
        success: false,
      });
    }

    const accesstoken = await genrateAccessToken(user._id);
    const refreshtoken = await genraterefReshToken(user._id);

    await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date().toISOString()
    });

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
    };

    res.cookie("accesstoken", accesstoken, cookieOption);
    res.cookie("refreshtoken", refreshtoken, cookieOption);

    res.status(200).json({
      message: "User logged in successfully",
      error: false,
      success: true,
      data: {
        accesstoken,
        refreshtoken,
        user
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { id } = req;

    // Clear the cookies
    res.clearCookie('accesstoken');
    res.clearCookie('refreshtoken');
    // Update the refresh token in the database to null
    await UserModel.findByIdAndUpdate({ _id: id }, {
      refresh_token: null
    });
    res.status(200).json({
      message: "User logged out successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.id;
    const image = req.file;

    const uploadImage = await uploadimageCloudnary(image);

    const user = await UserModel.findByIdAndUpdate(userId, { avatar: uploadImage.url })

    res.status(200).json({
      message: "Image uploaded successfully",
      error: false,
      success: true,
      data: {
        _id: userId,
        avatar: uploadImage.url,
      },
    })

    console.log("image", image);
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


export const updateUserDetails = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const userId = req.id;

    let passwordHash;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name }),
        ...(password && { password: passwordHash }),
        ...(email && { email }),
        ...(mobile && { mobile }),
      }
    );

    res.status(200).json({
      message: "User details updated successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


//  forgot password

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    // Generate reset password token
    const otp = genrateOtp();
    const expiryTime = Date.now() + 60 * 60 * 1000; // 30 minutes from now

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forget_password_otp: otp,
      forget_password_expire: expiryTime,
    })

    await sendEmail({
      sendTo: email,
      subject: "Reset Password - Rao's Group",
      html: forgotPasswordTemplate(otp, user.name),
    });

    if (!update) {
      return res.status(500).json({
        message: "Failed to update user",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "Password reset token sent to your email",
      error: false,
      success: true,
    })

  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// verifyOtp

export const verifyOtp = async (req, res) => {

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email or OTP is required",
        error: true,
        success: false,
      })
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      })
    }

    const currentTime = new Date();

    if (user.forget_password_expire < currentTime) {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      })
    }

    if (otp !== user.forget_password_otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      })
    };

    const update = await UserModel.updateOne({ email }, {
      forget_password_expire: "",
      forget_password_otp: ""
    })

    res.status(200).json({
      message: "OTP verified successfully",
      error: false,
      success: true,
      data: update
    })




  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}


// resetpassword 

export const resetPassword = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      })
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const resetPassword = await UserModel.updateOne({ email }, {
      password: hashedPassword
    })

    res.status(200).json({
      message: "Password reset successfully",
      error: false,
      success: true,
    })

  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}

// refresh token


export const refreshToken = async (req, res) => {
  try {
    // Fix: 'Cookies' should be lowercase 'cookies'
    const refreshToken = req.cookies?.refreshtoken;
    console.log("Refresh Token:", refreshToken);

    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized. No refresh token provided.",
        error: true,
        success: false,
      });
    }

    // Verify token
    const verifyToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    if (!verifyToken) {
      return res.status(401).json({
        message: "The token is invalid or has expired",
        error: true,
        success: false,
      });
    }

    const { id } = verifyToken;

    // Generate new access token
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set access token cookie
    res.cookie("accesstoken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: true,
      sameSite: "none",
    });

    // Optional: send success response
    return res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
      success: true,
    });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};


// get the user login details

export const getUserDetails = async (req, res) => {
  try {
    const id = req.id;
    console.log(id);
    const user = await UserModel.findById(id).select(' -password -refresh_token -accesstoken');
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      })
    }
    return res.status(200).json({
      message: "User details retrieved successfully",
      user,
      success: true,
    })

  } catch (error) {
    res.status(400).json({
      message: error.message || "Invalid request",
      error: true,
      success: false
    })
  }
}