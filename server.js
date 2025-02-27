let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mysql = require("mysql");
const path = require("path");

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var dbConn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});


dbConn.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed: ", err.message);
    process.exit(1);
  } else {
    console.log("✅ Database connected successfully!");

    app.listen(3000, () => {
      console.log("🚀 Server is running on port 3000");
    });
  }
});

module.exports = { app, dbConn };

const upload = require("./config/multer");
const { register, login, updateProfile, getNotification } = require("./controller/usercontroller");
const { writerRegistration, allPendingRegistration, getRegistration, 
  updateReviewdAt, rejectRegistration, approveRegistration, 
  insertMagazine,
  insertArticle,
  getAllMagazine,
  getWriter,
  getCategory,
  getMagazine,
  getArticle,
  getAllCategory,
  banMagazine,
  unbannedMagezine,
  getAllBannedMagaizne,
  myMagazineList,
  searchMagazine,
  insertFavorite,
  deleteFavorite,
  myFavorite,
  getFavorite,
  getCategoryByName,
  getMagazinesByCategory} = require("./controller/writerController");
const { get } = require("http");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// routes
app.post("/register-account",register)
app.post("/login",login)
app.put("/update-profile/:user_id",upload.single("profile_path"),updateProfile)
app.get("/get-notification/:user_id",getNotification)

app.post("/writer-registration", upload.single("id_card_path"), writerRegistration);
app.get("/all-pending-registration", allPendingRegistration);
app.get("/get-registration/:registration_id", getRegistration);
app.put("/update-reviewed-at/:registration_id", updateReviewdAt);
app.put("/reject-registration/:registration_id", rejectRegistration);
app.put("/approve-registration/:registration_id/:user_id", approveRegistration);
app.post("/insert-magazine", upload.single("cover_path"),insertMagazine);
app.post("/insert-article", upload.single("image_path"),insertArticle);
app.get("/get-all-magazine",getAllMagazine)
app.get("/get-magazine/:magazine_id",getMagazine)
app.get("/get-article/:magazine_id",getArticle)
app.get("/get-writer/:writer_id",getWriter)
app.get("/get-category/:category_id",getCategory)
app.get("/get-all-category",getAllCategory)
app.put("/ban-magazine/:magazine_id",banMagazine)
app.put("/unbanned-magazine/:magazine_id",unbannedMagezine)
app.get("/get-all-banned-magazine",getAllBannedMagaizne)
app.get("/my-magazine-list/:writer_id",myMagazineList)
app.get("/search-magazine/:prompt",searchMagazine)
app.get("/get-favorite/:user_id/:magazine_id",getFavorite)
app.post("/insert-favorite/:user_id/:magazine_id",insertFavorite)
app.post("/delete-favorite/:user_id/:magazine_id",deleteFavorite)
app.get("/my-favorite/:user_id",myFavorite)
app.get("/get-category-by-name/:name",getCategoryByName)
app.get("/get-magazines-by-category/:category_id",getMagazinesByCategory)