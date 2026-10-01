const express=require("express");
const path=require("path");
const fs=require("fs");
const crypto=require("crypto");
const app=express();
const PORT=process.env.PORT||3000;
const DB=path.join(__dirname,"data.json");
if(!fs.existsSync(DB)) fs.writeFileSync(DB,JSON.stringify({users:[
 {id:"u-admin",name:"Administrateur",email:"admin@pv.local",password:"admin123",role:"admin"},
 {id:"u-tech",name:"Technicien Démo",email:"tech@pv.local",password:"tech123",role:"technician"}
],visits:[]},null,2));
const read=()=>JSON.parse(fs.readFileSync(DB,"utf8"));
const write=d=>fs.writeFileSync(DB,JSON.stringify(d,null,2));
app.use(express.json({limit:"20mb"})); app.use(express.static(path.join(__dirname,"public")));
function token(){return crypto.randomBytes(24).toString("hex")}
const sessions=new Map();
function auth(req,res,next){let t=(req.headers.authorization||"").replace("Bearer ","");let s=sessions.get(t);if(!s)return res.status(401).json({error:"Non authentifié"});req.user=s;next()}
app.post("/api/login",(req,res)=>{let d=read(),u=d.users.find(x=>x.email===req.body.email&&x.password===req.body.password);if(!u)return res.status(401).json({error:"Identifiants incorrects"});let t=token();sessions.set(t,{id:u.id,name:u.name,email:u.email,role:u.role});res.json({token:t,user:sessions.get(t)})});
app.get("/api/me",auth,(req,res)=>res.json(req.user));
app.get("/api/visits",auth,(req,res)=>{let d=read();res.json(req.user.role==="admin"?d.visits:d.visits.filter(v=>v.technicianId===req.user.id))});
app.get("/api/visits/:id",auth,(req,res)=>{let v=read().visits.find(x=>x.id===req.params.id);if(!v)return res.sendStatus(404);if(req.user.role!=="admin"&&v.technicianId!==req.user.id)return res.sendStatus(403);res.json(v)});
app.post("/api/visits",auth,(req,res)=>{let d=read(),v=req.body;v.id=v.id||crypto.randomUUID();v.technicianId=req.user.id;v.technicianName=req.user.name;v.updatedAt=new Date().toISOString();let i=d.visits.findIndex(x=>x.id===v.id);if(i<0)d.visits.push(v);else d.visits[i]={...d.visits[i],...v,technicianId:d.visits[i].technicianId,technicianName:d.visits[i].technicianName,updatedAt:v.updatedAt};write(d);res.json(d.visits.find(x=>x.id===v.id))});
app.delete("/api/visits/:id",auth,(req,res)=>{let d=read(),i=d.visits.findIndex(x=>x.id===req.params.id);if(i<0)return res.sendStatus(404);if(req.user.role!=="admin"&&d.visits[i].technicianId!==req.user.id)return res.sendStatus(403);d.visits.splice(i,1);write(d);res.sendStatus(204)});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log("PV Visite Pro V4 sur http://localhost:"+PORT));