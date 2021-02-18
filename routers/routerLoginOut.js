const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const multerFactory = multer({
                        storage: multer.diskStorage({
                            destination: path.join(__dirname, "../profile_imgs"),
                        
                        filename: function (req, file, cb) {
                            let extArray = file.mimetype.split("/");
                            let extension = extArray[extArray.length - 1];
                            cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)}
                    })});
router.use(bodyParser.urlencoded({ extended: true }));
const expressValidator = require("express-validator");
router.use(expressValidator());
const controllerUsuarios = require("../controllers/controllerUsuarios");
///--------------------------------------------------------------------------///

const cus = new controllerUsuarios();

router.get("/login", cus.getLogin);
router.post("/login", cus.postLogin);
router.get("/logout", cus.getLogout);
router.get("/registro", cus.getRegistro);
router.post("/registro", multerFactory.single("foto"), cus.postRegistro);

module.exports = router;