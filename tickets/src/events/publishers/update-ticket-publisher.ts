import { Publisher, TicketUpdatedEvent, Subjects } from "@gtxticketing/common";

export class UpdateTicketPublish extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.UpdatedTicket = Subjects.UpdatedTicket;
}