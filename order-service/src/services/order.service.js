const { v4: uuidv4 } = require('uuid');

const orderRepository = require('../repositories/order.repository');
const OrderModel = require('../models/order.model');
const cartClient = require('../clients/cart.client');

// SNS Publisher
const orderPublisher = require('../events/order.publisher');

const {
  validateOrderId,
  validateUserId
} = require('../utils/validator');


// PLACE ORDER
const placeOrder = async (data) => {

  validateUserId(data.userId);


  // Call Cart Service
  const cart = await cartClient.getCartByUserId(data.userId);


  if (!cart.items || cart.items.length === 0) {

    throw {
      statusCode: 400,
      message: "Cart is empty"
    };

  }


  const order = {

    orderId: uuidv4(),

    userId: data.userId,

    items: cart.items,

    totalAmount: cart.totalPrice,

    status: OrderModel.statuses.PENDING,

    paymentStatus:
      OrderModel.paymentStatuses.PENDING,

    statusHistory: [
      {
        status: OrderModel.statuses.PENDING,
        timestamp: new Date().toISOString(),
        note: 'Order placed',
        performedBy: 'System',
      },
    ],

    createdAt: new Date().toISOString(),

  };


  // Save order in DynamoDB
  const savedOrder =
    await orderRepository.create(order);


  // Publish ORDER_CREATED event to SNS
  await orderPublisher.publishOrderCreated(
    savedOrder
  );


  return savedOrder;

};



// GET ORDER
const getOrder = async (orderId) => {

  validateOrderId(orderId);


  const order =
    await orderRepository.findById(orderId);


  if (!order) {

    throw {
      statusCode: 404,
      message: "Order not found"
    };

  }


  return order;

};



// GET USER ORDERS
const getUserOrders = async (userId) => {

  validateUserId(userId);

  return await orderRepository.findByUserId(
    userId
  );

};



// CANCEL ORDER
const cancelOrder = async (orderId) => {

  validateOrderId(orderId);


  const order =
    await orderRepository.findById(orderId);


  if (!order) {

    throw {
      statusCode: 404,
      message: "Order not found"
    };

  }


  if (
    order.status ===
    OrderModel.statuses.CANCELLED
  ) {

    throw {
      statusCode: 400,
      message: "Order already cancelled"
    };

  }


  const updates = {

    status:
      OrderModel.statuses.CANCELLED

  };


  const updated =
    await orderRepository.update(orderId, updates);


  await orderRepository.appendTimeline(orderId, {
    status: OrderModel.statuses.CANCELLED,
    timestamp: new Date().toISOString(),
    note: 'Order cancelled',
    performedBy: 'System',
  });


  return updated;

};



// UPDATE ORDER PAYMENT STATUS
const updateOrderPaymentStatus = async (orderId, updates) => {

  validateOrderId(orderId);


  const order =
    await orderRepository.findById(orderId);


  if (!order) {

    throw {
      statusCode: 404,
      message: "Order not found"
    };

  }


  return await orderRepository.update(
    orderId,
    updates
  );

};



// GET ALL ORDERS (admin)
const getAllOrders = async () => {
  return await orderRepository.findAll();
};



// UPDATE ORDER STATUS (admin)
const updateOrderStatus = async (orderId, status, note) => {

  validateOrderId(orderId);

  if (!status || typeof status !== 'string') {
    throw {
      statusCode: 400,
      message: 'Valid status is required'
    };
  }

  const validStatuses = Object.values(OrderModel.statuses);
  if (!validStatuses.includes(status)) {
    throw {
      statusCode: 400,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    };
  }

  const order =
    await orderRepository.findById(orderId);

  if (!order) {
    throw {
      statusCode: 404,
      message: "Order not found"
    };
  }

  const updated =
    await orderRepository.update(orderId, { status });

  await orderRepository.appendTimeline(orderId, {
    status,
    timestamp: new Date().toISOString(),
    note: note || '',
    performedBy: 'Admin',
  });

  return updated;

};



// GET ORDER TIMELINE
const getOrderTimeline = async (orderId) => {

  validateOrderId(orderId);

  const order =
    await orderRepository.findById(orderId);

  if (!order) {
    throw {
      statusCode: 404,
      message: "Order not found"
    };
  }

  return order.statusHistory || [];

};



module.exports = {

  placeOrder,
  getOrder,
  getUserOrders,
  cancelOrder,
  updateOrderPaymentStatus,
  getAllOrders,
  updateOrderStatus,
  getOrderTimeline

};