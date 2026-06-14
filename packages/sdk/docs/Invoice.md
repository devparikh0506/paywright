# Invoice


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**stripeInvoiceId** | **string** |  | [default to undefined]
**customerId** | **string** |  | [default to undefined]
**stripeCustomerId** | **string** |  | [default to undefined]
**stripeSubscriptionId** | **string** |  | [default to undefined]
**amountDue** | **number** |  | [default to undefined]
**amountPaid** | **number** |  | [default to undefined]
**currency** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**hostedInvoiceUrl** | **string** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]

## Example

```typescript
import { Invoice } from '@paywright/sdk';

const instance: Invoice = {
    id,
    stripeInvoiceId,
    customerId,
    stripeCustomerId,
    stripeSubscriptionId,
    amountDue,
    amountPaid,
    currency,
    status,
    hostedInvoiceUrl,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
