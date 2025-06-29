// import uploadImage from "../../client/src/utils/uploadImage.js";
import uploadimageCloudnary from "../utils/uploadimage.js";

// const uploadImageController = async(req,res)=>{

//     try {
//         const file = req.file;
 
//         const uploadimg = await uploadimageCloudnary(file);

//         console.log("hjhjhjhjhjhjh", uploadimg)

//         res.json({
//             message: "Image uploaded successfully",
//             data: uploadimg,
//             error:false,
//             success:true
//         })

//     } catch (error) {
//     res.status(500).json({
//         message: error.message || error,
//         error: true,
//         success:false
//     })
//     }
// }

const uploadImageController = async (req, res) => {
    try {
      console.log("Incoming file:", req.file); // Add this
  
      const file = req.file;
  
      if (!file) {
        throw new Error("No file provided in the request.");
      }
  
      const uploadimg = await uploadimageCloudnary(file);
  
      console.log("Upload result:", uploadimg);
  
      res.json({
        message: "Image uploaded successfully",
        data: uploadimg,
        error: false,
        success: true,
      });
    } catch (error) {
      console.error("Upload error:", error); // Add this
      res.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };
  

export default uploadImageController;