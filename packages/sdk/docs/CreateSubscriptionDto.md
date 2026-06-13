# CreateSubscriptionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**customerId** | **string** | Local customer id (UUID) | [default to undefined]
**planId** | **string** | Local plan id (UUID) | [default to undefined]
**trialPeriodDays** | **number** | Free trial length in days — Stripe schedules the first charge | [optional] [default to undefined]
**idempotencyKey** | **string** | Pass the same key on retries to guarantee the subscription is created at most once | [optional] [default to undefined]

## Example

```typescript
import { CreateSubscriptionDto } from '@dev_parikh/paykit';

const instance: CreateSubscriptionDto = {
    customerId,
    planId,
    trialPeriodDays,
    idempotencyKey,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
