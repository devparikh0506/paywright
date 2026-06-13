# PaymentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**paymentsCancel**](#paymentscancel) | **POST** /api/v1/payments/{id}/cancel | Cancel an uncaptured payment|
|[**paymentsCreate**](#paymentscreate) | **POST** /api/v1/payments | Create a payment intent|
|[**paymentsGet**](#paymentsget) | **GET** /api/v1/payments/{id} | Get a payment|
|[**paymentsList**](#paymentslist) | **GET** /api/v1/payments | List payments, optionally by customer|
|[**paymentsRefund**](#paymentsrefund) | **POST** /api/v1/payments/{id}/refund | Refund a succeeded payment|

# **paymentsCancel**
> paymentsCancel()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from 'paykit';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.paymentsCancel(
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
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentsCreate**
> paymentsCreate(createPaymentDto)


### Example

```typescript
import {
    PaymentsApi,
    Configuration,
    CreatePaymentDto
} from 'paykit';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let createPaymentDto: CreatePaymentDto; //

const { status, data } = await apiInstance.paymentsCreate(
    createPaymentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPaymentDto** | **CreatePaymentDto**|  | |


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

# **paymentsGet**
> paymentsGet()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from 'paykit';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.paymentsGet(
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

# **paymentsList**
> paymentsList()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from 'paykit';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let customerId: string; // (default to undefined)

const { status, data } = await apiInstance.paymentsList(
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

# **paymentsRefund**
> paymentsRefund()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from 'paykit';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.paymentsRefund(
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
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

