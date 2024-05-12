import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApiStore from './apiStore';

// Create OrderContext
const OrderContext = createContext();

// Custom hook to use OrderContext
const useOrderContext = () => useContext(OrderContext);

// OrderContextProvider component
const OrderContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const { events, fetchEvents } = useApiStore();
    const [orders, setOrders] = useState([]);
    const [ticketCounts, setTicketCounts] = useState({});
    const [eventPrices, setEventPrices] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [tickets, setTickets] = useState([]);

    // Function to add an order
    const addOrder = (order) => {
        setOrders(prevOrders => [...prevOrders, order]);
    };

    // Function to remove an order
    const removeOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        setTicketCounts({});
        setEventPrices({});
        setTotalPrice(0);
    };

    // Function to add tickets to an order
    const addTickets = (eventId, number, pricePerTicket) => {
        const newCount = (ticketCounts[eventId] || 0) + number;
        const newEventPrice = (eventPrices[eventId] || 0) + number * pricePerTicket;
        const newTotalPrice = totalPrice + number * pricePerTicket;

        setTicketCounts(prevTicketCounts => ({ ...prevTicketCounts, [eventId]: newCount }));
        setEventPrices(prevEventPrices => ({ ...prevEventPrices, [eventId]: newEventPrice }));
        setTotalPrice(newTotalPrice);
    };

    // Function to remove tickets from an order
    const removeTickets = (eventId, number, pricePerTicket) => {
        const currentCount = ticketCounts[eventId] || 0;
        const newCount = Math.max(currentCount - number, 0);
        const priceReduction = number * pricePerTicket;

        setTicketCounts(prevTicketCounts => ({ ...prevTicketCounts, [eventId]: newCount }));
        setEventPrices(prevEventPrices => ({ ...prevEventPrices, [eventId]: Math.max((prevEventPrices[eventId] || 0) - priceReduction, 0) }));
        setTotalPrice(prevTotalPrice => Math.max(prevTotalPrice - priceReduction, 0));

        if (newCount === 0) {
            removeOrder(eventId);
        }
    };

    // Function to generate tickets for orders
    const generateTicketsForOrders = (orders) => {
        return orders.flatMap(order => {
            const numTickets = order.ticketCount || 0;
            return Array.from({ length: numTickets }, (_, i) => ({
                ticketId: `${order.id}-${order.name}-${order.date}-${i}`,
                eventName: order.name,
                eventLocation: order.where,
                eventDate: order.date,
                eventFrom: order.from,
                eventTo: order.to,
            }));
        });
    };

    // Function to confirm the order and generate tickets
    const confirmOrder = () => {
        const newTickets = generateTicketsForOrders(Array.isArray(orders) ? orders : [orders]);
        setTickets(newTickets);
        navigate('/tickets');
    };

    // Function to clear all orders
    const clearOrders = () => {
        setOrders([]);
        setEventPrices({});
        setTotalPrice(0);
    }

    // Context value
    const value = {
        events,
        orders,
        addTickets,
        removeTickets,
        ticketCounts,
        eventPrices,
        totalPrice,
        addOrder,
        clearOrders,
        removeOrder,
        confirmOrder,
        tickets,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export { OrderContextProvider, useOrderContext, OrderContext };
