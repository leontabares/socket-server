import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuariosLista();


export const desconectar = ( cliente: Socket) => {

    cliente.on('disconnect', () => {
        //const usuario = new Usuario(cliente.id);
        usuariosConectados.borrarUsuario(cliente.id);
        console.log(`Cliente desconectado : ${ cliente.id }`);
        //console.log('Cliente desconectado');
    });
}


export const conectarCliente = ( cliente: Socket) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);
}

// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: {de: string, cuerpo: string}) => {
        console.log('Mensaje recibido', payload);
        io.emit('mensaje-nuevo', payload);
    } );
}

// configurar usuario
export const usuarioConectado = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: Function) => {
        //console.log('Usuario conectado', payload.nombre);
        usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
    } );
}



