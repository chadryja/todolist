const express=require("express");
const bodyparser=require("body-parser")
const ejs=require("ejs")
const app=express();
const mongoose=require("mongoose");
var _ = require('lodash');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://jawad:jojololo565@cluster0.rii9teq.mongodb.net/todo')

}
  const itemscema=new mongoose.Schema({name:String})
  const item=mongoose.model("item",itemscema);
  const item1=new item({name:"Tahajud"})
  const item2=new item({name:"Namaz"})
  const defaltitems=[item1,item2];
//  random list
const listscema=new mongoose.Schema({name:String,item:[itemscema]});
const list=mongoose.model("list",listscema);



app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));  
app.get('/',async(req,res)=>{
    const data= await item.find({});
    if(data.length ===0){
        await item.insertMany(defaltitems)
    }
 res.render("list" ,{test:"Today",item:data});
                                
})

app.post('/',async(req,res)=>{
    var itam=req.body.inp1;
    var listitm=req.body.but;
    const newitme=new item({name:itam});
if(listitm==="Today"){
    
   await item.insertMany(newitme)
                                       
    res.redirect('/')}
    else{
      const done=  await list.findOne({name:listitm});
    done.item.push(newitme);
    done.save();
    res.redirect('/'+listitm)
    }  
});


app.get('/:id',async(req,res)=>{
    const listparms=_.capitalize(req.params['id']);
    const fid=await list.findOne({name:listparms});
    if(!fid){console.log("okaaaaaa")
    const listran=new list({name:listparms,item:defaltitems})
await listran.save();res.redirect("/"+listparms); }
else{
    res.render("list",{test:fid.name,item:fid.item});
}
})

app.post("/delet",async(req,res)=>{
    var delitem=req.body.del;
    console.log(delitem)
    var listnam=req.body.listdel
    if(listnam==="Today"){
    await item.deleteOne({_id:delitem});
    res.redirect("/")}
    else{ 
        await list.findOneAndUpdate({name:listnam},{$pull:{item:{_id:delitem}}});
        res.redirect("/"+listnam); 
    }
})
 

app.listen(3000,(req,res)=>{
    console.log("okaaa");
})