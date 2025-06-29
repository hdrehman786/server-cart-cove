import express from 'express';
import { AddAdress, editAddress, GetAddress } from '../controllers/AddressController.js';




const AddressRoute = express.Router();

AddressRoute.post("/add", AddAdress);
AddressRoute.post("/get",GetAddress);
AddressRoute.put("/update", editAddress);

export default AddressRoute;