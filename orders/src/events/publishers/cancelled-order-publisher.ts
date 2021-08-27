import { OrderCancelledEvent, OrderCreatedEvent, Publisher, Subjects } from "@gtxticketing/common";

export class CancelledOrderPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.CancelledOrder = Subjects.CancelledOrder;
}