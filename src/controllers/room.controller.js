// src/controllers/room.controller.js
const roomService = require('../services/room.service');
class RoomController {
  async crear(req, res){ try{ const d=await roomService.crear(req.body); res.status(201).json({success:true,message:'Sala creada',data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async listar(req, res){ try{ const d=await roomService.listar(); res.json({success:true,data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async obtenerUna(req, res){ try{ const d=await roomService.obtenerUna(req.params.id); res.json({success:true,data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async actualizar(req, res){ try{ const d=await roomService.actualizar(req.params.id, req.body); res.json({success:true,message:'Sala actualizada',data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async eliminar(req, res){ try{ await roomService.eliminar(req.params.id); res.json({success:true,message:'Sala eliminada'}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
}
module.exports = new RoomController();
