# SubscriptionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**subscriptionsCancel**](#subscriptionscancel) | **DELETE** /api/v1/subscriptions/{id} | Cancel a subscription immediately|
|[**subscriptionsCreate**](#subscriptionscreate) | **POST** /api/v1/subscriptions | Create a subscription (first charge confirmed by frontend)|
|[**subscriptionsGet**](#subscriptionsget) | **GET** /api/v1/subscriptions/{id} | Get a subscription|
|[**subscriptionsList**](#subscriptionslist) | **GET** /api/v1/subscriptions | List subscriptions, optionally by customer|

# **subscriptionsCancel**
> Subscription subscriptionsCancel()


### Example

```typescript
import {
    SubscriptionsApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new SubscriptionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.subscriptionsCancel(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Subscription**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsCreate**
> CreateSubscriptionResult subscriptionsCreate(createSubscriptionDto)


### Example

```typescript
import {
    SubscriptionsApi,
    Configuration,
    CreateSubscriptionDto
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new SubscriptionsApi(configuration);

let createSubscriptionDto: CreateSubscriptionDto; //

const { status, data } = await apiInstance.subscriptionsCreate(
    createSubscriptionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createSubscriptionDto** | **CreateSubscriptionDto**|  | |


### Return type

**CreateSubscriptionResult**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsGet**
> Subscription subscriptionsGet()


### Example

```typescript
import {
    SubscriptionsApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new SubscriptionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.subscriptionsGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Subscription**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsList**
> SubscriptionList subscriptionsList()


### Example

```typescript
import {
    SubscriptionsApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new SubscriptionsApi(configuration);

let customerId: string; // (optional) (default to undefined)
let limit: any; // (optional) (default to undefined)
let page: any; // (optional) (default to undefined)

const { status, data } = await apiInstance.subscriptionsList(
    customerId,
    limit,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customerId** | [**string**] |  | (optional) defaults to undefined|
| **limit** | **any** |  | (optional) defaults to undefined|
| **page** | **any** |  | (optional) defaults to undefined|


### Return type

**SubscriptionList**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

