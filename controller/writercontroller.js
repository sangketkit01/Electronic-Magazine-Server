const { dbConn } = require("../server");

function writerRegistration(req, res) {
    const filePath = req.file ? `../uploads/${req.file.filename}` : null;
    dbConn.query("INSERT INTO registration SET ? , id_card_path = ?", [req.body,filePath], (error, results) => {
        if (error) {
        console.error("SQL Error:", error);
        return res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
            error: error,
        });
        }
        res.status(201).json({
        status: "success",
        message: "บันทึกข้อมูลเรียบร้อย",
        writerId: results.insertId,
        });
    });
}

function allPendingRegistration(req, res) {
    dbConn.query("SELECT * FROM registration WHERE status = 'pending'", (error, results) => {
        if (error) {
        console.error("SQL Error:", error);
        return res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error,
        });
        }
        res.send(results);
    });
}

function getRegistration(req, res) {
    let registrationId = req.params.registration_id;
    dbConn.query("SELECT * FROM registration WHERE registration_id = ?",[registrationId], (error, results) => {
        if (error) {
        console.error("SQL Error:", error);
        return res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
            error: error,
        });
        }
        res.send(results[0]);
    });
}

function updateReviewdAt(req, res) {
    let registrationId = req.params.registration_id;
    dbConn.query("UPDATE registration SET reviewed_at = NOW() WHERE registration_id = ?",[registrationId], (error, results) => {
        if (error) {
        console.error("SQL Error:", error);
        return res.status(500).json({
            status: "error",
            message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
            error: error,
        });
        }
        res.json({
        status: "success",
        message: "อัปเดตข้อมูลเรียบร้อย",
        });
    });
}

function rejectRegistration(req, res) {
    let registrationId = req.params.registration_id;
    dbConn.query("UPDATE registration SET status = 'rejected' WHERE registration_id = ?",[registrationId], (error, results) => {
        if (error) {
            console.error("SQL Error:", error);
            return res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
                error: error,
            });
        }
        res.json({
            status: "success",
            message: "อัปเดตข้อมูลเรียบร้อย",
        });
    });

    dbConn.query("INSERT INTO notification SET notification_title = ? , notification_detail = ? , user_id = ? , notification_type_id = ?",
        [
            "การปฏิเสธการสมัครเขียนบทความ",
            "ขออภัย คุณไม่ผ่านการอนุมัติให้เขียนบทความบนแอปพลิเคชั่นของเรา",
            req.params.user_id,
            3
        ], (error, results) => {
            if (error) {
                console.error("SQL Error:", error);
                return res.status(500).json({
                    status: "error",
                    message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                    error: error,
                });
            }
        }
    );
}

function approveRegistration(req, res) {
    let registrationId = req.params.registration_id;
    dbConn.query("UPDATE registration SET status = 'approved' WHERE registration_id = ?",[registrationId], (error, results) => {
        if (error) {
            console.error("SQL Error:", error);
            return res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
                error: error,
            });
        }

        dbConn.query("UPDATE users SET role = 'writer' WHERE user_id = ?",[req.params.user_id], (error, results) => {
            if (error) {
                console.error("SQL Error:", error);
                return res.status(500).json({
                    status: "error",
                    message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
                    error: error,
                });
            }
        });

        dbConn.query("INSERT INTO notification SET notification_title = ? , notification_detail = ? , user_id = ? , notification_type_id = ?", 
            [
                "การอนุมัติสมัครเขียนบทความ",
                "คุณได้รับการอนุมัติให้เขียนบทความบนเว็บไซต์ของเรา",
                req.params.user_id,
                2
            ], (error, results) => {
                if (error) {
                    console.error("SQL Error:", error);
                    return res.status(500).json({
                        status: "error",
                        message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                        error: error,
                    });
                }
        }
        );

        res.json({
        status: "success",
        message: "อัปเดตข้อมูลเรียบร้อย",
        });
    });
}

function insertMagazine(req,res){
    let file = req.file
    let filePath = file ? `../uploads/${file.filename}` : null
    let sql = "INSERT INTO magazines SET ? , cover_path = ?"
    dbConn.query(sql,[req.body,filePath],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "บันทึกข้อมูลสำเร็จ",
            insertId : result.insertId
        })
    })
}

function insertArticle(req,res){
    let file = req.file
    let filePath = file ? `../uploads/${file.filename}` : null
    let sql = "INSERT INTO articles SET ? , image_path = ?"
    dbConn.query(sql,[req.body,filePath],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "บันทึกข้อมูลสำเร็จ",
            insertId : result.insertId
        })
    })
}

function getAllMagazine(req,res){
    let sql = "SELECT * FROM magazines where status <> 'banned' order by created_at desc"
    dbConn.query(sql,(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result)
    })
}

function getMagazine(req,res){
    let sql = "SELECT * FROM magazines where magazine_id = ?"
    dbConn.query(sql,[req.params.magazine_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result[0])
    })
}

function getAllCategory(req,res){
    let sql = "SELECT * FROM categories'"
    dbConn.query(sql,(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result)
    })
}

function getCategory(req,res){
    let sql = "SELECT * FROM categories where category_id = ?"
    dbConn.query(sql,[req.params.category_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result[0])
    })
}

function getWriter(req,res){
    let sql = "SELECT * FROM users WHERE role = 'writer' and user_id = ?"
    dbConn.query(sql,[req.params.writer_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result[0])
    })
}

function getArticle(req,res){
    let sql = "SELECT * FROM articles where magazine_id = ?"
    dbConn.query(sql,[req.params.magazine_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result[0])
    })
}

function banMagazine(req,res){
    let sql = "UPDATE magazines SET status = 'banned' where magazine_id = ?"
    dbConn.query(sql,[req.params.magazine_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "อัปเดตข้อมูลสำเร็จ"
        })
    })
}

function unbannedMagezine(req,res){
    let sql = "UPDATE magazines SET status = 'pending' where magazine_id = ?"
    dbConn.query(sql,[req.params.magazine_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "อัปเดตข้อมูลสำเร็จ"
        })
    })
}

function getAllBannedMagaizne(req,res){
    let sql = "SELECT * FROM magazines where status = 'banned' order by created_at desc"
    dbConn.query(sql,(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result)
    })
}

function myMagazineList(req,res){   
    let sql = "SELECT * FROM magazines where writer_id = ?"
    dbConn.query(sql,[req.params.writer_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result)
    })
}

function searchMagazine(req,res){
    let sql = "SELECT * FROM magazines where title like ?"
    dbConn.query(sql,[`%${req.params.prompt}%`],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการค้นหาข้อมูล",
                error: err
            })
        }
        res.send(result)
    })
}

function getFavorite(req,res){
    let sql = "SELECT * FROM favorites where user_id = ? and magazine_id = ?"
    dbConn.query(sql,[req.params.user_id,req.params.magazine_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการค้นหาข้อมูล",
                error: err
            })
        }
        res.send(result[0])
    })
}

function insertFavorite(req,res){
    console.log(req.params)
    let sql = "INSERT INTO favorites SET user_id = ? , magazine_id = ?"
    dbConn.query(sql,[req.params.user_id,req.params.magazine_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "บันทึกข้อมูลสำเร็จ"
        })
    })
}

function deleteFavorite(req,res){
    let sql = "DELETE FROM favorites where user_id = ? and magazine_id = ?"
    dbConn.query(sql,[req.params.user_id,req.params.magazine_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการลบข้อมูล",
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "ลบข้อมูลสำเร็จ"
        })
    })
}

function myFavorite(req, res) {
  let sql = `
        SELECT m.* 
        FROM magazines m
        INNER JOIN favorites f ON m.magazine_id = f.magazine_id
        WHERE f.user_id = ?
    `;

  dbConn.query(sql, [req.params.user_id], (err, result) => {
    if (err) {
      console.log("Error: ", err);
      return res.status(500).json({
        status: "error",
        message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        error: err,
      });
    }

    res.status(200).json(result);
  });
}

function getCategoryByName(req,res){
    let sql = "SELECT * FROM categories where name = ?"
    dbConn.query(sql,[req.params.name],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result[0])
    })
}

function getMagazinesByCategory(req,res){
    let sql = "SELECT * FROM magazines where category_id = ?"
    dbConn.query(sql,[req.params.category_id],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
                error: err
            })
        }
        res.send(result)
    })
}




module.exports = { 
    writerRegistration,
    allPendingRegistration,
    getRegistration,
    updateReviewdAt,
    rejectRegistration,
    approveRegistration,
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
    getMagazinesByCategory
};