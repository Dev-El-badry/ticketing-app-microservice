import { Subjects, TicketCreatedEvent, Publisher } from '@gtxticketing/common';

export class CreateTicketPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.CreatedTicket = Subjects.CreatedTicket;
}