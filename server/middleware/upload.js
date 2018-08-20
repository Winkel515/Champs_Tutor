const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'public/util/img/profile')
    },
    filename: function (req, file, callback){
        callback(null, `${new Date().toLocaleDateString()} ${file.originalname}`);
    }
})
const fileFilter = (req, file, callback) => {
    console.log(req.params);
    if(file.mimetype === "image/jpeg"|| file.mimetype === "image/png"){
        callback(null, true);
    } else {
        callback(null, false);
    }
}
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter
});

module.exports = {upload};