var controller={}

var client=require("../models/client");
var user=require("../models/user");
var attrbution=require("../models/attribute");
var bcrypt = require('bcrypt');
const { Op } = require("sequelize");


controller.liste=(req,res)=>{

    client.findAll({
[Op.or]:{
    nomClient:"%"+req.body.nomClient+"%",
    prenomClient:"%"+req.body.nomClient+"%"
}

    }).then(users=>{

        res.json(users);
    })

}

controller.add=(req,res)=>{
console.log(req.body);
client.create({
    nomClient:req.body.nomClient,
    prenomClient:req.body.prenomClient}).then( (user) =>{
            attrbution.create({ 
posteId:req.body.poste,
heure:req.body.heure,
jour:req.body.jour,
clientId:user.id
        }).then(() =>{
        res.sendStatus(200);
        })
    })

}

controller.login=(req,res)=>{

var login=req.body.login;
var mdp=req.body.password;

user.findOne({where:{login:login}}).then(async (current) => {
console.log("user found")
    //compare le hashh du mot de pass entré avec celui dans la base de donées
    const match = await bcrypt.compare(mdp, current.password);

if(match){
  res.cookie('user', user, { maxAge: 1000*60*60, httpOnly: true ,signed:true});
  res.redirect("/");
}else{
    res.send({"msg":"ko pass"});
}
  
    
    }).catch((err)=>{
        console.log(err);
      res.send({"msg":"ko"});
    });
}


controller.logout=(req,res) => {
    console.log("ddeconnection");
    res.clearCookie('user');
       res.redirect("/");
  }
module.exports = controller;