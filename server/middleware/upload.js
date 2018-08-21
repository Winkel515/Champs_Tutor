const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'public/util/img/profile')
    },
    filename: function (req, file, callback){
        if(file.originalname !== "Default.png") {
            file.originalname = `${new Date().toLocaleDateString()} ${(Math.random()*100).toFixed(0)} ${file.originalname}`
        }
        callback(null, file.originalname);
    }
})
const fileFilter = (req, file, callback) => {
    if(file.mimetype === "image/jpeg"|| file.mimetype === "image/png" || file.mimetype === "image/jpg"){
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