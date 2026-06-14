# WebhooksApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**webhooksHandleStripeWebhook**](#webhookshandlestripewebhook) | **POST** /webhooks/stripe | Verify → dedup → enqueue → 200. No business logic here: Stripe retries anything that doesn\&#39;t get a 2xx within ~10s, so the heavy work happens in the background processor.|

# **webhooksHandleStripeWebhook**
> webhooksHandleStripeWebhook()


### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let stripeSignature: string; // (default to undefined)

const { status, data } = await apiInstance.webhooksHandleStripeWebhook(
    stripeSignature
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stripeSignature** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

