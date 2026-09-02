const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");

async function createPostController(req, res) {
    try {
        console.log("Body:", req.body);
        console.log("File:", req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const client = new ImageKit({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        });

        // Multer buffer ko Base64 Data URI me convert karo
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const response = await client.files.upload({
            file: fileBase64,
            fileName: req.file.originalname,
        });

        console.log("ImageKit Response:", response);

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            image: response.url,
        });

    } catch (error) {
        console.error("ImageKit Upload Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    createPostController,
};