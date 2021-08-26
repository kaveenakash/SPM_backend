const multer = require('multer')
const  uuid = require('uuid');

const MIME_TYPE_MAP = {
    // 'application/pdf':'pdf'
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
    'image/png':'png'
    
}


const fileUpload = multer({
    limits:50000000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads/images')
        },
        filename:(req,file,cb) =>{
            const ext = MIME_TYPE_MAP[file.mimetype]
            cb(null,uuid.v4() + '.' + ext);
        }, 
        fileFilter:(req,file,cb) =>{
            const isValid = !!MIME_TYPE_MAP[file.mimetype]
            let error = isValid ? null : new Error('inValid mime type!');
            cb(error,isValid)
        }
    })
})
module.exports = fileUpload;