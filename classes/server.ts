import express from 'express';
import { SERVER_PORT } from '../globals/enviroment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';



export default class Server {

    private static _intance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app =express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        this.escucharSockets();
    }

    public static get instance() {
        return this._intance || (this._intance = new this());
    }


    private escucharSockets() {
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {
            //console.log('Cliente conectado');

            //id socket del cliente que se conecto
            //console.log(cliente.id);

            //Conectar cliente
            socket.conectarCliente(cliente, this.io);

            // Configurar Usuario conectado
            socket.usuarioConectado(cliente, this.io);

            // Obtener usuarios activos
            socket.obtenerUsuarios(cliente, this.io);

            // Mensajes
            socket.mensaje(cliente, this.io);

            // desconectar
            socket.desconectar(cliente, this.io);

        });
    }

    start(callback: Function) {
        this.httpServer.listen(this.port);
    }

}