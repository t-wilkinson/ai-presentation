const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors')
const app = express();
const fileupload = require('express-fileupload')
const { spawnSync } = require('child_process')
const process = require('process')
const path = require('path')

const tmpFolder = '/tmp/style-transfer-uploads'
const tmpSuffix = () => Date.now() + '-' + Math.round(Math.random() * 1E9)

const storage = multer.diskStorage({
   destination: tmpFolder,
   filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + tmpSuffix())
  },
})
const upload = multer({storage});

async function runStyleTransfer(styleImg, contentImg) {
   const outputImg = `${tmpFolder}/${tmpSuffix()}.jpg`
   const args = ['-s', styleImg, '-c', contentImg, '-o', outputImg, '--image-size', 300, '--style-weight', 100000]
   // const { spawn } = require( 'child_process' );
   const cwd = path.normalize(path.join(process.cwd(), '../style-transfer'))
   await spawnSync('./run_neural_style', args , { cwd });

//    ls.stdout.on( 'data', ( data ) => {
//        console.log( `stdout: ${ data }` );
//    } );

//    ls.stderr.on( 'data', ( data ) => {
//        console.log( `stderr: ${ data }` );
//    } );

//    ls.on( 'close', ( code ) => {
//        console.log( `child process exited with code ${ code }` );
//    } );

   return outputImg
}

const corsOptions = {
   origin: ['http://192.168.0.100:3000', 'http://192.168.0.114:3000', 'http://localhost:3000', 'http://localhost:3008']
}

app.post('/style-transfer', cors(corsOptions), upload.any(), async function(req, res){
   const styleImg = req.files.find(o => o.fieldname === 'style')
   const contentImg = req.files.find(o => o.fieldname === 'content')
   try {
   const outputImg = await runStyleTransfer(styleImg.path, contentImg.path)
   res.sendFile(outputImg)
   } catch (e) {
      console.error(e)
      console.error(e.stack)
      console.error(e.message)
   }
});

app.use(
   cors(),
   fileupload(),
   bodyParser.json()
);

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static('public'));

app.listen(3008, () => {
   console.log(`Listening on port ${3008}`)
});
