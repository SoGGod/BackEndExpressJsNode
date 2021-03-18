const multer = require('multer')
const path = require('path')  //to read the path
const fs = require('fs')  //file system


const storage = multer.diskStorage({   //to show the location of storage

    destination:(req,file,cb) =>{  //cb=callback

        let fileDestination = 'public/uploads'  //just the location here
        //check if directory exists
        if(!fs.existsSync(fileDestination)){
            fs.mkdirSync(fileDestination,{recursive:true}) //parent directory and child directory duitai banxa hai
            cb(null,fileDestination)
        }
        else{
            cb(null,fileDestination)
        }
    },
    
    filename:(req,file,cb) =>{      //to change the upload things name by removing their extension
        const filename = path.basename(file.originalname,path.extname(file.originalname))
        const ext = path.extname(file.originalname)

        cb(null,filename + '_' +Date.now() + ext)  //kaile kaso name same huda conflict nahos vanera name change garne process ho
    }
    
})

const imageFilter = (req,file,cb) =>{

    if(!file.originalname.match(/\.(jpg|svg|png|jpeg|jfif|JPG|JPEG|PNG|JFIF|SVG)$/)){  //only the given extension files can be uploaded
        cb(new Error('please choose appropriate file type'),false)
    }
        cb(null,true)
}

const imageUpload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits:{
        fileSize:2000000  //~2MB
    },
})
module.exports = imageUpload