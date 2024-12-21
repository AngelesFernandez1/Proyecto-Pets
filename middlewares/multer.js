const multer = require('multer');

let uploadImage = (folder) => {
    const storage = multer.diskStorage({
        destination: `public/images/${folder}`,
        filename: function(req, file, cb){
            let finalName = `${Date.now()}-${file.originalname}`
            cb(null, finalName)   
        }
    })

    const upload = multer({storage:storage}).single("img");
    return upload;
}

module.exports = uploadImage;