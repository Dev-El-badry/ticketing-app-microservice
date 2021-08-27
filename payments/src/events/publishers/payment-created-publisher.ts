import { Publisher, PaymentCreatedEvent, Subjects } from "@gtxticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}