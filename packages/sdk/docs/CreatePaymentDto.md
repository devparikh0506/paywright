# CreatePaymentDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**customerId** | **string** | Local customer id (UUID) | [default to undefined]
**amount** | **number** | Amount in smallest currency unit (cents) | [default to undefined]
**currency** | **string** |  | [default to undefined]
**idempotencyKey** | **string** | Pass the same key on retries to guarantee the charge is created at most once | [optional] [default to undefined]

## Example

```typescript
import { CreatePaymentDto } from '@dev_parikh/paykit';

const instance: CreatePaymentDto = {
    customerId,
    amount,
    currency,
    idempotencyKey,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
