const http=require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
app.use(cors());//this is used for inter communication between url
const users = [{}];
app.get("/",(req,res)=>{
    res.send("heyy its working");
});
const io = socketIO(server);
io.on("connection",(socket)=>{
    socket.on('joined',({user})=>{
        users[socket.id] = user;
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} Has Joined`});
        socket.emit('welcome',{user:"Admin",message:`${users[socket.id]} Welcome To The Chat`});
    })
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })
    socket.on('disconnected',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} Has Left`});
    })
});
const port = 4500 || process.env.PORT;
server.listen(port,()=>{
    console.log(`listening at http://localhost:${port}`);
});