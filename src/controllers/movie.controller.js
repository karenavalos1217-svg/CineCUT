// src/controllers/movie.controller.js
const movieService = require('../services/movie.service');
class MovieController {
  async crear(req, res){ try{ const d=await movieService.crear(req.body); res.status(201).json({success:true,message:'Película creada',data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async listar(req, res){ try{ const d=await movieService.listar(); res.json({success:true,data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async obtenerUna(req, res){ try{ const d=await movieService.obtenerUna(req.params.id); res.json({success:true,data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async actualizar(req, res){ try{ const d=await movieService.actualizar(req.params.id, req.body); res.json({success:true,message:'Película actualizada',data:d}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
  async eliminar(req, res){ try{ await movieService.eliminar(req.params.id); res.json({success:true,message:'Película eliminada'}); }catch(e){res.status(e.status||500).json({success:false,error:e.message});}}
}
module.exports = new MovieController();
