/**
 * This file was auto generated by @block65/openapi-codegen
 *
 * WARN: Do not edit directly.
 *
 * Generated on 2024-07-20T03:13:59.069Z
 *
 */
/** eslint-disable max-classes */
import { Command } from '@block65/rest-client';
import type { Jsonifiable } from 'type-fest';
import type {
  GetOperationCommandInput,
  GetOperationCommandBody,
  LongRunningOperation,
  ListBillingAccountsCommandInput,
  ListBillingAccountsCommandBody,
  BillingAccountList,
  BillingAccountCreateRequest,
  CreateBillingAccountCommandInput,
  CreateBillingAccountCommandBody,
  BillingAccount,
  GetBillingAccountCommandInput,
  GetBillingAccountCommandBody,
  BillingAccountUpdateRequest,
  UpdateBillingAccountCommandInput,
  UpdateBillingAccountCommandBody,
  BillingAccountPortalRequest,
  GetBillingAccountPortalCommandInput,
  GetBillingAccountPortalCommandBody,
  BillingAccountPortal,
  LinkBillingAccountRequest,
  LinkBillingAccountCommandInput,
  LinkBillingAccountCommandBody,
  ListPaymentMethodsCommandInput,
  ListPaymentMethodsCommandBody,
  PaymentMethods,
  CreatePaymentMethodCommandInput,
  CreatePaymentMethodCommandBody,
  PaymentMethodIntendedLro,
  GetPaymentMethodFromStripeCommandInput,
  GetPaymentMethodFromStripeCommandBody,
  PaymentMethod,
  GetPaymentMethodCommandInput,
  GetPaymentMethodCommandBody,
  UpdatePaymentMethodRequest,
  UpdatePaymentMethodCommandInput,
  UpdatePaymentMethodCommandBody,
  DeletePaymentMethodCommandInput,
  DeletePaymentMethodCommandBody,
  PaymentMethodDeletedLro,
  ListBillingSubscriptionsCommandInput,
  ListBillingSubscriptionsCommandBody,
  BillingSubscriptions,
  CreateBillingSubscriptionRequest,
  CreateBillingSubscriptionCommandInput,
  CreateBillingSubscriptionCommandBody,
  BillingSubscriptionLro,
  UpdateBillingSubscriptionRequest,
  UpdateBillingSubscriptionCommandInput,
  UpdateBillingSubscriptionCommandBody,
  CancelSubscriptionCommandInput,
  CancelSubscriptionCommandBody,
  UpdateBillingSubscriptionPromoCodeRequest,
  UpdateBillingSubscriptionPromoCodeCommandInput,
  UpdateBillingSubscriptionPromoCodeCommandBody,
} from './types.js';

/**
 * GetOperationCommand
 *
 */
export class GetOperationCommand extends Command<
  GetOperationCommandInput,
  LongRunningOperation,
  GetOperationCommandBody
> {
  public override method = 'get' as const;

  constructor(input: GetOperationCommandInput) {
    const { operationId } = input;
    super(`/operations/${operationId}`);
  }
}

/**
 * ListBillingAccountsCommand
 *
 */
export class ListBillingAccountsCommand extends Command<
  void,
  BillingAccountList,
  ListBillingAccountsCommandBody
> {
  public override method = 'get' as const;

  constructor() {
    // no input parameters
    super(`/billing-accounts`);
  }
}

/**
 * CreateBillingAccountCommand
 *
 */
export class CreateBillingAccountCommand extends Command<
  CreateBillingAccountCommandInput,
  BillingAccount,
  CreateBillingAccountCommandBody
> {
  public override method = 'post' as const;

  constructor(input: CreateBillingAccountCommandInput) {
    const body = input;
    super(`/billing-accounts`, body);
  }
}

/**
 * GetBillingAccountCommand
 *
 */
export class GetBillingAccountCommand extends Command<
  GetBillingAccountCommandInput,
  BillingAccount,
  GetBillingAccountCommandBody
> {
  public override method = 'get' as const;

  constructor(input: GetBillingAccountCommandInput) {
    const { billingAccountId } = input;
    super(`/billing-accounts/${billingAccountId}`);
  }
}

/**
 * UpdateBillingAccountCommand
 *
 */
export class UpdateBillingAccountCommand extends Command<
  UpdateBillingAccountCommandInput,
  BillingAccount,
  UpdateBillingAccountCommandBody
> {
  public override method = 'put' as const;

  constructor(input: UpdateBillingAccountCommandInput) {
    const { billingAccountId, ...body } = input;
    super(`/billing-accounts/${billingAccountId}`, body);
  }
}

/**
 * GetBillingAccountPortalCommand
 *
 */
export class GetBillingAccountPortalCommand extends Command<
  GetBillingAccountPortalCommandInput,
  BillingAccountPortal,
  GetBillingAccountPortalCommandBody
> {
  public override method = 'post' as const;

  constructor(input: GetBillingAccountPortalCommandInput) {
    const { billingAccountId, ...body } = input;
    super(`/billing-accounts/${billingAccountId}/portal`, body);
  }
}

/**
 * LinkBillingAccountCommand
 *
 */
export class LinkBillingAccountCommand extends Command<
  LinkBillingAccountCommandInput,
  undefined,
  LinkBillingAccountCommandBody
> {
  public override method = 'post' as const;

  constructor(input: LinkBillingAccountCommandInput) {
    const { billingAccountId, ...body } = input;
    super(`/billing-accounts/${billingAccountId}/link`, body);
  }
}

/**
 * ListPaymentMethodsCommand
 *
 */
export class ListPaymentMethodsCommand extends Command<
  ListPaymentMethodsCommandInput,
  PaymentMethods,
  ListPaymentMethodsCommandBody
> {
  public override method = 'get' as const;

  constructor(input: ListPaymentMethodsCommandInput) {
    const { billingAccountId } = input;
    super(`/billing-accounts/${billingAccountId}/payment-methods`);
  }
}

/**
 * CreatePaymentMethodCommand
 *
 */
export class CreatePaymentMethodCommand extends Command<
  CreatePaymentMethodCommandInput,
  PaymentMethodIntendedLro,
  CreatePaymentMethodCommandBody
> {
  public override method = 'post' as const;

  constructor(input: CreatePaymentMethodCommandInput) {
    const { billingAccountId } = input;
    super(`/billing-accounts/${billingAccountId}/payment-methods`);
  }
}

/**
 * GetPaymentMethodFromStripeCommand
 *
 */
export class GetPaymentMethodFromStripeCommand extends Command<
  GetPaymentMethodFromStripeCommandInput,
  PaymentMethod,
  GetPaymentMethodFromStripeCommandBody
> {
  public override method = 'get' as const;

  constructor(input: GetPaymentMethodFromStripeCommandInput) {
    const { billingAccountId, stripePaymentMethodId } = input;
    super(
      `/billing-accounts/${billingAccountId}/payment-methods/stripe/${stripePaymentMethodId}`,
    );
  }
}

/**
 * GetPaymentMethodCommand
 *
 */
export class GetPaymentMethodCommand extends Command<
  GetPaymentMethodCommandInput,
  PaymentMethod,
  GetPaymentMethodCommandBody
> {
  public override method = 'get' as const;

  constructor(input: GetPaymentMethodCommandInput) {
    const { billingAccountId, paymentMethodId } = input;
    super(
      `/billing-accounts/${billingAccountId}/payment-methods/${paymentMethodId}`,
    );
  }
}

/**
 * UpdatePaymentMethodCommand
 *
 */
export class UpdatePaymentMethodCommand extends Command<
  UpdatePaymentMethodCommandInput,
  undefined,
  UpdatePaymentMethodCommandBody
> {
  public override method = 'put' as const;

  constructor(input: UpdatePaymentMethodCommandInput) {
    const { billingAccountId, paymentMethodId, ...body } = input;
    super(
      `/billing-accounts/${billingAccountId}/payment-methods/${paymentMethodId}`,
      body,
    );
  }
}

/**
 * DeletePaymentMethodCommand
 *
 */
export class DeletePaymentMethodCommand extends Command<
  DeletePaymentMethodCommandInput,
  PaymentMethodDeletedLro,
  DeletePaymentMethodCommandBody
> {
  public override method = 'delete' as const;

  constructor(input: DeletePaymentMethodCommandInput) {
    const { billingAccountId, paymentMethodId } = input;
    super(
      `/billing-accounts/${billingAccountId}/payment-methods/${paymentMethodId}`,
    );
  }
}

/**
 * ListBillingSubscriptionsCommand
 *
 */
export class ListBillingSubscriptionsCommand extends Command<
  ListBillingSubscriptionsCommandInput,
  BillingSubscriptions,
  ListBillingSubscriptionsCommandBody
> {
  public override method = 'get' as const;

  constructor(input: ListBillingSubscriptionsCommandInput) {
    const { billingAccountId } = input;
    super(`/billing-accounts/${billingAccountId}/subscriptions`);
  }
}

/**
 * CreateBillingSubscriptionCommand
 *
 */
export class CreateBillingSubscriptionCommand extends Command<
  CreateBillingSubscriptionCommandInput,
  BillingSubscriptionLro,
  CreateBillingSubscriptionCommandBody
> {
  public override method = 'post' as const;

  constructor(input: CreateBillingSubscriptionCommandInput) {
    const { billingAccountId, ...body } = input;
    super(`/billing-accounts/${billingAccountId}/subscriptions`, body);
  }
}

/**
 * UpdateBillingSubscriptionCommand
 *
 */
export class UpdateBillingSubscriptionCommand extends Command<
  UpdateBillingSubscriptionCommandInput,
  undefined,
  UpdateBillingSubscriptionCommandBody
> {
  public override method = 'put' as const;

  constructor(input: UpdateBillingSubscriptionCommandInput) {
    const { billingAccountId, subscriptionId, ...body } = input;
    super(
      `/billing-accounts/${billingAccountId}/subscriptions/${subscriptionId}`,
      body,
    );
  }
}

/**
 * CancelSubscriptionCommand
 *
 */
export class CancelSubscriptionCommand extends Command<
  CancelSubscriptionCommandInput,
  undefined,
  CancelSubscriptionCommandBody
> {
  public override method = 'delete' as const;

  constructor(input: CancelSubscriptionCommandInput) {
    const { billingAccountId, subscriptionId } = input;
    super(
      `/billing-accounts/${billingAccountId}/subscriptions/${subscriptionId}`,
    );
  }
}

/**
 * UpdateBillingSubscriptionPromoCodeCommand
 *
 */
export class UpdateBillingSubscriptionPromoCodeCommand extends Command<
  UpdateBillingSubscriptionPromoCodeCommandInput,
  BillingSubscriptionLro,
  UpdateBillingSubscriptionPromoCodeCommandBody
> {
  public override method = 'put' as const;

  constructor(input: UpdateBillingSubscriptionPromoCodeCommandInput) {
    const { billingAccountId, subscriptionId, ...body } = input;
    super(
      `/billing-accounts/${billingAccountId}/subscriptions/${subscriptionId}/promo-code`,
      body,
    );
  }
}
