
import express from 'express';
import { getOrderHistory, placeOrderByOnlinePayment, placeOrderCOD } from '../controllers/OrderController.js';


const orderRoute = express.Router();

orderRoute.post("/place", placeOrderCOD);
orderRoute.post("/get", getOrderHistory);
orderRoute.post("/placeonline",placeOrderByOnlinePayment);



export default orderRoute;