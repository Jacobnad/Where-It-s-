import { useOrderContext } from '../../OrderContextProvider';
import EventCalc from '../eventCalc/EventCalc';
import './eventCard.css';

function EventCard({ event, addEventTicket }) {
    const { addOrder, orders } = useOrderContext();

    const handleAddToCart = () => {
        if (!event) return;

        const { eventId, name, where, when, price } = event;

        const existingOrderIndex = orders.findIndex(order => order.id === eventId);
        const newTicketCount = (existingOrderIndex !== -1) ? orders[existingOrderIndex].ticketCount + 1 : 1;
        const totalPrice = newTicketCount * price;

        const order = {
            id: eventId,
            name,
            where,
            date: when ? when.date : 'Inget datum tillgängligt',
            from: when ? when.from : 'Inget datum tillgängligt',
            to: when ? when.to : 'Inget datum tillgängligt',
            price: price || 0,
            ticketCount: newTicketCount,
            totalPrice
        };

        addOrder(order);
    };

    if (!event) {
        return <p>Ingen eventdata tillgänglig</p>;
    }

    const { name, when, where } = event;

    return (
        <div className="event-card">
            <section className='details__container'>
                <h1>{name}</h1>
                <p className='single-event__when'>
                    {when ? `${when.date} ${when.from} - ${when.to}` : 'Inget datum tillgängligt'}
                </p>
                <p className='single-event__where'>
                    @ {where || 'Ingen plats angiven'}
                </p>
            </section>

            <section className='tickets__container'>
                <EventCalc event={event} addEventTicket={addEventTicket} />
            </section>

            <section className="btn__container">
                <button className='btn__styling' onClick={handleAddToCart}>Lägg i varukorgen</button>
            </section>
        </div>
    );
}

export default EventCard;
