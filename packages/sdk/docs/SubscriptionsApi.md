# SubscriptionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**subscriptionsCancel**](#subscriptionscancel) | **DELETE** /api/v1/subscriptions/{id} | Cancel a subscription immediately|
|[**subscriptionsCreate**](#subscriptionscreate) | **POST** /api/v1/subscriptions | Create a subscription (first charge confirmed by frontend)|
|[**subscriptionsGet**](#subscriptionsget) | **GET** /api/v1/subscriptions/{id} | Get a subscription|
|[**subscriptionsList**](#subscriptionslist) | **GET** /api/v1/subscriptions | List subscriptions, optionally by customer|

# **subscriptionsCancel**
> subscriptionsCancel()


### Example

```typescript
import {
    SubscriptionsApi,
    Configuration
} from 'paykit';

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

# **subscriptionsCreate**
> subscriptionsCreate(createSubscriptionDto)


### Example

```typescript
import {
    SubscriptionsApi,
    Configuration,
    CreateSubscriptionDto
} from 'paykit';

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

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **subscriptionsGet**
> subscriptionsGet()


### Example

```typescript
import {
    SubscriptionsApi,
    Configuration
} from 'paykit';

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

# **subscriptionsList**
> subscriptionsList()


### Example

```typescript
import {
    SubscriptionsApi,
    Configuration
} from 'paykit';

const configuration = new Configuration();
const apiInstance = new SubscriptionsApi(configuration);

let customerId: string; // (default to undefined)

const { status, data } = await apiInstance.subscriptionsList(
    customerId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customerId** | [**string**] |  | defaults to undefined|


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

