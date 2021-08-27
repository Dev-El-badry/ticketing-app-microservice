import { Subjects } from './subjects';

export interface TicketCreatedEvent {
  subject: Subjects.CreateTicket;
  data: {
    id: string;
    title: string;
    price: number;
  };
}