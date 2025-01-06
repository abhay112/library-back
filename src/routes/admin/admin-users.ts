import express,{Router} from 'express';
import {AdminController} from '../../controllers/admin/admin.controller.js'; 
import { Routes } from '../../interfaces/route.interface.js';

// AdminRoute Class
class AdminRoute implements Routes {
    public path = '/admins';
    public router = Router();
    public adminController = new AdminController();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      this.router.post(`${this.path}`, this.adminController.createAdmin);
      this.router.get(`${this.path}`, this.adminController.fetchAdmins);
      this.router.get(`${this.path}/:id`, this.adminController.getAdminById);
      this.router.put(`${this.path}/:id`, this.adminController.updateAdmin);
      this.router.delete(`${this.path}/:id`, this.adminController.deleteAdmin);
    }
  }
  


export default AdminRoute;

