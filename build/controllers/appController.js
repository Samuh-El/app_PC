"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const router = Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
class AppController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default.query('SELECT * FROM `pyme`,`Usuario-Administrador`');
            res.json(data);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const game = yield database_1.default.query('SELECT FROM games where id = ?', [req.params.id]);
            if (game.lenth > 0) {
                return res.json(game[0]);
            }
            res.status(404).json({ text: "no existe" });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO games set ?', [req.params.body]);
            console.log(req.body);
            res.json({ text: "create..." });
            // var query='CREATE TABLE prueba3 ( `id` INT(10) NOT NULL ,PRIMARY KEY (id), `nombre` VARCHAR(50) NOT NULL );' 
            // await pool.query(query);
            // console.log(req.body)
            // res.json({ text: "create..." });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('DELETE FROM games where id = ?', [req.params.id]);
            res.json({ text: "game delete.." });
        });
    }
    updateDatosEmpresariales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idPyme } = req.body;
            console.log(idPyme);
            console.log(req.body);
            yield database_1.default.query('UPDATE `pyme` set ? WHERE idPyme = ?', [req.body, req.params.id]);
            console.log('UPDATE `pyme` set ? WHERE idPyme = ?', [req.body, req.params.id]);
            res.json(req.body);
        });
    }
    updateDatosUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUsuario } = req.body;
            console.log(idUsuario);
            console.log(req.body);
            yield database_1.default.query('UPDATE `Usuario-Administrador` set ? WHERE idUsuario = ?', [req.body, req.params.id]);
            console.log('UPDATE `Usuario-Administrador` set ? WHERE idUsuario = ?', [req.body, req.params.id]);
            res.json(req.body);
        });
    }
    sendEmailUser(req, res) {
        var contentHTML;
        const { nombre, correo, mensaje } = req.body;
        contentHTML = `
          Informacion de usuario de Productos Chile
          Nombre: ${nombre}
          Correo: ${correo}
          Mensaje: ${mensaje}
         `;
        console.log(contentHTML);
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'felipe.ascencio.sandoval@gmail.com',
                pass: '18416518-k'
            }
        });
        let mailOptions = {
            from: 'felipe.ascencio.sandoval@gmail.com',
            to: 'felipe.ascencio@virginiogomez.cl',
            subject: 'Mensaje de usuario Productos Chile',
            text: contentHTML
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error.message);
            }
            console.log('success');
        });
    }
    sendEmailClient(req, res) {
        var contentHTML;
        const { idUsuario, nombreUsuario, idPyme, mensaje } = req.body;
        contentHTML = `
          Informacion de cliente de Productos Chile
          id cliente:${idUsuario}
          Nombre: ${nombreUsuario}
          id pyme: ${idPyme}
          Mensaje: ${mensaje}
         `;
        console.log(contentHTML);
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'felipe.ascencio.sandoval@gmail.com',
                pass: '18416518-k'
            }
        });
        let mailOptions = {
            from: 'felipe.ascencio.sandoval@gmail.com',
            to: 'felipe.ascencio@virginiogomez.cl',
            subject: 'Mensaje de usuario Productos Chile',
            text: contentHTML
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error.message);
            }
            console.log('success');
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            console.log(email);
            console.log(password);

            var Admin = {
                idUsuario: 0,
                NombreUsuario: '',
                idPyme: 0
            };
            console.log("consulta a la db por correo y password");
            const admin = yield database_1.default.query('SELECT idUsuario,NombreUsuario,Pyme_idPyme FROM `Usuario-Administrador` WHERE correo=\'' + email + '\' AND ClaveUsuario=\'' + password + '\'');
            if (admin.length > 0) {
            // res.json (
            //     admin[0]
            // )

               Admin = admin[0]
               console.log('admin Admin= ' + Admin)
               console.log('admin Admin= ' + Admin.NombreUsuario)
            //    res.json (
            //     admin[0]
            //     )
            //     return    
               const token = jwt.sign({ _id: Admin.idUsuario }, 'secretkey')
               res.json(token)
            //    return res.json({ Admin, token })

                
            }
            else {
                //res.json({message:'password incorrecta'});
                return res.status(401).send("correo o contraseña incorrecta");
            }
        });
    }
    //obtener usuario-administrador en panel, retorna los datos del usuario y el nombre de la pyme asociada, requiere el id del usuario
    getUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {

            console.log('getusuario metodo en node');
            const usuario = yield database_1.default.query('SELECT u.NombreUsuario,u.ApellidoUsuario,u.celular,u.correo,u.direccion,p.nombrePyme FROM `Usuario-Administrador` AS u INNER JOIN `Pyme` AS p ON u.Pyme_idPyme = p.idPyme where u.idUsuario = ?', [req.params.id]);
            console.log('usuario= ' + usuario);
            if (usuario.length > 0) {
                return res.json(usuario[0]);
            }
            return res.json({ text: "usuario no existe en db" });
        });
    }
    getPyme(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getpyme metodo en node');
            const pyme = yield database_1.default.query('SELECT p.nombrePyme,p.giroPyme,p.fonoContactoUno,p.fonoContactoDos,p.correoContactoPyme,p.redSocialFacebook,p.redSocialInstagram,p.redSocialTwitter,p.redSocialYoutube,p.Region,ru.nombreRubro,re.nombreRegion FROM `pyme` AS p INNER JOIN `Usuario-Administrador` AS u ON u.Pyme_idPyme = p.idPyme INNER JOIN `rubro` AS ru ON p.Rubro_idRubro = ru.idRubro INNER JOIN `region` AS re ON p.idRegion = re.idRegion where u.idUsuario = ?', [req.params.id]);
            if (pyme.length > 0) {
                return res.json(pyme[0]);
            }
            return res.json({ text: "pyme no existe en db" });
        });
    }
    solicitarOnePage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log([req.body, req.params.id]);
            const {} = req.body;
            var contentHTML;
            return;
            contentHTML = `
          Informacion de usuario de Productos Chile
          Id usuario= ${req.params.id}
          Nombre: ${req.body}
          
         `;
            console.log(contentHTML);
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'felipe.ascencio@virginiogomez.cl',
                    pass: '18416518-k'
                }
            });
            let mailOptions = {
                from: 'felipe.ascencio@virginiogomez.cl',
                to: 'felipe.ascencio.sandoval@gmail.com',
                subject: 'Mensaje de usuario Productos Chile',
                text: contentHTML,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error.message);
                }
                console.log('success');
            });
        });
    }
    getProductosbyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getProductosbyUser metodo en node');
            const productos = yield database_1.default.query('SELECT p.* FROM `usuario-administrador` as u inner join `producto` as p ON u.Pyme_idPyme =  p.idPyme where u.Pyme_idPyme=? and p.Habilitado = 1 order by p.idPyme', [req.params.id]);
            console.log('productos= ' + productos);
            res.json(productos);
        });
    }
    getServiciosbyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getServiciosbyUser metodo en node');
            const servicios = yield database_1.default.query('SELECT s.* FROM `usuario-administrador` as u inner join `servicio` as s ON u.Pyme_idPyme =  s.idPyme where u.Pyme_idPyme=? and s.Habilitado = 1 order by s.idPyme', [req.params.id]);
            console.log('servicios= ' + servicios);
            res.json(servicios);
        });
    }
    deleteProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('api');
            yield database_1.default.query('UPDATE `producto` set ? WHERE idProducto = ?', [req.body, req.params.id]);
            res.json({ text: "producto delete.." });
        });
    }
    deleteService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('api');
            yield database_1.default.query('UPDATE `servicio` set ? WHERE idServicio = ?', [req.body, req.params.id]);
            res.json({ text: "service delete.." });
        });
    }
    updateProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('api');
            yield database_1.default.query('UPDATE `producto` set ? WHERE idProducto = ?', [req.body, req.params.id]);
            res.json({ text: "producto updated.." });
        });
    }
    updateService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('api');
            yield database_1.default.query('UPDATE `servicio` set ? WHERE idServicio = ?', [req.body, req.params.id]);
            res.json({ text: "service updated.." });
        });
    }
    getTiposServiciosbyRubro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getTiposServiciosbyRubro metodo en node');
            const tiposServicios = yield database_1.default.query('SELECT t.* FROM `Usuario-Administrador` as u inner join `pyme`as p ON u.Pyme_idPyme = p.idPyme inner join `tipos-servicios-productos` as t on p.Rubro_idRubro=t.idRubro where u.idUsuario = ?', [req.params.id]);
            console.log('tipos de Servicios= ' + tiposServicios);
            res.json(tiposServicios);
        });
    }
    addProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('addProducto en node');
            console.log(req.body);
            yield database_1.default.query('INSERT INTO `producto` set ?', [req.body]);
            console.log(req.body);
            res.json({ text: "create producto..." });
        });
    }
    addService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO `servicio` set ?', [req.body]);
            console.log(req.body);
            res.json({ text: "create service..." });
        });
    }
    getProductosServiciosPorNombre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getProductosServiciosPorNombre metodo en node bla');
            const { nombre } = req.body;
            console.log(nombre);
            const productosServicios = yield database_1.default.query('SELECT idProducto as id,idPyme,nombreProducto as nombre,valorProducto as valor,cantidadProducto as cantidad,idTipos_Servicios_Productos,cantidad_like_producto as likes,cantidad_dislike_producto as dislikes,rutaImagenProducto as rutaImagen,Producto FROM `producto` where Habilitado=1 and nombreProducto like \'%' + nombre + '%\' UNION ALL SELECT idServicio,idPyme,nombreServicio,valorServicio,0,idTipos_Servicios_Productos,cantidad_like_servicio,cantidad_dislike_servicio,rutaImagenServicio,Producto FROM `servicio` where Habilitado=1 and nombreServicio like \'%' + nombre + '%\'');
            console.log('productosServicios= ' + productosServicios);
            res.json(productosServicios);
        });
    }
    getProductosServiciosPorRubro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getProductosServiciosPorRubro metodo en node bla');
            const { rubro } = req.body;
            console.log(rubro);
            const productosServicios = yield database_1.default.query('SELECT p.idProducto as id,p.idPyme,p.nombreProducto as nombre,p.valorProducto as valor,p.cantidadProducto as cantidad,p.idTipos_Servicios_Productos,p.cantidad_like_producto as likes,p.cantidad_dislike_producto as dislikes,p.rutaImagenProducto as rutaImagen,p.Producto FROM `producto` as p INNER JOIN `pyme` as py ON py.idPyme = p.idPyme where p.Habilitado=1 and py.Rubro_idRubro= ' + rubro + ' UNION ALL SELECT s.idServicio,s.idPyme,s.nombreServicio,s.valorServicio,0,s.idTipos_Servicios_Productos,s.cantidad_like_servicio,s.cantidad_dislike_servicio,s.rutaImagenServicio,s.Producto FROM `servicio` as s INNER JOIN `pyme` as py ON py.idPyme = s.idPyme where Habilitado=1 and py.Rubro_idRubro= ' + rubro + '');
            console.log('productosServicios= ' + productosServicios);
            res.json(productosServicios);
        });
    }
    getProductosServiciosPorFiltros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var where = "";
            var valor = "0";
            var consulta = "";
            var nombreProducto = "";
            var nombreServicio = "";
            console.log('getProductosServiciosPorFiltros metodo en node bla');
            const { rubro, region, precio, producto, servicio, nombre } = req.body;
            console.log('rubro= ' + rubro);
            console.log('region =' + region);
            console.log('precio =' + precio);
            console.log('producto =' + producto);
            console.log('servicio =' + servicio);
            console.log('nombre =' + nombre);
            if (precio != "" && precio != undefined) {
                if (precio == 'p10') {
                    valor = '10000';
                }
                if (precio == 'p30') {
                    valor = '30000';
                }
                if (precio == 'p50') {
                    valor = '50000';
                }
                if (precio == 'p70') {
                    valor = '70000';
                }
                if (precio == 'p100') {
                    valor = '100000';
                }
            }
            if (rubro != '' && rubro != undefined) {
                where += " and ru.nombreRubro=\'" + rubro + '\'';
            }
            if (region != '' && region != undefined) {
                where += " and re.nombreRegion=\'" + region + '\'';
            }
            if (nombre != '' && nombre != undefined) {
                nombreProducto = " and p.nombreProducto LIKE \'%" + nombre + '%\'';
                nombreServicio = " and s.nombreServicio LIKE \'%" + nombre + '%\'';
            }
            console.log('where= ' + where);
            console.log('valor= ' + valor);
            if (producto == true) {
                if (servicio == true) {
                    console.log('productos y servicio son true');
                    consulta = 'SELECT p.idProducto as id,p.idPyme,p.nombreProducto as nombre,p.valorProducto as valor,p.cantidadProducto as cantidad,p.idTipos_Servicios_Productos,p.cantidad_like_producto as likes,p.cantidad_dislike_producto as dislikes,p.rutaImagenProducto as rutaImagen,p.Producto FROM `producto` as p INNER JOIN `pyme` as py ON py.idPyme = p.idPyme INNER JOIN `rubro` as ru ON ru.idRubro = py.Rubro_idRubro INNER JOIN `region` as re ON re.idRegion = py.idRegion where p.Habilitado=1' + where + ' and p.valorProducto > ' + valor + nombreProducto + ' UNION ALL SELECT s.idServicio,s.idPyme,s.nombreServicio,s.valorServicio,0,s.idTipos_Servicios_Productos,s.cantidad_like_servicio,s.cantidad_dislike_servicio,s.rutaImagenServicio,s.Producto FROM `servicio` as s INNER JOIN `pyme` as py ON py.idPyme = s.idPyme INNER JOIN `rubro` as ru ON ru.idRubro = py.Rubro_idRubro INNER JOIN `region` as re ON re.idRegion = py.idRegion where Habilitado=1' + where + ' and s.valorServicio > ' + valor + nombreServicio;
                }
                else {
                    console.log('producto true servicio false');
                    consulta = 'SELECT p.idProducto as id,p.idPyme,p.nombreProducto as nombre,p.valorProducto as valor,p.cantidadProducto as cantidad,p.idTipos_Servicios_Productos,p.cantidad_like_producto as likes,p.cantidad_dislike_producto as dislikes,p.rutaImagenProducto as rutaImagen,p.Producto FROM `producto` as p INNER JOIN `pyme` as py ON py.idPyme = p.idPyme INNER JOIN `rubro` as ru ON ru.idRubro = py.Rubro_idRubro INNER JOIN `region` as re ON re.idRegion = py.idRegion where p.Habilitado=1' + where + ' and p.valorProducto > ' + valor + nombreProducto;
                }
            }
            else {
                if (servicio == true) {
                    console.log('producto false servicio true');
                    consulta = 'SELECT s.idServicio,s.idPyme,s.nombreServicio,s.valorServicio,0,s.idTipos_Servicios_Productos,s.cantidad_like_servicio,s.cantidad_dislike_servicio,s.rutaImagenServicio,s.Producto FROM `servicio` as s INNER JOIN `pyme` as py ON py.idPyme = s.idPyme INNER JOIN `rubro` as ru ON ru.idRubro = py.Rubro_idRubro INNER JOIN `region` as re ON re.idRegion = py.idRegion where Habilitado=1' + where + ' and s.valorServicio > ' + valor + nombreServicio;
                }
                else {
                    console.log('productos y servicio son false');
                    res.json({ text: "p y s false" });
                }
            }
            const productosServicios = yield database_1.default.query(consulta);
            console.log('productosServicios= ' + productosServicios);
            res.json(productosServicios);
        });
    }
    getProductoServicio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getProductoServicio metodo en node');
            const { id, Producto } = req.body;
            var consulta = "";
            console.log('id= ' + id);
            console.log('prod= ' + Producto);
            if (Producto == 1) {
                console.log('es un producto');
                consulta = "SELECT p.idProducto as id,p.idPyme,p.nombreProducto as nombre,p.descripcionProducto as descripcion,p.valorProducto as valor,p.cantidadProducto as cantidad,p.idTipos_Servicios_Productos,p.cantidad_like_producto as likes,p.cantidad_dislike_producto as dislikes,p.rutaImagenProducto as rutaImagen,p.Producto,ru.nombreRubro,re.nombreRegion,py.nombrePyme,py.correoContactoPyme,py.fonoContactoUno,py.fonoContactoDos,py.redSocialFacebook,py.redSocialInstagram,py.redSocialTwitter,py.redSocialYoutube,py.link_OnePage FROM `producto` as p INNER JOIN `pyme` as py ON py.idPyme = p.idPyme INNER JOIN `rubro` as ru ON ru.idRubro = py.Rubro_idRubro INNER JOIN `region` as re ON re.idRegion = py.idRegion where p.idProducto= ?";
            }
            else {
                console.log('es un servicio');
                consulta = "SELECT s.idServicio as id,s.idPyme,s.nombreServicio as nombre,s.descripcionServicio as descripcion,s.valorServicio as valor,0 as cantidad,s.idTipos_Servicios_Productos,s.cantidad_like_servicio as likes,s.cantidad_dislike_servicio as dislikes,s.rutaImagenServicio as rutaImagen,s.Producto,ru.nombreRubro,re.nombreRegion,py.nombrePyme,py.correoContactoPyme,py.fonoContactoUno,py.fonoContactoDos,py.redSocialFacebook,py.redSocialInstagram,py.redSocialTwitter,py.redSocialYoutube,py.link_OnePage FROM `servicio` as s INNER JOIN `pyme` as py ON py.idPyme = s.idPyme INNER JOIN `rubro` as ru ON ru.idRubro = py.Rubro_idRubro INNER JOIN `region` as re ON re.idRegion = py.idRegion where s.idServicio= ?";
            }
            const productoServicio = yield database_1.default.query(consulta, [req.params.id]);
            console.log('productoServicio= ' + productoServicio);
            if (productoServicio.length > 0) {
                return res.json(productoServicio[0]);
            }
            return res.json({ text: "productoServicio no existe en db" });
        });
    }
    subirImagenNode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('subir imagena  node en node');
            var bitmap = fs.readFileSync(req.files.uploads[0].path);
            // convert binary data to base64 encoded string
            var file_encode = new Buffer(bitmap).toString('base64');
            console.log('body');
            console.log(req.body);
            console.log('files');
            console.log(req.files);
            console.log(req.files.uploads);
            console.log(req.files.uploads[0]);
            console.log(req.files.uploads[0].originalFilename);
            console.log(req.files.uploads2[0]);
            console.log(req.files.uploads2[0].originalFilename);
            console.log(req.files.uploads3[0]);
            console.log(req.files.uploads3[0].originalFilename);
            console.log(req.files.uploads4[0]);
            console.log(req.files.uploads4[0].originalFilename);
            const cabecera = req.files.uploads[0].originalFilename;
            const rutacabecera = req.files.uploads[0].path;
            const caracteristica = req.files.uploads2[0].originalFilename;
            const rutacaracteristica = req.files.uploads2[0].path;
            const pyme = req.files.uploads3[0].originalFilename;
            const rutapyme = req.files.uploads3[0].path;
            const prodServ = req.files.uploads4[0].originalFilename;
            const rutaprodServ = req.files.uploads4[0].path;
            res.json({ 'message': 'fichero subido correctamente' });
            var contentHTML;
            contentHTML = `
                    Solicitud de one page
                    Nombre archivo cabecera: ${cabecera}
                    Nombre archivo caracteristica: ${caracteristica}
                    Nombre archivo pyme: ${pyme}
                    Nombre archivo producto-servicio: ${prodServ}
                   `;
            console.log(contentHTML);
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'felipe.ascencio@virginiogomez.cl',
                    pass: '18416518-k'
                }
            });
            let mailOptions = {
                from: 'felipe.ascencio@virginiogomez.cl',
                to: 'felipe.ascencio.sandoval@gmail.com',
                subject: 'solicitud one page Productos Chile',
                text: contentHTML,
                attachments: [
                    {
                        filename: cabecera,
                        path: rutacabecera,
                    },
                    {
                        filename: caracteristica,
                        path: rutacaracteristica
                    },
                    {
                        filename: pyme,
                        path: rutapyme
                    },
                    {
                        filename: prodServ,
                        path: rutaprodServ
                    }
                ]
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error.message);
                }
                console.log('success');
            });
        });
    }
}
const appController = new AppController();
exports.default = appController;
