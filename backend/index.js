const express=require("express")
const cors=require("cors")
const nodemailer = require("nodemailer");
const app = express()
const mongoose =require("mongoose")
app.use(cors())
app.use(express.json())


mongoose.connect("mongodb+srv://Meenaroshini:1234@cluster0.1eb0jkg.mongodb.net/passkey?appName=Cluster0")
  .then(() => console.log("connected to DB"))

.then(function(){
    console.log("connected to DB")
}).catch(function(){
    console.log("failed to connected")
})

app.post("/sendMail",function(req,res){
    var msg = req.body.msg
    var emailList = req.body.emailList
    const credential=mongoose.model("credential",{},"bulkmail")

    credential.find().then(function(data){
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().password
            },
        });

        new Promise( async function(resolve,reject){
            try{
                for(var i=0;i<emailList.length;i++){
                    await transporter.sendMail({
                        from:"meenaroshini242@gmail.com",
                        to:emailList[i],
                        subject:"A message from Bulk Mail App",
                        text:msg
                    })
                    console.log("Email sent to:"+emailList[i])
                }
                resolve("success")
            }
            catch(error){
                console.log("Mail send error:", error)  // 👈 log actual error
                reject(error)
            }
        })
        .then(function(){
            res.send(true)
        })
        .catch(function(error){
            console.log("Promise rejected:", error)  // 👈 show rejection reason
            res.send(error.message || "failed")      // 👈 send actual error message to frontend
        })

    }).catch(function(error){
        console.log("DB error:", error)               // 👈 log DB error
        res.send(error.message || "DB failed")
    })
})

app.listen(5000,function()
{
    console.log("sever started")
})
