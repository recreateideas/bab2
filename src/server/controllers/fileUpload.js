const multer = require('multer'),
    fs = require('fs'),
    path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/sshKeys',
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});

// console.log( require('electron'));

// exports.upload = multer({ dest: 'uploads/' }).single('id_rsa');
exports.upload = multer({storage}).single('file');

exports.moveFile = (req,res) => {
    const file = req.file;
    const meta = req.body;
    console.log(meta);

    const newPath = path.join(__dirname, `uploads/sshKeys/${meta.user}`);

    if (!fs.existsSync(newPath)){
        fs.mkdirSync(newPath);
    }
    const oldPath = path.join(__dirname, `uploads/sshKeys/${file.originalname}`);
    const newSshPath = path.join(__dirname, `uploads/sshKeys/${meta.user}/sshKey`);
    move(oldPath, newSshPath,(e)=>{
            if (e) throw e;
            console.log('Successfully uploaded and moved!')
        });
};

const move = (oldPath, newPath, callback) => {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
};
