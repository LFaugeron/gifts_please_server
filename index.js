const express = require("express")
const cors = require("cors")
const { Server } = require('socket.io');
require("dotenv").config({path: ".env"})



const app = express()

const http = require("http").Server(app)

app.use(cors())

const socketIO = require('socket.io')(http, {
    cors: {
        origin: process.env.FRONT_URL
    }
});

const clients = []
let inspectorId = ""


//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    //console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("inspector", (socket) => {
        inspectorId = socket
    })

    socket.on("refused", (client) => {
        const socketClient = socketIO.sockets.sockets.get(client.id)
        if(socketClient) {
            socketClient.emit("refused client", client.motif)
        } else {
            socket.emit("nobody")
        }
    })

    socket.on("potdevin", (amount) => {
        const socket = socketIO.sockets.sockets.get(inspectorId)
        if(socket) {
            socket.emit("potdevin", amount)
        }
    })

    socket.on("accepted", (client) => {
        const socket = socketIO.sockets.sockets.get(client.id)
        if(socket) {
            socket.emit("accepted client")
        }
    })

    socket.on("potdevin refused", (client) => {
        const socket = socketIO.sockets.sockets.get(client.id)
        if(socket) {
            socket.emit("potdevin refused")
        }
    })

    socket.on("arrived", (object) => {
        const client = {
            id: socket.id,
            ...object
        }
        if(!clients.find(cl => cl.id === socket.id)) {
            clients.push(client)
            socketIO.emit("nbClients", clients.length)
            socket.emit("position", clients.length)
        }
    })

    socket.on('disconnect', () => {
        //console.log('🔥: A user disconnected');
    });

    socket.on("next", () => {
        const socket = socketIO.sockets.sockets.get(inspectorId)
        if(socket) {
            if(clients.length > 0) {
                const client = clients.shift()
                const socketClient = socketIO.sockets.sockets.get(client.id)
                socket.emit("nbClients", clients.length)
                socket.emit("new", client)
                socketIO.emit("forward")
                if(socketClient) {
                    socketClient.emit("myturn")
                }
            } else {
                socket.emit("new", null)
            }
        }

    })
});

http.listen(5000, () => {
    console.log("listening")
})