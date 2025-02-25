/**
 * This file is auto generated by @block65/openapi-codegen
 *
 * WARN: Do not edit directly.
 *
 * Generated on 2023-05-11T04:29:01.276Z
 *
 */
import type { Jsonifiable } from 'type-fest';
import type { JsonifiableObject } from 'type-fest/source/jsonifiable.js';

export type PromoCode = string;
export type StripeId = string;
export type DateTime = Date;

export enum BillingSubscriptionStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum BillingSubscriptionInterval {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export enum PlanSku {
  Donotuse = 'donotuse',
  Plasku1 = 'plasku1',
  Plasku2 = 'plasku2',
  Plasku3 = 'plasku3',
  Plasku4 = 'plasku4',
}

export type Id = string;
export type BillingSubscriptionIdentifiers = {
  billingAccountId: Id;
  subscriptionId: Id;
};
export type BillingSubscription = BillingSubscriptionIdentifiers & {
  accountId?: Id | undefined;
  planSku: PlanSku;
  interval: BillingSubscriptionInterval;
  status: BillingSubscriptionStatus;
  cycleTime: DateTime;
  trialEndTime?: DateTime | undefined;
  createdTime: DateTime;
  updatedTime?: DateTime | undefined;
};
export type BillingSubscriptions = BillingSubscription[];
export type Uuid = string;
export type LongRunningOperationFail = {
  operationId: Uuid;
  done: boolean;
  result: {
    error: number;
  };
};
export type StringU8 = string;
export type BillingSubscriptionPromoCodeLongRunningOperationSuccess = {
  operationId: Uuid;
  done: boolean;
  result: {
    response: {
      promoCode: StringU8;
    };
  };
};
export type LongRunningOperationIndeterminate = {
  operationId: Uuid;
  done: boolean;
};
export type BillingSubscriptionLro =
  | LongRunningOperationIndeterminate
  | BillingSubscriptionPromoCodeLongRunningOperationSuccess
  | LongRunningOperationFail;
export type UpdateBillingSubscriptionPromoCodeRequest = {
  promoCode: StringU8 | null;
};
/** Reasonable string to be used as a name of a person, or an object */
export type Name = string;
export type UpdateBillingSubscriptionRequest = {
  label?: Name | undefined;
  trialEndTime?: DateTime | undefined;
};
export type CreateBillingSubscriptionRequest = {
  accountId: Id;
  planSku: PlanSku;
  interval: BillingSubscriptionInterval;
  promoCode?: StringU8 | undefined;
};

export enum PaymentMethodBrand {
  Amex = 'amex',
  Diners = 'diners',
  Discover = 'discover',
  Jcb = 'jcb',
  Mastercard = 'mastercard',
  Unionpay = 'unionpay',
  Visa = 'visa',
  Unknown = 'unknown',
}

export type PaymentMethodIdentifiers = {
  billingAccountId: Id;
  paymentMethodId: Id;
};
export type PaymentMethod = PaymentMethodIdentifiers & {
  label: Name;
  expireTime: DateTime;
  humanId: StringU8;
  brand?: PaymentMethodBrand | undefined;
};
export type PaymentMethods = PaymentMethod[];
export type PaymentMethodDeletedLongRunningOperationSuccess = {
  operationId: Uuid;
  done: boolean;
  result: {
    response: {
      ok: boolean;
    };
  };
};
export type PaymentMethodDeletedLro =
  | LongRunningOperationIndeterminate
  | PaymentMethodDeletedLongRunningOperationSuccess
  | LongRunningOperationFail;
export type PaymentMethodLongRunningOperationSuccess = {
  operationId: Uuid;
  done: boolean;
  result: {
    response: {
      clientSecret: string;
    };
  };
};
export type PaymentMethodIntendedLro =
  | LongRunningOperationIndeterminate
  | PaymentMethodLongRunningOperationSuccess
  | LongRunningOperationFail;
export type UpdatePaymentMethodRequest = {
  label?: Name | undefined;
  isDefault?: boolean | undefined;
};
export type LinkBillingAccountRequest = {
  accountId: Id;
};
export type Url = string;
export type BillingAccountPortal = {
  url: Url;
};
export type Origin = string;
export type BillingAccountPortalRequest = {
  origin: Origin;
  accountId: Id;
};
export type TimeZone = string;

export enum BillingLocale {
  En = 'en',
}

export enum BillingAccountType {
  Standard = 'standard',
  Agency = 'agency',
  Reseller = 'reseller',
}

export enum Currency {
  Usd = 'usd',
  Aud = 'aud',
  Sgd = 'sgd',
  Myr = 'myr',
  Gbp = 'gbp',
}

export enum BillingAccountStatus {
  Nominal = 'nominal',
  Delinquent = 'delinquent',
}

export enum BillingCountry {
  Us = 'us',
  Au = 'au',
  Sg = 'sg',
  My = 'my',
  Gb = 'gb',
}

/** Valid email address with fully qualified public top-level domain */
export type Email = string;
export type BillingAccountIdentifiers = {
  billingAccountId: Id;
};
export type BillingAccount = BillingAccountIdentifiers & {
  name: Name;
  email: Email;
  country: BillingCountry;
  status: BillingAccountStatus;
  currency: Currency;
  type: BillingAccountType;
  createdTime: DateTime;
  updatedTime?: DateTime | undefined;
  locale?: BillingLocale | undefined;
  purchaseOrder?: StringU8 | undefined;
  taxId?: StringU8 | undefined;
  timeZone?: TimeZone | undefined;
  defaultPaymentMethodId?: Id | undefined;
};
export type BillingAccountList = BillingAccount[];
export type BillingAccountUpdateRequest = {
  name?: Name | undefined;
  email?: Email | undefined;
  country?: BillingCountry | undefined;
  timeZone?: TimeZone | undefined;
  currency?: Currency | undefined;
  locale?: BillingLocale | null | undefined;
  purchaseOrder?: StringU8 | null | undefined;
  taxId?: StringU8 | null | undefined;
};
export type BillingAccountCreateRequest = {
  name: Name;
  email: Email;
  country: BillingCountry;
  timeZone: TimeZone;
  currency: Currency;
  locale?: BillingLocale | null | undefined;
  purchaseOrder?: StringU8 | null | undefined;
  taxId?: StringU8 | null | undefined;
};
export type LongRunningOperationSuccess = {
  operationId: Uuid;
  done: boolean;
  result: {
    response: JsonifiableObject;
  };
};
export type LongRunningOperation =
  | LongRunningOperationIndeterminate
  | LongRunningOperationFail
  | LongRunningOperationSuccess;
export type GetOperationCommandParams = {
  operationId: string;
};
export type GetOperationCommandInput = GetOperationCommandParams;
export type GetOperationCommandBody = void;
export type ListBillingAccountsCommandInput = void;
export type ListBillingAccountsCommandBody = void;
export type CreateBillingAccountCommandInput = BillingAccountCreateRequest;
export type CreateBillingAccountCommandBody = BillingAccountCreateRequest;
export type GetBillingAccountCommandParams = {
  billingAccountId: string;
};
export type GetBillingAccountCommandInput = GetBillingAccountCommandParams;
export type GetBillingAccountCommandBody = void;
export type UpdateBillingAccountCommandParams = {
  billingAccountId: string;
};
export type UpdateBillingAccountCommandInput = BillingAccountUpdateRequest &
  UpdateBillingAccountCommandParams;
export type UpdateBillingAccountCommandBody = BillingAccountUpdateRequest;
export type GetBillingAccountPortalCommandParams = {
  billingAccountId: string;
};
export type GetBillingAccountPortalCommandInput = BillingAccountPortalRequest &
  GetBillingAccountPortalCommandParams;
export type GetBillingAccountPortalCommandBody = BillingAccountPortalRequest;
export type LinkBillingAccountCommandParams = {
  billingAccountId: string;
};
export type LinkBillingAccountCommandInput = LinkBillingAccountRequest &
  LinkBillingAccountCommandParams;
export type LinkBillingAccountCommandBody = LinkBillingAccountRequest;
export type ListPaymentMethodsCommandParams = {
  billingAccountId: string;
};
export type ListPaymentMethodsCommandInput = ListPaymentMethodsCommandParams;
export type ListPaymentMethodsCommandBody = void;
export type CreatePaymentMethodCommandParams = {
  billingAccountId: string;
};
export type CreatePaymentMethodCommandInput = CreatePaymentMethodCommandParams;
export type CreatePaymentMethodCommandBody = void;
export type GetPaymentMethodFromStripeCommandParams = {
  billingAccountId: string;
  stripePaymentMethodId: string;
};
export type GetPaymentMethodFromStripeCommandInput =
  GetPaymentMethodFromStripeCommandParams;
export type GetPaymentMethodFromStripeCommandBody = void;
export type GetPaymentMethodCommandParams = {
  billingAccountId: string;
  paymentMethodId: string;
};
export type GetPaymentMethodCommandInput = GetPaymentMethodCommandParams;
export type GetPaymentMethodCommandBody = void;
export type UpdatePaymentMethodCommandParams = {
  billingAccountId: string;
  paymentMethodId: string;
};
export type UpdatePaymentMethodCommandInput = UpdatePaymentMethodRequest &
  UpdatePaymentMethodCommandParams;
export type UpdatePaymentMethodCommandBody = UpdatePaymentMethodRequest;
export type DeletePaymentMethodCommandParams = {
  billingAccountId: string;
  paymentMethodId: string;
};
export type DeletePaymentMethodCommandInput = DeletePaymentMethodCommandParams;
export type DeletePaymentMethodCommandBody = void;
export type ListBillingSubscriptionsCommandParams = {
  billingAccountId: string;
};
export type ListBillingSubscriptionsCommandInput =
  ListBillingSubscriptionsCommandParams;
export type ListBillingSubscriptionsCommandBody = void;
export type CreateBillingSubscriptionCommandParams = {
  billingAccountId: string;
};
export type CreateBillingSubscriptionCommandInput =
  CreateBillingSubscriptionRequest & CreateBillingSubscriptionCommandParams;
export type CreateBillingSubscriptionCommandBody =
  CreateBillingSubscriptionRequest;
export type UpdateBillingSubscriptionCommandParams = {
  billingAccountId: string;
  subscriptionId: string;
};
export type UpdateBillingSubscriptionCommandInput =
  UpdateBillingSubscriptionRequest & UpdateBillingSubscriptionCommandParams;
export type UpdateBillingSubscriptionCommandBody =
  UpdateBillingSubscriptionRequest;
export type CancelSubscriptionCommandParams = {
  billingAccountId: string;
  subscriptionId: string;
};
export type CancelSubscriptionCommandInput = CancelSubscriptionCommandParams;
export type CancelSubscriptionCommandBody = void;
export type UpdateBillingSubscriptionPromoCodeCommandParams = {
  billingAccountId: string;
  subscriptionId: string;
};
export type UpdateBillingSubscriptionPromoCodeCommandInput =
  UpdateBillingSubscriptionPromoCodeRequest &
    UpdateBillingSubscriptionPromoCodeCommandParams;
export type UpdateBillingSubscriptionPromoCodeCommandBody =
  UpdateBillingSubscriptionPromoCodeRequest;
