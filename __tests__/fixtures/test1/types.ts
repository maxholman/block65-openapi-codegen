/**
 * This file was auto generated by @block65/openapi-codegen
 *
 * WARN: Do not edit directly.
 *
 * Generated on 2024-10-02T11:43:02.777Z
 *
 */
import type { Jsonifiable, Jsonify } from 'type-fest';
import type { JsonifiableObject } from 'type-fest/source/jsonifiable.js';

export type PromoCode = string;
export type StripeId = string;
export type DateTime = Jsonify<Date>;

export enum BillingSubscriptionStatusEnum {
  Active = 'active',
  Inactive = 'inactive',
}

export type BillingSubscriptionStatusString = 'active' | 'inactive';

export enum BillingSubscriptionIntervalEnum {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export type BillingSubscriptionIntervalString = 'monthly' | 'yearly';

export enum PlanSkuEnum {
  Donotuse = 'donotuse',
  Plasku1 = 'plasku1',
  Plasku2 = 'plasku2',
  Plasku3 = 'plasku3',
  Plasku4 = 'plasku4',
}

export type PlanSkuString =
  | 'donotuse'
  | 'plasku1'
  | 'plasku2'
  | 'plasku3'
  | 'plasku4';
export type Id = string;
export type BillingSubscriptionIdentifiers = {
  billingAccountId: Id;
  subscriptionId: Id;
};
export type BillingSubscription = BillingSubscriptionIdentifiers & {
  accountId?: Id;
  planSku: PlanSkuEnum;
  interval: BillingSubscriptionIntervalEnum;
  status: BillingSubscriptionStatusEnum;
  cycleTime: DateTime;
  trialEndTime?: DateTime;
  createdTime: DateTime;
  updatedTime?: DateTime;
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
  label?: Name;
  trialEndTime?: DateTime;
};
export type CreateBillingSubscriptionRequest = {
  accountId: Id;
  planSku: PlanSkuEnum;
  interval: BillingSubscriptionIntervalEnum;
  promoCode?: StringU8;
};

export enum PaymentMethodBrandEnum {
  Amex = 'amex',
  Diners = 'diners',
  Discover = 'discover',
  Jcb = 'jcb',
  Mastercard = 'mastercard',
  Unionpay = 'unionpay',
  Visa = 'visa',
  Unknown = 'unknown',
}

export type PaymentMethodBrandString =
  | 'amex'
  | 'diners'
  | 'discover'
  | 'jcb'
  | 'mastercard'
  | 'unionpay'
  | 'visa'
  | 'unknown';
export type PaymentMethodIdentifiers = {
  billingAccountId: Id;
  paymentMethodId: Id;
};
export type PaymentMethod = PaymentMethodIdentifiers & {
  label: Name;
  expireTime: DateTime;
  humanId: StringU8;
  brand?: PaymentMethodBrandEnum;
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
  label?: Name;
  isDefault?: boolean;
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

export enum BillingLocaleEnum {
  En = 'en',
}

export type BillingLocaleString = 'en';

export enum BillingAccountTypeEnum {
  Standard = 'standard',
  Agency = 'agency',
  Reseller = 'reseller',
}

export type BillingAccountTypeString = 'standard' | 'agency' | 'reseller';

export enum CurrencyEnum {
  Usd = 'usd',
  Aud = 'aud',
  Sgd = 'sgd',
  Myr = 'myr',
  Gbp = 'gbp',
}

export type CurrencyString = 'usd' | 'aud' | 'sgd' | 'myr' | 'gbp';

export enum BillingAccountStatusEnum {
  Nominal = 'nominal',
  Delinquent = 'delinquent',
}

export type BillingAccountStatusString = 'nominal' | 'delinquent';

export enum BillingCountryEnum {
  Us = 'us',
  Au = 'au',
  Sg = 'sg',
  My = 'my',
  Gb = 'gb',
}

export type BillingCountryString = 'us' | 'au' | 'sg' | 'my' | 'gb';
/** Valid email address with fully qualified public top-level domain */
export type Email = string;
export type BillingAccountIdentifiers = {
  billingAccountId: Id;
};
export type BillingAccount = BillingAccountIdentifiers & {
  name: Name;
  email: Email;
  country: BillingCountryEnum;
  status: BillingAccountStatusEnum;
  currency: CurrencyEnum;
  type: BillingAccountTypeEnum;
  createdTime: DateTime;
  updatedTime?: DateTime;
  locale?: BillingLocaleEnum;
  purchaseOrder?: StringU8;
  taxId?: StringU8;
  timeZone?: TimeZone;
  defaultPaymentMethodId?: Id;
};
export type BillingAccountList = BillingAccount[];
export type BillingAccountUpdateRequest = {
  name?: Name;
  email?: Email;
  country?: BillingCountryEnum;
  timeZone?: TimeZone;
  currency?: CurrencyEnum;
  locale?: BillingLocaleEnum | null;
  purchaseOrder?: StringU8 | null;
  taxId?: StringU8 | null;
};
export type BillingAccountCreateRequest = {
  name: Name;
  email: Email;
  country: BillingCountryEnum;
  timeZone: TimeZone;
  currency: CurrencyEnum;
  locale?: BillingLocaleEnum | null;
  purchaseOrder?: StringU8 | null;
  taxId?: StringU8 | null;
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
  operationId: Uuid;
};
export type GetOperationCommandInput = GetOperationCommandParams;
export type GetOperationCommandBody = unknown;
export type ListBillingAccountsCommandInput = never;
export type ListBillingAccountsCommandBody = unknown;
export type CreateBillingAccountCommandInput = BillingAccountCreateRequest;
export type CreateBillingAccountCommandBody = BillingAccountCreateRequest;
export type GetBillingAccountCommandParams = {
  billingAccountId: Id;
};
export type GetBillingAccountCommandInput = GetBillingAccountCommandParams;
export type GetBillingAccountCommandBody = unknown;
export type UpdateBillingAccountCommandParams = {
  billingAccountId: Id;
};
export type UpdateBillingAccountCommandInput = BillingAccountUpdateRequest &
  UpdateBillingAccountCommandParams;
export type UpdateBillingAccountCommandBody = BillingAccountUpdateRequest;
export type GetBillingAccountPortalCommandParams = {
  billingAccountId: Id;
};
export type GetBillingAccountPortalCommandInput = BillingAccountPortalRequest &
  GetBillingAccountPortalCommandParams;
export type GetBillingAccountPortalCommandBody = BillingAccountPortalRequest;
export type LinkBillingAccountCommandParams = {
  billingAccountId: Id;
};
export type LinkBillingAccountCommandInput = LinkBillingAccountRequest &
  LinkBillingAccountCommandParams;
export type LinkBillingAccountCommandBody = LinkBillingAccountRequest;
export type ListPaymentMethodsCommandParams = {
  billingAccountId: Id;
};
export type ListPaymentMethodsCommandInput = ListPaymentMethodsCommandParams;
export type ListPaymentMethodsCommandBody = unknown;
export type CreatePaymentMethodCommandParams = {
  billingAccountId: Id;
};
export type CreatePaymentMethodCommandInput = CreatePaymentMethodCommandParams;
export type CreatePaymentMethodCommandBody = unknown;
export type GetPaymentMethodFromStripeCommandParams = {
  billingAccountId: Id;
  stripePaymentMethodId: StripeId;
};
export type GetPaymentMethodFromStripeCommandInput =
  GetPaymentMethodFromStripeCommandParams;
export type GetPaymentMethodFromStripeCommandBody = unknown;
export type GetPaymentMethodCommandParams = {
  billingAccountId: Id;
  paymentMethodId: Id;
};
export type GetPaymentMethodCommandInput = GetPaymentMethodCommandParams;
export type GetPaymentMethodCommandBody = unknown;
export type UpdatePaymentMethodCommandParams = {
  billingAccountId: Id;
  paymentMethodId: Id;
};
export type UpdatePaymentMethodCommandInput = UpdatePaymentMethodRequest &
  UpdatePaymentMethodCommandParams;
export type UpdatePaymentMethodCommandBody = UpdatePaymentMethodRequest;
export type DeletePaymentMethodCommandParams = {
  billingAccountId: Id;
  paymentMethodId: Id;
};
export type DeletePaymentMethodCommandInput = DeletePaymentMethodCommandParams;
export type DeletePaymentMethodCommandBody = unknown;
export type ListBillingSubscriptionsCommandParams = {
  billingAccountId: Id;
};
export type ListBillingSubscriptionsCommandInput =
  ListBillingSubscriptionsCommandParams;
export type ListBillingSubscriptionsCommandBody = unknown;
export type CreateBillingSubscriptionCommandParams = {
  billingAccountId: Id;
};
export type CreateBillingSubscriptionCommandInput =
  CreateBillingSubscriptionRequest & CreateBillingSubscriptionCommandParams;
export type CreateBillingSubscriptionCommandBody =
  CreateBillingSubscriptionRequest;
export type UpdateBillingSubscriptionCommandParams = {
  billingAccountId: Id;
  subscriptionId: Id;
};
export type UpdateBillingSubscriptionCommandInput =
  UpdateBillingSubscriptionRequest & UpdateBillingSubscriptionCommandParams;
export type UpdateBillingSubscriptionCommandBody =
  UpdateBillingSubscriptionRequest;
export type CancelSubscriptionCommandParams = {
  billingAccountId: Id;
  subscriptionId: Id;
};
export type CancelSubscriptionCommandInput = CancelSubscriptionCommandParams;
export type CancelSubscriptionCommandBody = unknown;
export type UpdateBillingSubscriptionPromoCodeCommandParams = {
  billingAccountId: Id;
  subscriptionId: Id;
};
export type UpdateBillingSubscriptionPromoCodeCommandInput =
  UpdateBillingSubscriptionPromoCodeRequest &
    UpdateBillingSubscriptionPromoCodeCommandParams;
export type UpdateBillingSubscriptionPromoCodeCommandBody =
  UpdateBillingSubscriptionPromoCodeRequest;
