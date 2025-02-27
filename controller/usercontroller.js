const {dbConn} = require("../server")
const bcrypt = require("bcryptjs");

function register(req,res){
    let username = req.body.username
    let password = req.body.password
    let email = req.body.email

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password,salt)

    let sql = "INSERT INTO users (username,email,password,name) VALUES (?,?,?,?)"

    dbConn.query(sql,[username,email,password_hash,username],(err,result)=>{
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

function login(req,res){
    let username = req.body.username
    let password = req.body.password

    let sql = "SELECT * FROM users WHERE username = ?"

    dbConn.query(sql,[username],(err,result)=>{
        if(err){
            console.log("Error: ",err)
            res.status(500).json({
                status: "error",
                message: "เกิดข้อผิดพลาดในการค้นหาข้อมูล",
                error: err
            })
        }

        if(result.length > 0){
            let user = result[0]
            if(bcrypt.compareSync(password,user.password)){
                res.send(user)
            }else{
                res.status(401).json({
                    status: "error",
                    message: "รหัสผ่านไม่ถูกต้อง"
                })
            }
        }else{
            res.status(404).json({
                status: "error",
                message: "ไม่พบข้อมูลผู้ใช้งาน"
            })
        }
    })
}

function updateProfile(req,res){

    let filePath = req.file ? `../uploads/${req.file.filename}` : null

    dbConn.query("UPDATE users SET ? , profile_path = ? WHERE user_id = ?",[req.body,filePath,req.params.user_id],
        (err,result)=>{
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

function getNotification(req,res){
    let sql = "SELECT * FROM notification WHERE user_id = ?"

    dbConn.query(sql,[req.params.user_id],(err,result)=>{
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


module.exports = 
{
    register,
    login,
    updateProfile,
    getNotification
}