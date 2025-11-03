// src/controllers/function.controller.js
const functionService = require('../services/function.service');
class FunctionController {
  async crear(req, res){ try{ const d=await functionService.crear(req.body); res.status(201).json({success:true,message:'Función creada',data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async listar(req, res){ try{ const d=await functionService.listar(); res.json({success:true,data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async obtenerUna(req, res){ try{ const d=await functionService.obtenerUna(req.params.id); res.json({success:true,data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async actualizar(req, res){ try{ const d=await functionService.actualizar(req.params.id, req.body); res.json({success:true,message:'Función actualizada',data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async eliminar(req, res){ try{ await functionService.eliminar(req.params.id); res.json({success:true,message:'Función eliminada'}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
}
module.exports = new FunctionController();
