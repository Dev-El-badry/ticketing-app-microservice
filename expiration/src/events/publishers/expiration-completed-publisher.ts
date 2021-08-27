import { Publisher, OrderCompletedEvent, Subjects } from "@gtxticketing/common";

export class ExpirationCompletedPublisher extends Publisher<OrderCompletedEvent> {
  subject: Subjects.CompletedOrder = Subjects.CompletedOrder;
}