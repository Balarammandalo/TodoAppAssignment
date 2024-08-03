const express = require("express")
const app = express()
const path = require("path")
const methodOverride = require("method-override")
const {v4 : uuidv4} = require("uuid")
const mysql = require("mysql2")
const { resourceUsage } = require("process")

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended : true}))

app.set("view engine" , "ejs")
app.set("views" , path.join(__dirname , "views"))

const connection = mysql.createConnection({
    host : 'localhost',
    user : "root",
    password : "Balaram789@",
    database : "todo_app"
})

app.get("/todo" , (req , res) =>{
    let q = "SELECT * FROM todo"
    try{
        connection.query(q , (err ,result) =>{
            if(err) throw err;
            res.render("index.ejs" , {result})
        })
    }
    catch(err){
        res.send("Error!")
    }
})

//get id to edit
app.get("/todo/:id/edit" , (req,res) =>{
    const {id} = req.params
    const q = `SELECT * FROM todo WHERE id = "${id}"`
    try{
        connection.query(q , (err , result) =>{
            if(err) throw err ;
            const todoD = result[0]
            res.render("edit.ejs" , {todoD})
        })
    }
    catch(err){
        console.log(err)
        res.send("Something Error Id")
    }
})

//edit throw patch
app.patch("/todo/:id" , (req ,res) =>{
    const {id} = req.params
    const {password , task} = req.body
    const q = `SELECT * FROM todo WHERE id = '${id}'`
    try{
        connection.query(q , (err , result) =>{
            if(err) throw err;
            const edit = result[0]
            if(password !== edit.password){
                res.send("Password incorected")
            }
            else{
                const q = `UPDATE todo SET task="${task}" WHERE id = "${id}"`
                connection.query(q , (err , result) =>{
                    if(err) throw err;
                    res.render("/todo")
                })
            }
        })
    }
    catch(err){
        res.send("Somethig Edit was error")
    }
})

//new ejs render
app.get("/todo/new" , (req, res) =>{
    res.render("newTodo.ejs")
})

// new form todo attach on data base 
app.post("/todo/new" , (req, res) =>{
    const newId = uuidv4();
    const {task , username , password} = req.body 
    let q = `INSERT INTO todo (id , username , task , password) VALUES ('${newId}' , '${username}' , '${task}' ,'${password}')`
    try{
        connection.query(q , (err, result) =>{
            if(err) throw err 
            console.log(result)
            res.redirect("/todo")
        })
    }
    catch(err){
        res.send("Filed To Added")
    }
})

//delete todo 
app.get("/todo/:id" , (req, res) =>{
    const {id} = req.params
    let q = `SELECT * FROM todo WHERE id = "${id}"`

    try{
        connection.query(q, (err , result) =>{
            if(err) throw err
            const deleteId = result[0]
            res.render("delete.ejs" , {deleteId})
        })
    }
    catch(err){
        res.send("Something Error in Id")
    }
})

//delete specfic todo 
app.delete("/todo/:id" , (req, res) =>{
    const {id} = req.params
    const {password } = req.body
    let q = `SELECT * FROM todo WHERE id = "${id}"`

    try{
        connection.query(q , (err , result) =>{
            if(err) throw err
            const user = result[0]
            if(password != user.password){
                res.send("Password Doesn't Matching")
            }else{
                let dq = `DELETE FROM todo WHERE id = "${id}" ` 
                connection.query(dq , (err , result) =>{
                    if(err) throw err
                    res.redirect("/todo")
                })
            }
        })
    }
    catch(err){
        res.send("Something Error Can't Delete")
    }

})


app.listen(5000, (req , res) =>{
    console.log("App is listening on 5000 port number")
})
