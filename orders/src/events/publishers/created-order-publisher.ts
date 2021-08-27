import { OrderCreatedEvent, Publisher, Subjects } from "@gtxticketing/common";

export class CreatedOrderPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.CreatedOrder = Subjects.CreatedOrder;
}