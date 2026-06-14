# Payment


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**stripePaymentIntentId** | **string** |  | [default to undefined]
**customerId** | **string** |  | [default to undefined]
**amount** | **number** | Smallest currency unit (cents) | [default to undefined]
**currency** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]

## Example

```typescript
import { Payment } from '@paywright/sdk';

const instance: Payment = {
    id,
    stripePaymentIntentId,
    customerId,
    amount,
    currency,
    status,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
