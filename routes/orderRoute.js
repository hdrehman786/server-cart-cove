
import express from 'express';
import { getOrderHistory, placeOrderCOD } from '../controllers/OrderController.js';


const orderRoute = express.Router();

orderRoute.post("/place", placeOrderCOD);
orderRoute.post("/get", getOrderHistory);



export default orderRoute;